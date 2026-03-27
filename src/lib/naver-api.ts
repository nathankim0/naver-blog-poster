const NAVER_BLOG_WRITE_URL = "https://openapi.naver.com/blog/writePost.json";
const NAVER_BLOG_CATEGORIES_URL =
  "https://openapi.naver.com/blog/listCategory.json";

interface WritePostParams {
  accessToken: string;
  title: string;
  contents: string;
  images?: File[];
  categoryNo?: number;
  openType?: string;
}

interface CategoryResponse {
  message: string;
  result: Array<{
    categoryNo: number;
    categoryName: string;
  }>;
}

interface WriteResponse {
  message: string;
  result: {
    blogNo: number;
    logNo: number;
    postUrl: string;
  };
}

export async function fetchCategories(
  accessToken: string
): Promise<CategoryResponse> {
  const response = await fetch(NAVER_BLOG_CATEGORIES_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`카테고리 조회 실패: ${response.status}`);
  }

  return response.json();
}

export async function writePost(
  params: WritePostParams
): Promise<WriteResponse> {
  const formData = new FormData();
  formData.append("title", params.title);
  formData.append("contents", params.contents);

  if (params.categoryNo !== undefined) {
    formData.append("categoryNo", String(params.categoryNo));
  }
  formData.append("options.openType", params.openType ?? "all");
  formData.append("options.allowComment", "true");
  formData.append("options.allowSympathy", "true");

  if (params.images) {
    for (const image of params.images) {
      formData.append("image", image);
    }
  }

  const response = await fetch(NAVER_BLOG_WRITE_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${params.accessToken}` },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`글쓰기 실패: ${response.status} - ${text}`);
  }

  return response.json();
}
