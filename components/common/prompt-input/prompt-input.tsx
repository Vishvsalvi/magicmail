"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUp, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type PromptInputProps = {
  onSubmit: (value: string) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function PromptInput({
  onSubmit,
  value,
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
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-label="Attach file"
        >
          <Paperclip className="size-4" />
        </Button>

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
