"use client";

import { useEffect, useRef, useState } from "react";
import {
  AUTO_SAVE_DELAY_MS,
  formatDraftTime,
  loadDraft,
  saveDraft,
} from "@/lib/draft";

interface AutoSaveState {
  lastSaved: string | null;
}

export function useAutoSave(title: string, markdown: string): AutoSaveState {
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!title && !markdown) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      saveDraft(title, markdown);
      setLastSaved(formatDraftTime(Date.now()));
    }, AUTO_SAVE_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [title, markdown]);

  return { lastSaved };
}

interface DraftData {
  title: string;
  markdown: string;
}

export function useLoadDraft(): DraftData | null {
  const [draft, setDraft] = useState<DraftData | null>(null);

  useEffect(() => {
    const saved = loadDraft();
    if (saved && (saved.title || saved.markdown)) {
      setDraft({ title: saved.title, markdown: saved.markdown });
    }
  }, []);

  return draft;
}
