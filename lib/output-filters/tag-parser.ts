import type { MagicParseResult, MagicTagName, TagBlock } from "@/lib/output-filters/types";

const MAGIC_TAGS: MagicTagName[] = ["magic-reply", "magic-code", "magic-diff"];

function normalizeTagContent(content: string): string {
  const withoutLeadingNewline = content.replace(/^\r?\n/, "");
  return withoutLeadingNewline.replace(/\r?\n$/, "");
}

export function extractTagBlocks(text: string, tag: MagicTagName): TagBlock[] {
  const openTag = `<${tag}>`;
  const closeTag = `</${tag}>`;
  const blocks: TagBlock[] = [];

  let cursor = 0;

  while (cursor < text.length) {
    const openIndex = text.indexOf(openTag, cursor);
    if (openIndex === -1) break;

    const contentStart = openIndex + openTag.length;
    const closeIndex = text.indexOf(closeTag, contentStart);

    if (closeIndex === -1) {
      blocks.push({
        content: normalizeTagContent(text.slice(contentStart)),
        closed: false,
      });
      break;
    }

    blocks.push({
      content: normalizeTagContent(text.slice(contentStart, closeIndex)),
      closed: true,
    });

    cursor = closeIndex + closeTag.length;
  }

  return blocks;
}

export function parseMagicOutput(text: string): MagicParseResult {
  const replyBlocks = extractTagBlocks(text, "magic-reply");
  const codeBlocks = extractTagBlocks(text, "magic-code");
  const diffBlocks = extractTagBlocks(text, "magic-diff");

  return {
    reply: replyBlocks.map((block) => block.content).join("\n\n"),
    code: codeBlocks.length > 0 ? codeBlocks[codeBlocks.length - 1].content : null,
    diff: diffBlocks.length > 0 ? diffBlocks[diffBlocks.length - 1].content : null,
    containsMagicTags: MAGIC_TAGS.some((tag) => text.includes(`<${tag}>`)),
  };
}
