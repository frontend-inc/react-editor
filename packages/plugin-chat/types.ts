import type { UIMessage } from "ai";
import type { Config, Data } from "@/core/types";

export type Selection = {
  blockId: string;
  fieldPath?: string[];
};

export type EditorContext<UserConfig extends Config = Config> = {
  config: UserConfig;
  data: Data;
  selection?: Selection;
};

export type PrepareBodyContext<UserConfig extends Config = Config> = {
  messages: UIMessage[];
  editor: EditorContext<UserConfig>;
};

export type ToolCall = {
  toolCallId: string;
  toolName: string;
  input: unknown;
};

export type SendAutomaticallyWhen = (args: {
  messages: UIMessage[];
}) => boolean;

export type AiConfig<UserConfig extends Config = Config> = {
  api: string;
  headers?: HeadersInit | (() => HeadersInit | Promise<HeadersInit>);
  prepareBody?: (
    ctx: PrepareBodyContext<UserConfig>
  ) => unknown | Promise<unknown>;

  toolNames?: Record<string, string>;
  onToolCall?: (args: {
    toolCall: ToolCall;
  }) => unknown | Promise<unknown>;

  initialMessages?: UIMessage[];
  sendAutomaticallyWhen?: SendAutomaticallyWhen;
  throttle?: number;
  generateId?: () => string;

  onFinish?: (args: { message: UIMessage }) => void;
  onError?: (error: Error) => void;
};
