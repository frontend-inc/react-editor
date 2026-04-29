import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type UIMessage,
} from "ai";
import { useGetEditor, usePropsContext } from "@reacteditor/core";
import type { AiPluginOptions, EditorContextPayload } from "../types";
import { callBuiltin } from "../tools/handlers";
import { labelFor } from "../tools/labels";
import styles from "./styles.module.css";

const collectEditorContext = (
  getEditor: ReturnType<typeof useGetEditor>,
  currentPath?: string,
  routeTitle?: string
): EditorContextPayload => {
  const editor = getEditor();
  return {
    currentRoute: currentPath
      ? { path: currentPath, title: routeTitle }
      : null,
    selectedComponentId: editor.selectedItem?.props?.id ?? null,
    componentTypes: Object.keys(editor.config.components ?? {}),
  };
};

export const ChatPanel = ({ options }: { options: AiPluginOptions }) => {
  const getEditor = useGetEditor();
  const props = usePropsContext();
  const currentPath = (props as { currentPath?: string }).currentPath;
  const routeTitle = useMemo(() => {
    const routes = (props as { routes?: { path: string; title: string }[] })
      .routes;
    return routes?.find((r) => r.path === currentPath)?.title;
  }, [props, currentPath]);

  // Dynamic header/body resolution lets the user merge or replace headers
  // and body without re-creating the transport on every render.
  const transport = useMemo(() => {
    if (options.transport) return options.transport;
    return new DefaultChatTransport({
      api: options.api,
      headers: async () => {
        if (typeof options.headers === "function") return await options.headers();
        return options.headers ?? {};
      },
      // body is a function of the message list — re-evaluated each request,
      // so editorContext always reflects the current editor state.
      body: () => {
        const editorContext = collectEditorContext(
          getEditor,
          currentPath,
          routeTitle
        );
        const userBody =
          typeof options.body === "function"
            ? options.body([])
            : options.body ?? {};
        return { editorContext, ...userBody };
      },
    });
  }, [options, getEditor, currentPath, routeTitle]);

  const {
    messages,
    sendMessage,
    addToolOutput,
    status,
    error,
  } = useChat({
    transport,
    messages: options.messages,
    // Re-issues the request once every client tool call on the last
    // assistant message has its output. Without this the model stops after
    // emitting tool calls and never sees the results. Pairs with stopWhen
    // on the server (which controls the per-request loop ceiling).
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onFinish: options.onFinish,
    onError: options.onError,
    onToolCall: async ({ toolCall }) => {
      // Stage 1: user-supplied interceptor wins if it returns a defined value.
      if (options.onToolCall) {
        const result = await options.onToolCall({ toolCall });
        if (result !== undefined) {
          // The AI SDK explicitly recommends calling addToolOutput without
          // await here to avoid a deadlock with the streaming loop.
          addToolOutput({
            tool: toolCall.toolName,
            toolCallId: toolCall.toolCallId,
            output: result,
          });
          return;
        }
      }

      // Stage 2: built-in handlers run inside the editor store.
      const editor = getEditor();
      const output = await callBuiltin(
        toolCall.toolName,
        toolCall.input,
        { getEditor, dispatch: editor.dispatch }
      );
      if (output !== undefined) {
        addToolOutput({
          tool: toolCall.toolName,
          toolCallId: toolCall.toolCallId,
          output,
        });
      }
    },
  });

  const [input, setInput] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = messagesRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = input.trim();
      if (!trimmed || status === "streaming") return;
      sendMessage({ text: trimmed });
      setInput("");
    },
    [sendMessage, status, input]
  );

  return (
    <div className={styles.AiPanel}>
      <div ref={messagesRef} className={styles["AiPanel-messages"]}>
        {messages.length === 0 ? (
          <div className={styles["AiPanel-empty"]}>
            Ask the assistant to edit your page.
          </div>
        ) : (
          messages.map((m) => <Message key={m.id} message={m} />)
        )}

        {status === "streaming" && <ActivePill messages={messages} />}
      </div>

      {error && (
        <div className={styles["AiPanel-error"]}>
          {error.message ?? "Something went wrong."}
        </div>
      )}

      <form className={styles["AiPanel-form"]} onSubmit={onSubmit}>
        <input
          className={styles["AiPanel-input"]}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message…"
          disabled={status === "streaming"}
        />
        <button
          className={styles["AiPanel-send"]}
          type="submit"
          disabled={status === "streaming" || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

const Message = ({ message }: { message: UIMessage }) => {
  const isUser = message.role === "user";
  return (
    <div
      className={`${styles["AiPanel-message"]} ${
        isUser ? styles["AiPanel-message--user"] : ""
      }`}
    >
      <span className={styles["AiPanel-message-author"]}>
        {isUser ? "You" : "Assistant"}
      </span>
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <div key={i} className={styles["AiPanel-message-bubble"]}>
              {part.text}
            </div>
          );
        }
        if (part.type.startsWith("tool-")) {
          const toolName = part.type.slice("tool-".length);
          const args = (part as { input?: unknown }).input;
          return (
            <div key={i} className={styles["AiPanel-pill"]}>
              {labelFor(toolName, args)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const ActivePill = ({ messages }: { messages: UIMessage[] }) => {
  // Show a pill for the most recent in-flight tool call, if any.
  const last = messages[messages.length - 1];
  if (!last) return null;
  const toolPart = [...last.parts]
    .reverse()
    .find((p) => p.type.startsWith("tool-")) as
    | { type: string; input?: unknown; state?: string }
    | undefined;
  if (toolPart && toolPart.state !== "output-available") {
    const toolName = toolPart.type.slice("tool-".length);
    return (
      <div className={styles["AiPanel-pill"]}>
        {labelFor(toolName, toolPart.input)}
      </div>
    );
  }
  return <div className={styles["AiPanel-pill"]}>Thinking…</div>;
};
