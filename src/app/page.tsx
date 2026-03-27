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
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-8 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Naver Blog Poster
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          마크다운으로 네이버 블로그에 글을 발행하세요
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <LoginButton />
        <ul className="space-y-1 text-sm text-gray-500">
          <li>- 마크다운 에디터 + 실시간 미리보기</li>
          <li>- .md 파일 드래그앤드롭</li>
          <li>- 이미지 첨부</li>
          <li>- 카테고리 & 공개 설정</li>
        </ul>
      </div>
    </main>
  );
}
