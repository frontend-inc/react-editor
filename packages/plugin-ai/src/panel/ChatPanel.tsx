import {
  useCallback,
  useMemo,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithToolCalls,
  type UIMessage,
} from "ai";
import { ArrowDown, CornerDownLeft } from "lucide-react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { useGetEditor, usePropsContext } from "@reacteditor/core";
import type { AiPluginOptions, EditorContextPayload } from "../types";
import { callBuiltin } from "../tools/handlers";
import { labelFor } from "../tools/labels";
import { ChatAiIcon } from "./ChatAiIcon";
import { Loader } from "./Loader";
import { LoadingDots } from "./LoadingDots";
import { Markdown } from "./Markdown";
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
    stop,
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

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      // Enter submits, Shift+Enter inserts a newline.
      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
      }
    },
    []
  );

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className={styles.AiPanel}>
      <StickToBottom
        className={styles["AiPanel-messages"]}
        initial="smooth"
        resize="smooth"
        role="log"
      >
        <StickToBottom.Content className={styles["AiPanel-messagesContent"]}>
          {messages.length === 0 ? (
            <div className={styles["AiPanel-empty"]}>
              <div className={styles["AiPanel-empty-icon"]}>
                <ChatAiIcon size={28} />
              </div>
              <div className={styles["AiPanel-empty-text"]}>
                Ask AI to update your site
              </div>
            </div>
          ) : (
            messages.map((m) => <Message key={m.id} message={m} />)
          )}

          {isLoading && needsThinkingHint(messages) && (
            <div className={styles["AiPanel-toolCall"]}>Thinking...</div>
          )}
        </StickToBottom.Content>

        <ScrollToBottomButton />
      </StickToBottom>

      {error && (
        <div className={styles["AiPanel-error"]}>
          {error.message ?? "Something went wrong."}
        </div>
      )}

      {isLoading && <LoadingDots />}

      <form className={styles["AiPanel-form"]} onSubmit={onSubmit}>
        <div className={styles["AiPanel-inputGroup"]}>
          <textarea
            className={styles["AiPanel-input"]}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Message…"
            rows={2}
            disabled={isLoading}
          />
          <div className={styles["AiPanel-inputGroup-actions"]}>
            <button
              className={styles["AiPanel-send"]}
              type={isLoading ? "button" : "submit"}
              aria-label={isLoading ? "Stop" : "Send"}
              onClick={isLoading ? () => stop() : undefined}
              disabled={!isLoading && !input.trim()}
            >
              {isLoading ? <Loader size={14} /> : <CornerDownLeft />}
            </button>
          </div>
        </div>
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
      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <div key={i} className={styles["AiPanel-message-bubble"]}>
              <Markdown text={part.text} />
            </div>
          );
        }
        if (part.type.startsWith("tool-")) {
          const toolName = part.type.slice("tool-".length);
          const partAny = part as { input?: unknown; state?: string };
          const args = partAny.input;
          // Shimmer only while the tool is in flight; once a result lands
          // (state === "output-available"), settle into a static muted line.
          const isActive = partAny.state !== "output-available";
          return (
            <div
              key={i}
              className={
                isActive
                  ? styles["AiPanel-toolCall"]
                  : styles["AiPanel-toolCall-done"]
              }
            >
              {labelFor(toolName, args, !isActive)}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const ScrollToBottomButton = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();
  if (isAtBottom) return null;
  return (
    <button
      type="button"
      aria-label="Scroll to bottom"
      className={styles["AiPanel-scrollDown"]}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown size={14} />
    </button>
  );
};

// True when no tool/text parts are present yet on the latest assistant
// message — i.e. the brief gap between submit and the first stream chunk.
// Once any part lands (a text token or a tool call), the inline shimmer
// already conveys activity and a separate "Thinking..." line would dupe it.
const needsThinkingHint = (messages: UIMessage[]) => {
  const last = messages[messages.length - 1];
  if (!last || last.role !== "assistant") return true;
  return (last.parts ?? []).every(
    (p) => p.type !== "text" && !p.type.startsWith("tool-")
  );
};
