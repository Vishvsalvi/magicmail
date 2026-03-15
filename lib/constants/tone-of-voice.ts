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

type ToneDesignProfile = {
  voice_guidance: readonly string[];
  font_stack: string;
  color_direction: string;
  alignment_layout: string;
  spacing_density: string;
  cta_treatment: string;
  imagery_shape_details: string;
  copy_personality: string;
  headline_style: string;
  opening_pattern: string;
  proof_style: string;
  urgency_approach: string;
  objection_handling_style: string;
};

const TONE_DESIGN_PROFILES: Record<ToneOfVoice, ToneDesignProfile> = {
  professional: {
    voice_guidance: [
      "Use confident, clear wording focused on outcomes and credibility.",
      "Keep the message polished and concise without sounding stiff.",
      "Use direct CTAs with practical value language.",
      "Replace adjectives with data points wherever possible.",
      "Write like a trusted advisor - assume intelligence, skip the hand-holding.",
      "Use parallel structure in lists and section headers for scannability.",
    ],
    font_stack: "Aptos, Segoe UI, Helvetica Neue, Arial, sans-serif",
    color_direction:
      "Cool restrained palette using ink, navy, and slate neutrals plus one clear accent.",
    alignment_layout:
      "Use left-aligned body content with clean, structured sectioning and clear hierarchy.",
    spacing_density:
      "Maintain medium spacing density with balanced white space and compact rhythm.",
    cta_treatment:
      "Use a solid, high-contrast rectangular primary CTA with direct action language.",
    imagery_shape_details:
      "Prefer clean cards, subtle borders, and minimal decorative shapes for a credible premium look.",
    copy_personality:
      "Authoritative but not cold. Like a senior consultant - confident, evidence-based, concise.",
    headline_style:
      "Outcome-driven with specifics. Prefer numbers and concrete results over vague promises.",
    opening_pattern:
      "Lead with the key insight or result. No greetings. Value in the first sentence.",
    proof_style:
      "Hard metrics and named case studies. '47% reduction in churn' over 'customers love us.'",
    urgency_approach:
      "Deadline-based and factual. 'Enrollment closes March 15' - never fake scarcity.",
    objection_handling_style:
      "Preemptive. Address the top concern before the reader raises it, using data.",
  },
  empathetic: {
    voice_guidance: [
      "Acknowledge reader needs and pain points with supportive language.",
      "Use reassuring phrasing that builds trust and emotional clarity.",
      "Keep CTAs gentle but specific about the next step.",
      "Mirror the reader's likely emotional state before offering solutions.",
      "Use 'you' more than 'we' - center the reader's experience.",
      "Avoid toxic positivity - validate difficulty before pivoting to hope.",
    ],
    font_stack:
      "Headings: Playfair Display, Georgia, Cambria, serif (use italic variant for subheadings) | Body: Verdana, Trebuchet MS, Arial, sans-serif",
    color_direction:
      "Warm soft neutrals with a gentle accent and calm contrast transitions.",
    alignment_layout:
      "Use left-aligned body text with optional short centered greeting blocks for warmth.",
    spacing_density:
      "Use more breathing room than default while keeping section rhythm intentional.",
    cta_treatment:
      "Use a soft rounded CTA with supportive wording and clear contrast.",
    imagery_shape_details:
      "Use rounded cards, soft dividers, and light background panels to reduce visual harshness.",
    copy_personality:
      "Warm and understanding. Like a supportive mentor who genuinely gets it - patient, human, never patronizing.",
    headline_style:
      "Acknowledge the reader's situation first. 'You deserve [outcome]' or 'We know [pain point] is hard.'",
    opening_pattern:
      "Start by naming the reader's challenge or feeling. Show you understand before pitching anything.",
    proof_style:
      "Personal stories and relatable testimonials. First-person quotes with emotional context.",
    urgency_approach:
      "Gentle - frame as opportunity, not pressure. 'Whenever you're ready' energy with soft time anchors.",
    objection_handling_style:
      "Acknowledge the fear directly. 'We get it - switching is scary. Here's why it won't be.'",
  },
  inspirational: {
    voice_guidance: [
      "Lead with possibility and momentum while staying concrete.",
      "Use uplifting language tied to specific outcomes, not hype.",
      "Make CTAs action-oriented and future-focused.",
      "Paint a vivid picture of the transformation or end state.",
      "Use short, punchy sentences for key moments - then expand.",
      "Ground aspiration in real examples so it never reads as empty motivation.",
    ],
    font_stack: "Trebuchet MS, Segoe UI, Arial, sans-serif",
    color_direction:
      "Use brighter optimistic accents with high-contrast neutral foundations.",
    alignment_layout:
      "Center the hero zone, then switch to left-aligned body sections for readability.",
    spacing_density:
      "Use energetic hierarchy with deliberate headline spacing and clear content pacing.",
    cta_treatment:
      "Use a bold, dominant primary CTA with strong contrast and momentum-led verb choices.",
    imagery_shape_details:
      "Use uplifting visual motifs, confident section breaks, and purposeful highlight panels.",
    copy_personality:
      "Visionary and grounded. Like a TED speaker - big ideas backed by real substance, never empty hype.",
    headline_style:
      "Transformation-focused. 'From [before] to [after]' or bold declarations that challenge the status quo.",
    opening_pattern:
      "Open with a bold statement, surprising stat, or vision of what's possible.",
    proof_style:
      "Before-and-after transformations. Show the journey, not just the result.",
    urgency_approach:
      "Momentum-based. 'Join 2,000 people who already started' - movement, not countdown timers.",
    objection_handling_style:
      "Reframe the objection as the reason to act. 'Too busy? That's exactly why this exists.'",
  },
  playful: {
    voice_guidance: [
      "Use light, tasteful humor where it supports the message.",
      "Keep copy easy to scan and avoid jokes that reduce clarity.",
      "Use energetic CTAs that stay clear and conversion-focused.",
      "Break the fourth wall occasionally - acknowledge you're sending an email.",
      "Use unexpected comparisons and pop-culture-light references.",
      "Keep wit in the headlines and clarity in the body - never sacrifice understanding for laughs.",
    ],
    font_stack: "Trebuchet MS, Verdana, Segoe UI, Arial, sans-serif",
    color_direction:
      "Use vivid but controlled dual accents anchored by readable neutral surfaces.",
    alignment_layout:
      "Use selective centered callouts while keeping long body text left-aligned for scanability.",
    spacing_density:
      "Use punchier spacing rhythm with compact text groups and expressive highlight gaps.",
    cta_treatment:
      "Use pill-like or rounded-forward CTA styling with energetic but clear action labels.",
    imagery_shape_details:
      "Use playful shape accents, colorful dividers, and lively yet restrained decorative moments.",
    copy_personality:
      "Clever and self-aware. Like a witty friend who's good at their job - never trying too hard.",
    headline_style:
      "Unexpected angles, mild wordplay, or relatable observations. Surprise without confusion.",
    opening_pattern:
      "Start with a relatable observation, mild joke, or unexpected statement that hooks attention.",
    proof_style:
      "Casual social proof. 'Over 10k people ditched their spreadsheet for this' - peer pressure, but fun.",
    urgency_approach:
      "FOMO with personality. 'This deal expires soon and we'll both be sad about it.'",
    objection_handling_style:
      "Disarm with humor. 'Yes, you could keep doing it the hard way. But why?'",
  },
  friendly: {
    voice_guidance: [
      "Use warm, conversational language with straightforward structure.",
      "Keep the tone approachable while maintaining professionalism.",
      "Use inviting CTAs that feel helpful and low-friction.",
      "Write like you're explaining something to a colleague over coffee.",
      "Use contractions naturally - 'you'll' over 'you will', 'we're' over 'we are'.",
      "Ask occasional rhetorical questions to keep the reader engaged.",
    ],
    font_stack: "Verdana, Segoe UI, Trebuchet MS, Arial, sans-serif",
    color_direction:
      "Use warm approachable tones with balanced neutrals and welcoming accents.",
    alignment_layout:
      "Keep content mostly left-aligned with occasional centered short sections for emphasis.",
    spacing_density:
      "Use relaxed spacing that feels open without losing compact email readability.",
    cta_treatment:
      "Use inviting rounded CTAs with friendly, low-friction action phrasing.",
    imagery_shape_details:
      "Use soft cards, warm separators, and approachable visual framing details.",
    copy_personality:
      "Approachable and genuine. Like a helpful neighbor - warm without being saccharine, clear without being cold.",
    headline_style:
      "Conversational and direct. 'Here's what's new' or 'A quick update for you' - no jargon.",
    opening_pattern:
      "Open with a brief, warm context-setter. One sentence that connects to the reader's world.",
    proof_style:
      "Community-oriented. 'Thousands of teams like yours' - emphasis on belonging.",
    urgency_approach:
      "Helpful nudge. 'Just a heads up - this wraps up Friday' - informative, not pushy.",
    objection_handling_style:
      "Conversational reassurance. 'No strings attached - try it and see if it clicks.'",
  },
  formal: {
    voice_guidance: [
      "Use precise, respectful language with a professional structure.",
      "Avoid slang, contractions, and overly casual phrasing.",
      "Use clear, direct CTAs with business-appropriate wording.",
      "Maintain consistent register - no sudden shifts to casual tone.",
      "Prefer complete sentences and proper transitions between sections.",
      "Use titles and honorifics when addressing individuals.",
    ],
    font_stack:
      "Headings: Playfair Display, Georgia, Times New Roman, serif (use italic variant for subheadings) | Body: Arial, Helvetica, sans-serif",
    color_direction:
      "Use restrained dark palette foundations (charcoal, navy, burgundy accents) with strong readability.",
    alignment_layout:
      "Use orderly composition with centered header treatment and left-aligned body copy.",
    spacing_density:
      "Use tighter rhythm, crisp section boundaries, and disciplined spacing decisions.",
    cta_treatment:
      "Use understated, high-clarity CTA styling with formal action wording.",
    imagery_shape_details:
      "Use subtle lines, conservative shape language, and minimal decorative effects.",
    copy_personality:
      "Dignified and precise. Like a well-crafted business letter - every word earns its place.",
    headline_style:
      "Declarative and measured. State the purpose clearly without embellishment or cleverness.",
    opening_pattern:
      "Begin with the purpose of the communication. State intent within the first two sentences.",
    proof_style:
      "Institutional credibility. Industry awards, certifications, partnership logos, years of operation.",
    urgency_approach:
      "Procedural. 'Please respond by [date] to ensure inclusion' - obligation, not pressure.",
    objection_handling_style:
      "Structured reassurance. Present credentials, guarantees, and compliance standards.",
  },
  neutral: {
    voice_guidance: [
      "Use plain, straightforward language with balanced tone.",
      "Prioritize clarity and specificity over personality.",
      "Use concise CTAs that clearly state the next action.",
      "Eliminate filler words - every word should carry meaning.",
      "Present information in logical order without editorial commentary.",
      "Default to active voice and simple sentence structures.",
    ],
    font_stack: "Helvetica Neue, Arial, sans-serif",
    color_direction:
      "Use grayscale-led palette with one modest accent for hierarchy cues.",
    alignment_layout:
      "Use left-aligned, minimal layouts focused on scanability and clarity.",
    spacing_density:
      "Keep spacing compact and consistent with practical, low-flair hierarchy.",
    cta_treatment:
      "Use simple functional CTA styling with clear contrast and plain action text.",
    imagery_shape_details:
      "Use minimal visual decoration and straightforward structural cards or dividers.",
    copy_personality:
      "Clear and unadorned. Like well-written documentation - informative, zero fluff, zero personality tax.",
    headline_style:
      "Descriptive and functional. Say exactly what the section contains. No cleverness needed.",
    opening_pattern:
      "State the purpose immediately. 'Here is your [thing]' or 'This email contains [info].'",
    proof_style:
      "Factual citations. Numbers, dates, and verifiable claims without editorial spin.",
    urgency_approach:
      "Informational only. State deadlines as facts without emotional framing.",
    objection_handling_style:
      "FAQ-style. State the concern, then the answer. No persuasion - just information.",
  },
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
  const toneDesignProfile = TONE_DESIGN_PROFILES[resolvedTone];

  const toneSpecificGuidance = toneDesignProfile.voice_guidance
    .map((rule) => `- ${rule}`)
    .join("\n");

  return `## TONE OF VOICE (DYNAMIC)
Selected tone: ${selectedTone.label}

Apply the selected tone only when generating or modifying emails (responses with <magic-code> or <magic-diff>).
For advice-only responses (<magic-reply> without code/diff), keep the tone neutral, concise, and practical.

Tone guardrails:
- Keep language clear, specific, and easy to understand.
- Keep tone consistent across subject line, body copy, and CTA text.
- Selected tone must drive both copy and visual design choices (font, color, alignment, hierarchy, and CTA treatment), not copy alone.
- Tone-first precedence: if tone direction conflicts with default brand styling, follow tone direction first.
- Tone-driven visuals must never violate technical, XML formatting, client-safe email structure, accessibility, or compatibility rules.

Tone-specific guidance:
${toneSpecificGuidance}

Tone-driven design guidance:
- Font stack: ${toneDesignProfile.font_stack}
- Color direction: ${toneDesignProfile.color_direction}
- Alignment & layout: ${toneDesignProfile.alignment_layout}
- Spacing density: ${toneDesignProfile.spacing_density}
- CTA treatment: ${toneDesignProfile.cta_treatment}
- Imagery & shape details: ${toneDesignProfile.imagery_shape_details}

Tone-driven copy strategy:
- Copy personality: ${toneDesignProfile.copy_personality}
- Headline style: ${toneDesignProfile.headline_style}
- Opening pattern: ${toneDesignProfile.opening_pattern}
- Social proof style: ${toneDesignProfile.proof_style}
- Urgency approach: ${toneDesignProfile.urgency_approach}
- Objection handling: ${toneDesignProfile.objection_handling_style}`;
}
