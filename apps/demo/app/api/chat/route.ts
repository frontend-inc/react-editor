import { anthropic } from "@ai-sdk/anthropic";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import {
  reactEditorTools,
  getEditorContext,
} from "@reacteditor/plugin-ai/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  messages: UIMessage[];
  editorContext?: Parameters<typeof getEditorContext>[0];
};

export async function POST(req: Request) {
  const { messages, editorContext } = (await req.json()) as Body;

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: getEditorContext(editorContext),
    messages: await convertToModelMessages(messages),
    tools: { ...reactEditorTools },
    // Lets the model loop through tool calls + their results in a single
    // request instead of stopping after the first tool call.
    stopWhen: stepCountIs(50),
  });

  return result.toUIMessageStreamResponse();
}
