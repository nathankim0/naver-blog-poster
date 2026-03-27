import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { markdownToHtml } from "@/lib/markdown";
import { writePost } from "@/lib/naver-api";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.accessToken) {
    return NextResponse.json(
      { success: false, error: "로그인이 필요합니다" },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const markdown = formData.get("markdown") as string;
    const categoryNo = formData.get("categoryNo") as string | null;
    const openType = (formData.get("openType") as string) ?? "all";

    if (!title || !markdown) {
      return NextResponse.json(
        { success: false, error: "제목과 내용을 입력해주세요" },
        { status: 400 }
      );
    }

    const htmlContents = markdownToHtml(markdown);

    const images: File[] = [];
    const imageEntries = formData.getAll("images");
    for (const entry of imageEntries) {
      if (entry instanceof File && entry.size > 0) {
        images.push(entry);
      }
    }

    const result = await writePost({
      accessToken: session.accessToken,
      title,
      contents: htmlContents,
      images: images.length > 0 ? images : undefined,
      categoryNo: categoryNo ? Number(categoryNo) : undefined,
      openType,
    });

    return NextResponse.json({ success: true, data: result.result });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "글쓰기 실패";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
