"use client";

import { useChat } from "@ai-sdk/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { ChatPreviewPanel } from "@/components/chat/chat-preview-panel";
import { ChatThread } from "@/components/chat/chat-thread";
import { PromptInput } from "@/components/common/prompt-input/prompt-input";
import { useSelectedModel } from "@/hooks/use-selected-model";
import { useSelectedTone } from "@/hooks/use-selected-tone";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { consumePendingInitialPrompt } from "@/lib/chat-launch";
import {
  flattenModelOptions,
  getMissingApiKeyError,
  type ModelSelection,
  type ProviderAvailability,
} from "@/lib/constants/models";
import type { ToneOfVoice } from "@/lib/constants/tone-of-voice";
import { DEFAULT_EDITOR_CODE } from "@/lib/output-filters/default-editor-code";
import { deriveChatState } from "@/lib/output-filters/derive-chat-state";
import type { DisplayChatMessage } from "@/lib/output-filters/types";

type ChatWorkspaceProps = {
  chatId: string;
  providerAvailability: ProviderAvailability;
};

function ChatPane({
  input,
  onInputChange,
  onSubmit,
  modelSelection,
  onModelChange,
  toneOfVoice,
  onToneOfVoiceChange,
  modelOptions,
  providerAvailability,
  disabled,
  messages,
}: {
  input: string;
  onInputChange: (value: string) => void;
  onSubmit: (value: string) => void;
  modelSelection: ModelSelection;
  onModelChange: (selection: ModelSelection) => void;
  toneOfVoice: ToneOfVoice;
  onToneOfVoiceChange: (toneOfVoice: ToneOfVoice) => void;
  modelOptions: ReturnType<typeof flattenModelOptions>;
  providerAvailability: ProviderAvailability;
  disabled: boolean;
  messages: DisplayChatMessage[];
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-hidden">
        <ChatThread messages={messages} />
      </div>
      <div className="shrink-0 p-3">
        <PromptInput
          value={input}
          onValueChange={onInputChange}
          onSubmit={onSubmit}
          selectedProviderId={modelSelection.providerId}
          selectedModelId={modelSelection.modelId}
          selectedToneOfVoice={toneOfVoice}
          onModelChange={onModelChange}
          onToneOfVoiceChange={onToneOfVoiceChange}
          modelOptions={modelOptions}
          providerAvailability={providerAvailability}
          disabled={disabled}
          className="min-h-[120px] w-full max-w-none"
        />
      </div>
    </section>
  );
}

export function ChatWorkspace({ chatId, providerAvailability }: ChatWorkspaceProps) {
  const [input, setInput] = useState("");
  const initializedChatIdRef = useRef<string | null>(null);
  const modelOptions = useMemo(() => flattenModelOptions(), []);
  const { selection, setSelection } = useSelectedModel();
  const { toneOfVoice, setToneOfVoice } = useSelectedTone();
  const { messages, sendMessage, status } = useChat({
    id: chatId,
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const { displayMessages, editorCode } = useMemo(
    () => deriveChatState(messages, DEFAULT_EDITOR_CODE),
    [messages]
  );

  const submitWithSelection = useCallback(
    (value: string, nextSelection: ModelSelection = selection) => {
      if (!providerAvailability[nextSelection.providerId]) {
        toast.error(getMissingApiKeyError(nextSelection.providerId));
        return;
      }

      sendMessage(
        { text: value },
        {
          body: {
            providerId: nextSelection.providerId,
            modelId: nextSelection.modelId,
            toneOfVoice,
          },
        }
      );
      setInput("");
    },
    [providerAvailability, selection, sendMessage, toneOfVoice]
  );

  useEffect(() => {
    if (initializedChatIdRef.current === chatId) return;
    initializedChatIdRef.current = chatId;

    const pendingInitialPrompt = consumePendingInitialPrompt(chatId);
    if (!pendingInitialPrompt) return;

    if (!providerAvailability[pendingInitialPrompt.providerId]) {
      toast.error(getMissingApiKeyError(pendingInitialPrompt.providerId));
      return;
    }

    sendMessage(
      { text: pendingInitialPrompt.prompt },
      {
        body: {
          providerId: pendingInitialPrompt.providerId,
          modelId: pendingInitialPrompt.modelId,
          toneOfVoice: pendingInitialPrompt.toneOfVoice,
        },
      }
    );
  }, [chatId, providerAvailability, sendMessage]);

  const isSubmitting = status === "streaming" || status === "submitted";
  const canCompilePreview = status === "ready";

  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-hidden pt-2">
      <div className="hidden min-h-0 flex-1 overflow-hidden md:block">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-full rounded-2xl shadow-xs"
        >
          <ResizablePanel defaultSize={40} minSize={450} maxSize={600}>
            <ChatPane
              input={input}
              onInputChange={setInput}
              onSubmit={submitWithSelection}
              modelSelection={selection}
              onModelChange={setSelection}
              toneOfVoice={toneOfVoice}
              onToneOfVoiceChange={setToneOfVoice}
              modelOptions={modelOptions}
              providerAvailability={providerAvailability}
              disabled={isSubmitting}
              messages={displayMessages}
            />
          </ResizablePanel>
          <ResizableHandle className="w-0 bg-transparent after:w-3" />
          <ResizablePanel defaultSize={60} minSize={30}>
            <ChatPreviewPanel frame="split" code={editorCode} canCompile={canCompilePreview} isGenerating={isSubmitting} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden md:hidden">
        <div className="min-h-0 flex-1 overflow-hidden rounded-2xl bg-card shadow-xs">
          <ChatPane
            input={input}
            onInputChange={setInput}
            onSubmit={submitWithSelection}
            modelSelection={selection}
            onModelChange={setSelection}
            toneOfVoice={toneOfVoice}
            onToneOfVoiceChange={setToneOfVoice}
            modelOptions={modelOptions}
            providerAvailability={providerAvailability}
            disabled={isSubmitting}
            messages={displayMessages}
          />
        </div>
        <div className="h-52 shrink-0 shadow-xs">
          <ChatPreviewPanel
            frame="standalone"
            code={editorCode}
            canCompile={canCompilePreview}
            isGenerating={isSubmitting}
          />
        </div>
      </div>
    </main>
  );
}
