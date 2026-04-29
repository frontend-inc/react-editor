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
};

export type EditorContextPayload = {
  currentRoute: { path?: string; title?: string } | null;
  selectedComponentId: string | null;
  componentTypes: string[];
};
