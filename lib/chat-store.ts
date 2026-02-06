export type SidebarChatItem = {
  id: string;
  title: string;
};

export const sidebarChats: SidebarChatItem[] = [
  { id: "chat-1", title: "Q1 campaign draft" },
  { id: "chat-2", title: "Welcome email rewrite" },
  { id: "chat-3", title: "Brand tone guidelines" },
  { id: "chat-4", title: "Cold outreach variants" },
];

const NEW_CHAT_EVENT = "app:new-chat";

export function requestNewChatReset() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NEW_CHAT_EVENT));
}

export function subscribeToNewChatReset(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handler = () => callback();
  window.addEventListener(NEW_CHAT_EVENT, handler);

  return () => {
    window.removeEventListener(NEW_CHAT_EVENT, handler);
  };
}
