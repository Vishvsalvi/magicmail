"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useSelectedModel } from "@/hooks/use-selected-model";
import { useSelectedTone } from "@/hooks/use-selected-tone";
import { AppShell } from "@/components/common/app-shell/app-shell";
import { PromptInput } from "@/components/common/prompt-input/prompt-input";
import { subscribeToNewChatReset } from "@/lib/chat-store";
import { createDummyChatId, storePendingInitialPrompt } from "@/lib/chat-launch";
import {
  flattenModelOptions,
  getMissingApiKeyError,
  type ProviderAvailability,
} from "@/lib/constants/models";

type HomePageClientProps = {
  providerAvailability: ProviderAvailability;
};

export function HomePageClient({ providerAvailability }: HomePageClientProps) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const { selection, setSelection } = useSelectedModel();
  const { toneOfVoice, setToneOfVoice } = useSelectedTone();
  const modelOptions = useMemo(() => flattenModelOptions(), []);

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
            selectedProviderId={selection.providerId}
            selectedModelId={selection.modelId}
            selectedToneOfVoice={toneOfVoice}
            modelOptions={modelOptions}
            providerAvailability={providerAvailability}
            onModelChange={setSelection}
            onToneOfVoiceChange={setToneOfVoice}
            onSubmit={(value) => {
              if (!providerAvailability[selection.providerId]) {
                toast.error(getMissingApiKeyError(selection.providerId));
                return;
              }

              const chatId = createDummyChatId();
              storePendingInitialPrompt({
                chatId,
                prompt: value,
                providerId: selection.providerId,
                modelId: selection.modelId,
                toneOfVoice,
              });
              setInput("");
              router.push(`/chat/${chatId}`);
            }}
            className="min-h-[120px] max-w-3xl"
          />
        </section>
      </main>
    </AppShell>
  );
}
