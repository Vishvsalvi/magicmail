"use client";

import { useState } from "react";

import {
  DEFAULT_TONE_OF_VOICE,
  resolveToneOfVoice,
  type ToneOfVoice,
} from "@/lib/constants/tone-of-voice";

const SELECTED_TONE_STORAGE_KEY = "magicmail:selected-tone-of-voice";

function getStoredTone(): ToneOfVoice | null {
  if (typeof window === "undefined") return null;

  try {
    const storedValue = window.localStorage.getItem(SELECTED_TONE_STORAGE_KEY);
    if (!storedValue) return null;
    return resolveToneOfVoice(storedValue);
  } catch {
    return null;
  }
}

export function useSelectedTone(initialTone?: unknown) {
  const [toneOfVoice, setToneOfVoiceState] = useState<ToneOfVoice>(() => {
    if (typeof initialTone !== "undefined") {
      return resolveToneOfVoice(initialTone);
    }

    return getStoredTone() ?? DEFAULT_TONE_OF_VOICE;
  });

  const setToneOfVoice = (nextToneOfVoice: ToneOfVoice) => {
    const safeTone = resolveToneOfVoice(nextToneOfVoice);
    setToneOfVoiceState(safeTone);

    try {
      window.localStorage.setItem(SELECTED_TONE_STORAGE_KEY, safeTone);
    } catch {
      // Ignore localStorage write failures.
    }
  };

  return {
    toneOfVoice,
    setToneOfVoice,
  };
}
