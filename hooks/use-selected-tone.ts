"use client";

import {
  DEFAULT_TONE_OF_VOICE,
  resolveToneOfVoice,
  type ToneOfVoice,
} from "@/lib/constants/tone-of-voice";
import { STORAGE_KEYS } from "@/lib/constants/storage-keys";
import { usePersistedState } from "@/hooks/use-persisted-state";

function parseStoredTone(raw: string): ToneOfVoice {
  return resolveToneOfVoice(raw);
}

export function useSelectedTone(initialTone?: unknown) {
  const override =
    typeof initialTone !== "undefined" ? resolveToneOfVoice(initialTone) : undefined;

  const [toneOfVoice, setToneOfVoiceState] = usePersistedState(
    STORAGE_KEYS.SELECTED_TONE,
    parseStoredTone,
    DEFAULT_TONE_OF_VOICE,
    { override, serialize: (v) => v }
  );

  const setToneOfVoice = (nextToneOfVoice: ToneOfVoice) => {
    setToneOfVoiceState(resolveToneOfVoice(nextToneOfVoice));
  };

  return {
    toneOfVoice,
    setToneOfVoice,
  };
}
