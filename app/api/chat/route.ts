import { convertToModelMessages, streamText, type UIMessage } from "ai";

import {
  createLanguageModel,
  getProviderAvailabilityError,
  resolveRequestedModel,
} from "@/lib/ai/models.server";
import { buildSystemPrompt } from "@/lib/constants/prompts/system";
import { resolveToneOfVoice } from "@/lib/constants/tone-of-voice";
import { parseJsonBody, isErrorResponse } from "@/lib/api-utils";
import type { BrandKit, BrandColors, SocialLink } from "@/lib/brands/brand-types";

type ChatRequestBody = {
  messages?: unknown;
  providerId?: unknown;
  modelId?: unknown;
  toneOfVoice?: unknown;
  brandKit?: unknown;
};

function parseBrandKit(raw: unknown): BrandKit | undefined {
  if (!raw || typeof raw !== "object") return undefined;

  const obj = raw as Record<string, unknown>;

  if (typeof obj.kitName !== "string" || !obj.kitName) return undefined;

  const colors: BrandColors = {
    background:
      typeof (obj.colors as Record<string, unknown>)?.background === "string"
        ? ((obj.colors as Record<string, unknown>).background as string)
        : "#f4f4f5",
    container:
      typeof (obj.colors as Record<string, unknown>)?.container === "string"
        ? ((obj.colors as Record<string, unknown>).container as string)
        : "#ffffff",
    foreground:
      typeof (obj.colors as Record<string, unknown>)?.foreground === "string"
        ? ((obj.colors as Record<string, unknown>).foreground as string)
        : "#18181b",
    accent:
      typeof (obj.colors as Record<string, unknown>)?.accent === "string"
        ? ((obj.colors as Record<string, unknown>).accent as string)
        : "#18181b",
    buttonText:
      typeof (obj.colors as Record<string, unknown>)?.buttonText === "string"
        ? ((obj.colors as Record<string, unknown>).buttonText as string)
        : "#ffffff",
  };

  const socials: SocialLink[] = Array.isArray(obj.socials)
    ? (obj.socials as Record<string, unknown>[])
        .filter(
          (s) => typeof s.platform === "string" && typeof s.url === "string"
        )
        .map((s) => ({
          platform: s.platform as string,
          url: s.url as string,
        }))
    : [];

  return {
    kitName: obj.kitName as string,
    website: typeof obj.website === "string" ? obj.website : "",
    brandSummary: typeof obj.brandSummary === "string" ? obj.brandSummary : "",
    address: typeof obj.address === "string" ? obj.address : "",
    toneOfVoice: typeof obj.toneOfVoice === "string" ? obj.toneOfVoice : "neutral",
    copyright: typeof obj.copyright === "string" ? obj.copyright : "",
    footer: typeof obj.footer === "string" ? obj.footer : "",
    disclaimers: typeof obj.disclaimers === "string" ? obj.disclaimers : "",
    socials,
    primaryLogo:
      typeof obj.primaryLogo === "string" ? obj.primaryLogo : null,
    iconLogo: typeof obj.iconLogo === "string" ? obj.iconLogo : null,
    colors,
  };
}

export async function POST(req: Request) {
  const bodyOrError = await parseJsonBody<ChatRequestBody>(req);
  if (isErrorResponse(bodyOrError)) return bodyOrError;
  const body = bodyOrError;

  if (!Array.isArray(body.messages)) {
    return new Response("Request body must include a `messages` array.", {
      status: 400,
    });
  }

  const selection = resolveRequestedModel(body.providerId, body.modelId);
  const toneOfVoice = resolveToneOfVoice(body.toneOfVoice);
  const brandKit = parseBrandKit(body.brandKit);
  const availabilityError = getProviderAvailabilityError(selection.providerId);
  if (availabilityError) {
    return new Response(availabilityError, { status: 400 });
  }

  const result = streamText({
    model: createLanguageModel(selection.providerId, selection.modelId),
    messages: await convertToModelMessages(body.messages as UIMessage[]),
    system: buildSystemPrompt(toneOfVoice, brandKit),
  });

  return result.toUIMessageStreamResponse();
}
