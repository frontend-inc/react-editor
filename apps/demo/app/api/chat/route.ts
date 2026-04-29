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

  console.log("[chat] →", {
    messageCount: messages.length,
    editorContext,
  });

  const result = streamText({
    model: anthropic("claude-sonnet-4-5"),
    system: getEditorContext(editorContext),
    messages: await convertToModelMessages(messages),
    tools: { ...reactEditorTools },
    // Lets the model loop through tool calls + their results in a single
    // request instead of stopping after the first tool call.
    stopWhen: stepCountIs(50),
    onStepFinish: ({ text, toolCalls, finishReason }) => {
      if (toolCalls?.length) {
        console.log(
          "[chat] step → tools",
          toolCalls.map((c) => ({
            tool: c.toolName,
            input: c.input,
          }))
        );
      }
      if (text) console.log("[chat] step → text", text);
      console.log("[chat] step finish:", finishReason);
    },
    onError: ({ error }) => {
      console.error("[chat] error", error);
    },
  });

  return result.toUIMessageStreamResponse();
}
