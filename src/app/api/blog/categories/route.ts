import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { fetchCategories } from "@/lib/naver-api";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json(
      { success: false, error: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  try {
    const data = await fetchCategories(session.accessToken);
    return NextResponse.json({ success: true, data: data.result });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "카테고리 조회 실패";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
