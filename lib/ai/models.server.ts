import "server-only";

import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";

import {
  MODEL_REGISTRY,
  getMissingApiKeyError,
  resolveModelSelection,
  type ModelSelection,
  type ProviderAvailability,
  type ProviderId,
} from "@/lib/constants/models";

function hasApiKey(envVar: string): boolean {
  return Boolean(process.env[envVar]?.trim());
}

export function getProviderAvailability(): ProviderAvailability {
  return {
    openai: hasApiKey(MODEL_REGISTRY.openai.apiKeyEnvVar),
    gemini: hasApiKey(MODEL_REGISTRY.gemini.apiKeyEnvVar),
    claude: hasApiKey(MODEL_REGISTRY.claude.apiKeyEnvVar),
  };
}

export function isProviderAvailable(
  providerId: ProviderId,
  availability: ProviderAvailability = getProviderAvailability()
): boolean {
  return availability[providerId];
}

export function getProviderAvailabilityError(
  providerId: ProviderId,
  availability: ProviderAvailability = getProviderAvailability()
): string | null {
  if (availability[providerId]) return null;
  return getMissingApiKeyError(providerId);
}

export function resolveRequestedModel(
  providerId: unknown,
  modelId: unknown
): ModelSelection {
  return resolveModelSelection(providerId, modelId);
}

export function createLanguageModel(providerId: ProviderId, modelId: string) {
  switch (providerId) {
    case "openai":
      return openai(modelId);
    case "gemini":
      return google(modelId);
    case "claude":
      return anthropic(modelId);
  }
}
