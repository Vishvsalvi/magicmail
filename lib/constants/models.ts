export type ProviderId = "openai" | "gemini" | "claude";

type ApiKeyEnvVar =
  | "OPENAI_API_KEY"
  | "GOOGLE_GENERATIVE_AI_API_KEY"
  | "ANTHROPIC_API_KEY";

type ProviderConfig = {
  label: string;
  apiKeyEnvVar: ApiKeyEnvVar;
  models: ReadonlyArray<{
    id: string;
    label: string;
  }>;
};

export const MODEL_REGISTRY = {
  openai: {
    label: "OpenAI",
    apiKeyEnvVar: "OPENAI_API_KEY",
    models: [
      { id: "gpt-5-mini", label: "GPT-5 Mini" },
      { id: "gpt-5-nano", label: "GPT-5 Nano" },
      { id: "gpt-5.2", label: "GPT-5.2" },
    ],
  },
  gemini: {
    label: "Gemini",
    apiKeyEnvVar: "GOOGLE_GENERATIVE_AI_API_KEY",
    models: [
      { id: "gemini-3-pro-preview", label: "Gemini 3 Pro Preview" },
      { id: "gemini-3.1-pro-preview", label: "Gemini 3.1 Pro Preview" },
      { id: "gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
    ],
  },
  claude: {
    label: "Claude",
    apiKeyEnvVar: "ANTHROPIC_API_KEY",
    models: [{ id: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" }],
  },
} as const satisfies Record<ProviderId, ProviderConfig>;

export type ModelSelection = {
  providerId: ProviderId;
  modelId: string;
};

export type ProviderAvailability = Record<ProviderId, boolean>;

export type FlattenedModelOption = ModelSelection & {
  value: string;
  providerLabel: string;
  modelLabel: string;
};

export const DEFAULT_MODEL_SELECTION: ModelSelection = {
  providerId: "openai",
  modelId: MODEL_REGISTRY.openai.models[0].id,
};

export function isProviderId(value: unknown): value is ProviderId {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(MODEL_REGISTRY, value)
  );
}

export function getProvider(providerId: ProviderId) {
  return MODEL_REGISTRY[providerId];
}

export function getModel(providerId: ProviderId, modelId: string) {
  return MODEL_REGISTRY[providerId].models.find((model) => model.id === modelId);
}

export function resolveModelSelection(
  providerId: unknown,
  modelId: unknown
): ModelSelection {
  const safeProviderId = isProviderId(providerId)
    ? providerId
    : DEFAULT_MODEL_SELECTION.providerId;
  const provider = getProvider(safeProviderId);
  const safeModel =
    typeof modelId === "string"
      ? provider.models.find((model) => model.id === modelId)
      : undefined;

  return {
    providerId: safeProviderId,
    modelId: safeModel?.id ?? provider.models[0].id,
  };
}

export function selectionToValue(selection: ModelSelection): string {
  return `${selection.providerId}:${selection.modelId}`;
}

export function parseSelectionValue(value: string): ModelSelection | null {
  const [providerId, ...modelChunks] = value.split(":");
  if (!providerId || modelChunks.length === 0 || !isProviderId(providerId)) {
    return null;
  }

  const modelId = modelChunks.join(":");
  const model = getModel(providerId, modelId);
  if (!model) return null;

  return { providerId, modelId: model.id };
}

export function flattenModelOptions(): FlattenedModelOption[] {
  return (Object.keys(MODEL_REGISTRY) as ProviderId[]).flatMap((providerId) => {
    const provider = getProvider(providerId);

    return provider.models.map((model) => ({
      providerId,
      modelId: model.id,
      value: selectionToValue({ providerId, modelId: model.id }),
      providerLabel: provider.label,
      modelLabel: model.label,
    }));
  });
}

export function getMissingApiKeyError(providerId: ProviderId): string {
  const provider = getProvider(providerId);
  return `${provider.label} is not configured. Add ${provider.apiKeyEnvVar} to your .env file.`;
}
