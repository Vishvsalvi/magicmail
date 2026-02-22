"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  parseSelectionValue,
  selectionToValue,
  type FlattenedModelOption,
  type ModelSelection,
  type ProviderAvailability,
  type ProviderId,
} from "@/lib/constants/models";
import {
  TONE_OF_VOICE_OPTIONS,
  resolveToneOfVoice,
  type ToneOfVoice,
} from "@/lib/constants/tone-of-voice";
import { cn } from "@/lib/utils";

type PromptInputProps = {
  onSubmit: (value: string) => void;
  onModelChange: (selection: ModelSelection) => void;
  onToneOfVoiceChange: (toneOfVoice: ToneOfVoice) => void;
  value?: string;
  selectedProviderId: ProviderId;
  selectedModelId: string;
  selectedToneOfVoice: ToneOfVoice;
  modelOptions: FlattenedModelOption[];
  providerAvailability: ProviderAvailability;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function PromptInput({
  onSubmit,
  onModelChange,
  onToneOfVoiceChange,
  value,
  selectedProviderId,
  selectedModelId,
  selectedToneOfVoice,
  modelOptions,
  providerAvailability,
  onValueChange,
  placeholder = "Ask me to build an email...",
  disabled = false,
  className,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isControlled = typeof value === "string";
  const text = isControlled ? value : internalValue;
  const canSubmit = useMemo(() => text.trim().length > 0 && !disabled, [text, disabled]);
  const selectedOption = useMemo(
    () =>
      modelOptions.find(
        (option) =>
          option.providerId === selectedProviderId && option.modelId === selectedModelId
      ),
    [modelOptions, selectedProviderId, selectedModelId]
  );
  const selectedToneOption = useMemo(
    () =>
      TONE_OF_VOICE_OPTIONS.find(
        (option) => option.value === selectedToneOfVoice
      ),
    [selectedToneOfVoice]
  );

  const groupedModelOptions = useMemo(() => {
    const groups: Array<{
      providerId: ProviderId;
      providerLabel: string;
      options: FlattenedModelOption[];
    }> = [];
    const map = new Map<ProviderId, (typeof groups)[number]>();

    for (const option of modelOptions) {
      const existingGroup = map.get(option.providerId);
      if (existingGroup) {
        existingGroup.options.push(option);
        continue;
      }

      const nextGroup = {
        providerId: option.providerId,
        providerLabel: option.providerLabel,
        options: [option],
      };
      map.set(option.providerId, nextGroup);
      groups.push(nextGroup);
    }

    return groups;
  }, [modelOptions]);

  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "0px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  useEffect(() => {
    resizeTextarea();
  }, [text]);

  const setText = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
  };

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSubmit(trimmed);
    if (!isControlled) setInternalValue("");
    onValueChange?.("");
  };

  return (
    <div
      className={cn(
        "flex min-h-[120px] w-[690px] max-w-full flex-col rounded-lg border border-border bg-card px-2 pb-2 pt-2 shadow-xs shadow-black/10 focus-within:ring focus-within:ring-border/50",
        className
      )}
    >
      <div className="flex min-h-[55px] flex-1 items-start">
        <Textarea
          ref={textareaRef}
          value={text}
          onChange={(event) => setText(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="max-h-[220px] min-h-[32px] resize-none overflow-y-auto border-0 bg-transparent px-1 py-0 text-[15px] leading-6 text-foreground shadow-none ring-0 focus-visible:ring-0"
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={disabled}
            aria-label="Attach file"
          >
            <Paperclip className="size-4" />
          </Button>
          <Select
            value={selectedToneOfVoice}
            onValueChange={(nextValue) => {
              onToneOfVoiceChange(resolveToneOfVoice(nextValue));
            }}
            disabled={disabled}
          >
            <SelectTrigger className="h-8 w-[160px] gap-1 border border-border/60 bg-background/50 px-2 text-xs focus-visible:ring-1">
              <SelectValue placeholder="Select tone">
                {selectedToneOption ? selectedToneOption.label : "Select tone"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[180px]" align="start">
              {TONE_OF_VOICE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectionToValue({
              providerId: selectedProviderId,
              modelId: selectedModelId,
            })}
            onValueChange={(nextValue) => {
              const nextSelection = parseSelectionValue(nextValue);
              if (!nextSelection) return;
              onModelChange(nextSelection);
            }}
            disabled={disabled || modelOptions.length === 0}
          >
            <SelectTrigger className="h-8 w-[200px] gap-1 border border-border/60 bg-background/50 px-2 text-xs focus-visible:ring-1">
              <SelectValue placeholder="Select model">
                {selectedOption ? selectedOption.modelLabel : "Select model"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="w-[220px]" align="start">
              {groupedModelOptions.map((group) => (
                <SelectGroup key={group.providerId}>
                  <SelectLabel>{group.providerLabel}</SelectLabel>
                  {group.options.map((option) => {
                    const isProviderConfigured = providerAvailability[option.providerId];

                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <span className="flex w-full items-center justify-between gap-2">
                          <span>{option.modelLabel}</span>
                          {isProviderConfigured ? null : (
                            <span className="text-xs text-destructive">No key</span>
                          )}
                        </span>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          type="button"
          size="icon"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="size-8"
          aria-label="Submit prompt"
        >
          <ArrowUp className="size-5" />
        </Button>
      </div>
    </div>
  );
}
