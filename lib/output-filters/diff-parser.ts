import type { DiffHunk } from "@/lib/output-filters/types";

const HUNK_MARKER = "@@";
const CODE_FENCE = "```";

type ParsedDiffLine =
  | { type: "removed"; value: string }
  | { type: "added"; value: string };

function parseDiffLine(line: string): ParsedDiffLine | null {
  const match = line.match(/^\s*([+-])(.*)$/);
  if (!match) return null;

  const marker = match[1];
  const value = match[2];

  if (marker === "-") {
    return { type: "removed", value };
  }

  return { type: "added", value };
}

export function parseMagicDiffHunks(diffText: string): DiffHunk[] {
  const lines = diffText.replace(/\r\n/g, "\n").split("\n");
  const hunks: DiffHunk[] = [];

  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (line === CODE_FENCE) {
      index += 1;
      continue;
    }

    if (line !== HUNK_MARKER) {
      index += 1;
      continue;
    }

    index += 1;

    const removed: string[] = [];
    const added: string[] = [];
    let isComplete = false;
    let isValid = true;

    while (index < lines.length) {
      const currentLine = lines[index];
      const currentTrimmedLine = currentLine.trim();

      if (currentTrimmedLine === CODE_FENCE || currentTrimmedLine.length === 0) {
        index += 1;
        continue;
      }

      if (currentTrimmedLine === HUNK_MARKER) {
        isComplete = true;
        index += 1;
        break;
      }

      const parsedLine = parseDiffLine(currentLine);
      if (!parsedLine) {
        isValid = false;
        index += 1;
        continue;
      }

      if (parsedLine.type === "removed") {
        removed.push(parsedLine.value);
      } else {
        added.push(parsedLine.value);
      }

      index += 1;
    }

    if (!isComplete) {
      break;
    }

    if (!isValid || removed.length === 0) {
      continue;
    }

    hunks.push({ removed, added });
  }

  return hunks;
}
