import { parseMagicDiffHunks } from "@/lib/output-filters/diff-parser";

function findAllOccurrences(source: string, target: string): number[] {
  const occurrences: number[] = [];
  if (target.length === 0) return occurrences;

  let searchFrom = 0;

  while (searchFrom <= source.length - target.length) {
    const foundAt = source.indexOf(target, searchFrom);
    if (foundAt === -1) break;

    occurrences.push(foundAt);
    searchFrom = foundAt + 1;
  }

  return occurrences;
}

function findBestOccurrence(source: string, target: string, expectedIndex: number): number | null {
  if (target.length === 0) return null;

  const occurrences = findAllOccurrences(source, target);
  if (occurrences.length === 0) return null;

  let bestIndex = occurrences[0];
  let bestDistance = Math.abs(bestIndex - expectedIndex);

  for (const occurrence of occurrences.slice(1)) {
    const distance = Math.abs(occurrence - expectedIndex);
    if (distance < bestDistance || (distance === bestDistance && occurrence > bestIndex)) {
      bestIndex = occurrence;
      bestDistance = distance;
    }
  }

  return bestIndex;
}

export function applyMagicDiff(baseCode: string, diffText: string): string {
  const hunks = parseMagicDiffHunks(diffText);
  if (hunks.length === 0) return baseCode;

  const hadCRLF = baseCode.includes("\r\n");
  let nextCode = hadCRLF ? baseCode.replace(/\r\n/g, "\n") : baseCode;
  let expectedIndex = 0;
  let hasAppliedHunk = false;

  for (const hunk of hunks) {
    const removedBlock = hunk.removed.join("\n");
    const addedBlock = hunk.added.join("\n");

    const matchIndex = findBestOccurrence(nextCode, removedBlock, expectedIndex);
    if (matchIndex === null) {
      continue;
    }

    nextCode =
      nextCode.slice(0, matchIndex) +
      addedBlock +
      nextCode.slice(matchIndex + removedBlock.length);

    expectedIndex = matchIndex + addedBlock.length;
    hasAppliedHunk = true;
  }

  if (!hasAppliedHunk) {
    return baseCode;
  }

  if (!hadCRLF) {
    return nextCode;
  }

  return nextCode.replace(/\n/g, "\r\n");
}
