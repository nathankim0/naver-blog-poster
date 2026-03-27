"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import LoginButton from "@/components/LoginButton";
import MarkdownEditor from "@/components/MarkdownEditor";
import PublishForm, { type PublishOptions } from "@/components/PublishForm";
import { showToast } from "@/components/Toast";
import { useAutoSave, useLoadDraft } from "@/hooks/useAutoSave";
import { clearDraft } from "@/lib/draft";

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const publishOptionsRef = useRef<PublishOptions>({ openType: "all" });
  const publishRef = useRef<(() => void) | null>(null);

  const draft = useLoadDraft();
  const { lastSaved } = useAutoSave(title, markdown);

  // 드래프트 복원
  useEffect(() => {
    if (draft && !draftLoaded) {
      setTitle(draft.title);
      setMarkdown(draft.markdown);
      setDraftLoaded(true);
      showToast("info", "이전 임시저장 불러옴");
    }
  }, [draft, draftLoaded]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleImageAdd = useCallback((file: File) => {
    setImages((prev) => [...prev, file]);
  }, []);

  const handleImageRemove = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleOptionsChange = useCallback((options: PublishOptions) => {
    publishOptionsRef.current = options;
  }, []);

  const handlePublish = useCallback(
    async (options: PublishOptions) => {
      setIsPublishing(true);

      try {
        const formData = new FormData();
        formData.append("title", title);
        formData.append("markdown", markdown);
        formData.append("openType", options.openType);

        if (options.categoryNo !== undefined) {
          formData.append("categoryNo", String(options.categoryNo));
        }

        for (const image of images) {
          formData.append("images", image);
        }

        const res = await fetch("/api/blog/write", {
          method: "POST",
          body: formData,
        });

        const json = await res.json();

        if (json.success) {
          showToast("success", "발행 완료!");
          clearDraft();
          setTitle("");
          setMarkdown("");
          setImages([]);

          if (json.data?.postUrl) {
            window.open(json.data.postUrl, "_blank");
          }
        } else {
          showToast("error", json.error ?? "발행 실패");
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "발행 중 오류가 발생했습니다";
        showToast("error", message);
      } finally {
        setIsPublishing(false);
      }
    },
    [title, markdown, images]
  );

  // Ctrl+Enter 단축키 — PublishForm의 현재 옵션 사용
  useEffect(() => {
    publishRef.current = () => {
      if (title.trim() && markdown.trim() && !isPublishing) {
        handlePublish(publishOptionsRef.current);
      }
    };
  }, [title, markdown, isPublishing, handlePublish]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        publishRef.current?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#03C75A]" />
      </div>
    );
  }

  if (!session) return null;

  const canPublish = title.trim().length > 0 && markdown.trim().length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Naver Blog Poster</h1>
        <LoginButton />
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_260px]">
        <div className="space-y-5">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            className="w-full border-b-2 border-gray-200 px-1 py-3 text-2xl font-bold placeholder-gray-300 focus:border-[#03C75A] focus:outline-none"
          />

          <MarkdownEditor
            value={markdown}
            onChange={setMarkdown}
            onImageAdd={handleImageAdd}
          />

          <ImageUploader images={images} onRemove={handleImageRemove} />
        </div>

        <div className="lg:sticky lg:top-6 lg:self-start">
          <PublishForm
            onPublish={handlePublish}
            onOptionsChange={handleOptionsChange}
            isPublishing={isPublishing}
            disabled={!canPublish}
            lastSaved={lastSaved}
          />
        </div>
      </div>
    </div>
  );
}
