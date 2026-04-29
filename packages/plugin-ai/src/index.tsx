import { MessageSquare } from "lucide-react";
import type { Plugin } from "@reacteditor/core";
import type { AiPluginOptions } from "./types";
import { ChatPanel } from "./panel/ChatPanel";

export type { AiPluginOptions } from "./types";
export { DEFAULT_LABELS, labelFor, humanize } from "./tools/labels";

export const aiPlugin = (options: AiPluginOptions): Plugin => ({
  name: "ai",
  label: "AI",
  icon: <MessageSquare />,
  render: () => <ChatPanel options={options} />,
});

export default aiPlugin;
