"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginButton from "@/components/LoginButton";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/editor");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-[#03C75A]" />
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 px-4">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900">
          Naver Blog Poster
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          마크다운으로 작성하고, 한 번에 블로그에 발행하세요
        </p>
      </div>

      <LoginButton />

      <div className="grid max-w-lg grid-cols-2 gap-4 text-sm text-gray-600">
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="font-semibold text-gray-800">마크다운 에디터</p>
          <p className="mt-1 text-gray-500">실시간 미리보기 + .md 파일 불러오기</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="font-semibold text-gray-800">이미지 첨부</p>
          <p className="mt-1 text-gray-500">Ctrl+V 붙여넣기 / 드래그앤드롭</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="font-semibold text-gray-800">임시 저장</p>
          <p className="mt-1 text-gray-500">자동 저장으로 날림 걱정 없이</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
          <p className="font-semibold text-gray-800">빠른 발행</p>
          <p className="mt-1 text-gray-500">Ctrl+Enter로 바로 발행</p>
        </div>
      </div>
    </main>
  );
}
