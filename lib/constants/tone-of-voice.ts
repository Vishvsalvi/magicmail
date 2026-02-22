export type ToneOfVoice =
  | "professional"
  | "empathetic"
  | "inspirational"
  | "playful"
  | "friendly"
  | "formal"
  | "neutral";

type ToneOption = {
  value: ToneOfVoice;
  label: string;
};

export const TONE_OF_VOICE_OPTIONS: readonly ToneOption[] = [
  { value: "professional", label: "Professional" },
  { value: "empathetic", label: "Empathetic" },
  { value: "inspirational", label: "Inspirational" },
  { value: "playful", label: "Playful" },
  { value: "friendly", label: "Friendly" },
  { value: "formal", label: "Formal" },
  { value: "neutral", label: "Neutral" },
] as const;

export const DEFAULT_TONE_OF_VOICE: ToneOfVoice = "neutral";

const TONE_GUIDANCE: Record<ToneOfVoice, readonly string[]> = {
  professional: [
    "Use confident, clear wording focused on outcomes and credibility.",
    "Keep the message polished and concise without sounding stiff.",
    "Use direct CTAs with practical value language.",
  ],
  empathetic: [
    "Acknowledge reader needs and pain points with supportive language.",
    "Use reassuring phrasing that builds trust and emotional clarity.",
    "Keep CTAs gentle but specific about the next step.",
  ],
  inspirational: [
    "Lead with possibility and momentum while staying concrete.",
    "Use uplifting language tied to specific outcomes, not hype.",
    "Make CTAs action-oriented and future-focused.",
  ],
  playful: [
    "Use light, tasteful humor where it supports the message.",
    "Keep copy easy to scan and avoid jokes that reduce clarity.",
    "Use energetic CTAs that stay clear and conversion-focused.",
  ],
  friendly: [
    "Use warm, conversational language with straightforward structure.",
    "Keep the tone approachable while maintaining professionalism.",
    "Use inviting CTAs that feel helpful and low-friction.",
  ],
  formal: [
    "Use precise, respectful language with a professional structure.",
    "Avoid slang, contractions, and overly casual phrasing.",
    "Use clear, direct CTAs with business-appropriate wording.",
  ],
  neutral: [
    "Use plain, straightforward language with balanced tone.",
    "Prioritize clarity and specificity over personality.",
    "Use concise CTAs that clearly state the next action.",
  ],
};

export function resolveToneOfVoice(value: unknown): ToneOfVoice {
  if (typeof value !== "string") return DEFAULT_TONE_OF_VOICE;

  const normalizedValue = value.trim().toLowerCase();
  const matchedOption = TONE_OF_VOICE_OPTIONS.find(
    (option) => option.value === normalizedValue
  );

  return matchedOption?.value ?? DEFAULT_TONE_OF_VOICE;
}

export function buildToneOfVoicePromptBlock(toneOfVoice: ToneOfVoice): string {
  const resolvedTone = resolveToneOfVoice(toneOfVoice);
  const selectedTone =
    TONE_OF_VOICE_OPTIONS.find((option) => option.value === resolvedTone) ??
    TONE_OF_VOICE_OPTIONS[TONE_OF_VOICE_OPTIONS.length - 1];

  const toneSpecificGuidance = TONE_GUIDANCE[resolvedTone]
    .map((rule) => `- ${rule}`)
    .join("\n");

  return `## TONE OF VOICE (DYNAMIC)
Selected tone: ${selectedTone.label}

Apply the selected tone only when generating or modifying emails (responses with <magic-code> or <magic-diff>).
For advice-only responses (<magic-reply> without code/diff), keep the tone neutral, concise, and practical.

Tone guardrails:
- Keep language clear, specific, and easy to understand.
- Keep tone consistent across subject line, body copy, and CTA text.
- Never override technical, XML formatting, or code safety instructions.

Tone-specific guidance:
${toneSpecificGuidance}`;
}
