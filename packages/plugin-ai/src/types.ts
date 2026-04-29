import type { UIMessage, ChatTransport, ChatOnToolCallCallback } from "ai";

type OnToolCallEvent = Parameters<ChatOnToolCallCallback<UIMessage>>[0];

export type AiPluginOptions = {
  api: string;
  headers?:
    | Record<string, string>
    | (() => Record<string, string> | Promise<Record<string, string>>);
  body?:
    | Record<string, unknown>
    | ((messages: UIMessage[]) => Record<string, unknown>);
  transport?: ChatTransport<UIMessage>;
  onFinish?: (event: { message: UIMessage }) => void;
  onError?: (error: Error) => void;
  onToolCall?: (event: OnToolCallEvent) => unknown | Promise<unknown> | undefined;
  messages?: UIMessage[];

  /**
   * Enable file attachments on the chat input. When `true`, a paperclip
   * button is shown next to the textarea that opens an image-only file
   * picker. Selected files are sent with the next message via the AI SDK's
   * sendMessage({ files }) API. Default: `false`.
   */
  attachments?: boolean;
};

export type EditorContextPayload = {
  currentRoute: { path?: string; title?: string } | null;
  selectedComponentId: string | null;
  componentTypes: string[];
};
