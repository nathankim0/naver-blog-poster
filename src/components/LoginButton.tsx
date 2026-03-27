"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-200" />
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">
          {session.user?.name ?? "사용자"}
        </span>
        <button
          onClick={() => signOut()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("naver")}
      className="rounded-lg bg-[#03C75A] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#02b351]"
    >
      네이버 로그인
    </button>
  );
}
