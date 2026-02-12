import type { UIMessage } from "ai";

import { applyMagicDiff } from "@/lib/output-filters/diff-apply";
import {
  outputFilterMagicCode,
  outputFilterMagicDiff,
  outputFilterMagicReply,
} from "@/lib/output-filters/output-filters";
import type { DerivedChatState, DisplayChatMessage } from "@/lib/output-filters/types";

function getMessageText(message: UIMessage): string {
  return message.parts.reduce((combinedText, part) => {
    if (part.type !== "text") return combinedText;
    return combinedText + part.text;
  }, "");
}

export function deriveChatState(messages: UIMessage[], initialCode: string): DerivedChatState {
  const displayMessages: DisplayChatMessage[] = [];
  let editorCode = initialCode;

  for (const message of messages) {
    if (message.role !== "user" && message.role !== "assistant") {
      continue;
    }

    const rawText = getMessageText(message);
    if (rawText.length === 0) {
      continue;
    }

    if (message.role === "user") {
      displayMessages.push({
        id: message.id,
        role: "user",
        text: rawText,
      });
      continue;
    }

    const replyText = outputFilterMagicReply(rawText);
    displayMessages.push({
      id: message.id,
      role: "assistant",
      text: replyText,
    });

    const replacementCode = outputFilterMagicCode(rawText);
    if (replacementCode !== null) {
      editorCode = replacementCode;
      continue;
    }

    const diffText = outputFilterMagicDiff(rawText);
    if (diffText !== null) {
      editorCode = applyMagicDiff(editorCode, diffText);
    }
  }

  return {
    displayMessages,
    editorCode,
  };
}
