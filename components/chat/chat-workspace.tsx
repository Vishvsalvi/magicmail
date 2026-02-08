"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";

import { ChatPreviewPanel } from "@/components/chat/chat-preview-panel";
import { ChatThread } from "@/components/chat/chat-thread";
import { PromptInput } from "@/components/common/prompt-input/prompt-input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { consumePendingInitialPrompt } from "@/lib/chat-launch";

type ChatWorkspaceProps = {
  chatId: string;
};

function ChatPane({
  input,
  onInputChange,
  onSubmit,
  disabled,
  messages,
}: {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled: boolean;
  messages: ReturnType<typeof useChat>["messages"];
}) {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1">
        <ChatThread messages={messages} />
      </div>
      <div className="p-3">
        <PromptInput
          value={input}
          onValueChange={onInputChange}
          onSubmit={onSubmit}
          disabled={disabled}
          className="h-[120px] w-full max-w-none"
        />
      </div>
    </section>
  );
}

export function ChatWorkspace({ chatId }: ChatWorkspaceProps) {
  const [input, setInput] = useState("");
  const initializedChatIdRef = useRef<string | null>(null);
  const { messages, sendMessage, status } = useChat({ id: chatId });

  useEffect(() => {
    if (initializedChatIdRef.current === chatId) return;
    initializedChatIdRef.current = chatId;

    const initialPrompt = consumePendingInitialPrompt(chatId);
    if (!initialPrompt) return;

    sendMessage({ text: initialPrompt });
  }, [chatId, sendMessage]);

  const isSubmitting = status === "streaming" || status === "submitted";

  return (
    <main className="flex flex-1 flex-col pt-2">
      <div className="hidden min-h-0 flex-1 md:block">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full rounded-2xl shadow-xs"
        >
          <ResizablePanel defaultSize={40} minSize={450} maxSize={600}>
            <ChatPane
              input={input}
              onInputChange={setInput}
              onSubmit={(value) => {
                sendMessage({ text: value });
                setInput("");
              }}
              disabled={isSubmitting}
              messages={messages}
            />
          </ResizablePanel>
          <ResizableHandle className="w-0 bg-transparent after:w-3" />
          <ResizablePanel defaultSize={60} minSize={30}>
            <ChatPreviewPanel frame="split" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 md:hidden">
        <div className="min-h-0 flex-1 rounded-2xl bg-card shadow-xs">
          <ChatPane
            input={input}
            onInputChange={setInput}
            onSubmit={(value) => {
              sendMessage({ text: value });
              setInput("");
            }}
            disabled={isSubmitting}
            messages={messages}
          />
        </div>
        <div className="h-52 shadow-xs">
          <ChatPreviewPanel frame="standalone" />
        </div>
      </div>
    </main>
  );
}
