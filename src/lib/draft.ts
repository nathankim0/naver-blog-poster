const DRAFT_KEY = "naver-blog-poster-draft";
const AUTO_SAVE_DELAY_MS = 1000;

interface Draft {
  title: string;
  markdown: string;
  savedAt: number;
}

export function saveDraft(title: string, markdown: string): void {
  if (typeof window === "undefined") return;

  const draft: Draft = { title, markdown, savedAt: Date.now() };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function loadDraft(): Draft | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Draft;
  } catch {
    return null;
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DRAFT_KEY);
}

export function formatDraftTime(savedAt: number): string {
  const date = new Date(savedAt);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export { AUTO_SAVE_DELAY_MS };
