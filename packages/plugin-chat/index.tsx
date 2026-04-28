import type { Plugin } from "@/core/types";
import type { Config } from "@/core/types";
import { ChatIcon } from "./icon";
import { Panel } from "./Panel";
import type { AiConfig } from "./types";

export type { AiConfig } from "./types";
export type {
  EditorContext,
  PrepareBodyContext,
  Selection,
  SendAutomaticallyWhen,
  ToolCall,
} from "./types";

const createChatPlugin = <UserConfig extends Config = Config>(
  aiConfig: AiConfig<UserConfig>
): Plugin<UserConfig> => {
  return {
    name: "chat",
    label: "Chat",
    icon: <ChatIcon />,
    render: () => <Panel aiConfig={aiConfig as AiConfig} />,
  };
};

export default createChatPlugin;
