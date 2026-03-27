"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import LoginButton from "@/components/LoginButton";
import MarkdownEditor from "@/components/MarkdownEditor";
import PublishForm from "@/components/PublishForm";

type PublishResult =
  | { type: "success"; postUrl: string }
  | { type: "error"; message: string }
  | null;

export default function EditorPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [result, setResult] = useState<PublishResult>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handlePublish = useCallback(
    async (options: { categoryNo?: number; openType: string }) => {
      setIsPublishing(true);
      setResult(null);

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
          setResult({ type: "success", postUrl: json.data.postUrl });
          setTitle("");
          setMarkdown("");
          setImages([]);
        } else {
          setResult({ type: "error", message: json.error });
        }
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "발행 중 오류가 발생했습니다";
        setResult({ type: "error", message });
      } finally {
        setIsPublishing(false);
      }
    },
    [title, markdown, images]
  );

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const canPublish = title.trim().length > 0 && markdown.trim().length > 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">새 글 작성</h1>
        <LoginButton />
      </header>

      {result?.type === "success" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="text-sm font-medium text-green-800">
            발행 완료!{" "}
            <a
              href={result.postUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              블로그에서 보기
            </a>
          </p>
        </div>
      )}

      {result?.type === "error" && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">{result.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              제목
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="포스트 제목을 입력하세요"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-[#03C75A] focus:outline-none focus:ring-1 focus:ring-[#03C75A]"
            />
          </div>

          <MarkdownEditor value={markdown} onChange={setMarkdown} />

          <ImageUploader images={images} onImagesChange={setImages} />
        </div>

        <div className="lg:sticky lg:top-8 lg:self-start">
          <PublishForm
            onPublish={handlePublish}
            isPublishing={isPublishing}
            disabled={!canPublish}
          />
        </div>
      </div>
    </div>
  );
}
