import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  createLanguageModel,
  getProviderAvailabilityError,
  resolveRequestedModel,
} from "@/lib/ai/models.server";
import { buildSystemPrompt } from "@/lib/constants/prompts/system";
import { resolveToneOfVoice } from "@/lib/constants/tone-of-voice";

type ChatRequestBody = {
  messages?: unknown;
  providerId?: unknown;
  modelId?: unknown;
  toneOfVoice?: unknown;
};

export async function POST(req: Request) {
  let body: ChatRequestBody;

  try {
    body = (await req.json()) as ChatRequestBody;
  } catch {
    return new Response("Invalid JSON body.", { status: 400 });
  }

  if (!Array.isArray(body.messages)) {
    return new Response("Request body must include a `messages` array.", {
      status: 400,
    });
  }

  const selection = resolveRequestedModel(body.providerId, body.modelId);
  const toneOfVoice = resolveToneOfVoice(body.toneOfVoice);
  const availabilityError = getProviderAvailabilityError(selection.providerId);
  if (availabilityError) {
    return new Response(availabilityError, { status: 400 });
  }

  const result = streamText({
    model: createLanguageModel(selection.providerId, selection.modelId),
    messages: await convertToModelMessages(body.messages as UIMessage[]),
    system: buildSystemPrompt(toneOfVoice),
  });

  return result.toUIMessageStreamResponse();
}
