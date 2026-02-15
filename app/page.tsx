"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AppShell } from "@/components/common/app-shell/app-shell";
import { PromptInput } from "@/components/common/prompt-input/prompt-input";
import { subscribeToNewChatReset } from "@/lib/chat-store";
import { createDummyChatId, storePendingInitialPrompt } from "@/lib/chat-launch";

export default function Home() {
  const router = useRouter();
  const [input, setInput] = useState("");

  useEffect(() => {
    return subscribeToNewChatReset(() => {
      setInput("");
    });
  }, []);

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4">
        <section className="flex flex-1 flex-col items-center gap-6 pt-56">
          <h1 className="text-center text-4xl font-semibold tracking-tight">
            What email you want to build?
          </h1>
          <PromptInput
            value={input}
            onValueChange={setInput}
            onSubmit={(value) => {
              const chatId = createDummyChatId();
              storePendingInitialPrompt({ chatId, prompt: value });
              setInput("");
              router.push(`/chat/${chatId}`);
            }}
            className="max-w-3xl min-h-[120px]"
          />
        </section>
      </main>
    </AppShell>
  );
}
