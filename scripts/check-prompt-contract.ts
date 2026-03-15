import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

type ToneOption = {
  value: string;
  label: string;
};

const rootDir = process.cwd();
const toneFilePath = path.join(rootDir, "lib/constants/tone-of-voice.ts");
const systemFilePath = path.join(rootDir, "lib/constants/prompts/system.ts");

const requiredGuardrails = [
  "## CRITICAL RESPONSE FORMAT:",
  "YOU MUST WRAP ALL RESPONSES IN XML TAGS. NEVER OUTPUT PLAIN TEXT.",
  "There are ONLY 3 valid response structures",
  "## OUTPUT FORMAT (CRITICAL - STRICT ENFORCEMENT)",
];

const requiredToneVisualKeys = [
  "Tone-driven design guidance:",
  "Font stack:",
  "Color direction:",
  "Alignment & layout:",
  "Spacing density:",
  "CTA treatment:",
];

const allowedMagicTags = new Set(["magic-reply", "magic-code", "magic-diff"]);

function prepareTempPromptModules() {
  const tempDir = mkdtempSync(path.join(tmpdir(), "magicmail-prompt-contract-"));
  const tempTonePath = path.join(tempDir, "tone-of-voice.ts");
  const tempSystemPath = path.join(tempDir, "system.ts");

  writeFileSync(tempTonePath, readFileSync(toneFilePath, "utf8"));

  const originalSystemSource = readFileSync(systemFilePath, "utf8");
  const rewrittenSystemSource = originalSystemSource.replace(
    /from\s+["']@\/lib\/constants\/tone-of-voice["'];?/,
    'from "./tone-of-voice.ts";'
  );

  if (rewrittenSystemSource === originalSystemSource) {
    throw new Error(
      "Failed to rewrite tone-of-voice import in system.ts for prompt contract check."
    );
  }

  writeFileSync(tempSystemPath, rewrittenSystemSource);

  return {
    tempDir,
    tempToneUrl: pathToFileURL(tempTonePath).href,
    tempSystemUrl: pathToFileURL(tempSystemPath).href,
  };
}

function collectMagicTagViolations(prompt: string) {
  const foundMagicTags = new Set<string>();
  for (const match of prompt.matchAll(/<\/?(magic-[a-z-]+)>/g)) {
    foundMagicTags.add(match[1]);
  }

  const unknownTags = [...foundMagicTags].filter(
    (tagName) => !allowedMagicTags.has(tagName)
  );
  const missingTags = [...allowedMagicTags].filter(
    (tagName) => !foundMagicTags.has(tagName)
  );

  return { unknownTags, missingTags };
}

const { tempDir, tempToneUrl, tempSystemUrl } = prepareTempPromptModules();

try {
  const toneModule = (await import(tempToneUrl)) as {
    TONE_OF_VOICE_OPTIONS: readonly ToneOption[];
  };
  const systemModule = (await import(tempSystemUrl)) as {
    buildSystemPrompt: (tone: string) => string;
  };

  const failures: string[] = [];

  for (const toneOption of toneModule.TONE_OF_VOICE_OPTIONS) {
    const prompt = systemModule.buildSystemPrompt(toneOption.value);

    const missingGuardrails = requiredGuardrails.filter(
      (line) => !prompt.includes(line)
    );
    if (missingGuardrails.length > 0) {
      failures.push(
        `[${toneOption.value}] Missing guardrails: ${missingGuardrails.join(", ")}`
      );
    }

    const missingToneVisualKeys = requiredToneVisualKeys.filter(
      (line) => !prompt.includes(line)
    );
    if (missingToneVisualKeys.length > 0) {
      failures.push(
        `[${toneOption.value}] Missing tone visual keys: ${missingToneVisualKeys.join(", ")}`
      );
    }

    const selectedToneLine = `Selected tone: ${toneOption.label}`;
    if (!prompt.includes(selectedToneLine)) {
      failures.push(`[${toneOption.value}] Missing selected tone label line.`);
    }

    const { unknownTags, missingTags } = collectMagicTagViolations(prompt);
    if (unknownTags.length > 0) {
      failures.push(
        `[${toneOption.value}] Found unsupported magic tags: ${unknownTags.join(", ")}`
      );
    }
    if (missingTags.length > 0) {
      failures.push(
        `[${toneOption.value}] Missing required magic tags: ${missingTags.join(", ")}`
      );
    }
  }

  if (failures.length > 0) {
    console.error("Prompt contract check failed:");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Prompt contract check passed for all tones.");
} finally {
  rmSync(tempDir, { recursive: true, force: true });
}
