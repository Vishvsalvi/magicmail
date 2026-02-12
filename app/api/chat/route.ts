import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { SYSTEM_PROMPT } from "@/lib/constants/prompts/system";

const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai(model),
    messages: await convertToModelMessages(messages),
    system: SYSTEM_PROMPT,
  });

  return result.toUIMessageStreamResponse();
}
