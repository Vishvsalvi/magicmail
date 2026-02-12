export type MagicTagName = "magic-reply" | "magic-code" | "magic-diff";

export type TagBlock = {
  content: string;
  closed: boolean;
};

export type DiffHunk = {
  removed: string[];
  added: string[];
};

export type MagicParseResult = {
  reply: string;
  code: string | null;
  diff: string | null;
  containsMagicTags: boolean;
};

export type DisplayChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

export type DerivedChatState = {
  displayMessages: DisplayChatMessage[];
  editorCode: string;
};
