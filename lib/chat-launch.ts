type PendingInitialPrompt = {
  chatId: string;
  prompt: string;
};

const PENDING_INITIAL_PROMPT_KEY = "chat:pending-initial-prompt";

function isBrowser() {
  return typeof window !== "undefined";
}

export function createDummyChatId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `chat-${crypto.randomUUID()}`;
  }

  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function storePendingInitialPrompt(payload: PendingInitialPrompt) {
  if (!isBrowser()) return;
  window.sessionStorage.setItem(PENDING_INITIAL_PROMPT_KEY, JSON.stringify(payload));
}

export function consumePendingInitialPrompt(chatId: string) {
  if (!isBrowser()) return null;

  const rawPayload = window.sessionStorage.getItem(PENDING_INITIAL_PROMPT_KEY);
  if (!rawPayload) return null;

  window.sessionStorage.removeItem(PENDING_INITIAL_PROMPT_KEY);

  try {
    const payload = JSON.parse(rawPayload) as PendingInitialPrompt;
    if (payload.chatId !== chatId) return null;
    return payload.prompt;
  } catch {
    return null;
  }
}
