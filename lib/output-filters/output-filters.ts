import { parseMagicOutput } from "@/lib/output-filters/tag-parser";

export function outputFilterMagicReply(rawText: string): string {
  const parsed = parseMagicOutput(rawText);

  if (!parsed.containsMagicTags) {
    return rawText;
  }

  return parsed.reply;
}

export function outputFilterMagicCode(rawText: string): string | null {
  return parseMagicOutput(rawText).code;
}

export function outputFilterMagicDiff(rawText: string): string | null {
  return parseMagicOutput(rawText).diff;
}
