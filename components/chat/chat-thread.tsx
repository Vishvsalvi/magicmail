"use client";

import type { UIMessage } from "ai";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type ChatThreadProps = {
  messages: UIMessage[];
};

export function ChatThread({ messages }: ChatThreadProps) {
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
        Ask your first prompt to start the conversation.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-4 py-4">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        {messages.map((message) => {
          const textParts = message.parts.filter((part) => part.type === "text");
          if (textParts.length === 0) return null;

          const isUserMessage = message.role === "user";

          return (
            <article
              key={message.id}
              className={cn("flex w-full", isUserMessage ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[90%] rounded-2xl border px-4 py-3",
                  isUserMessage ? "bg-primary text-primary-foreground" : "bg-card"
                )}
              >
                <p
                  className={cn(
                    "mb-1 text-xs font-medium",
                    isUserMessage ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}
                >
                  {isUserMessage ? "You" : "Assistant"}
                </p>
                <div className="space-y-2 text-sm leading-6 whitespace-pre-wrap">
                  {textParts.map((part, index) => (
                    <p key={`${message.id}-${index}`}>{part.text}</p>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
        <div ref={bottomAnchorRef} />
      </div>
    </div>
  );
}
