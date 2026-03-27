export interface NaverCategory {
  categoryNo: number;
  name: string;
}

export interface BlogPostRequest {
  title: string;
  contents: string;
  categoryNo?: number;
  openType?: "all" | "closed" | "neighbor" | "agreedNeighbor";
  allowComment?: boolean;
}

export interface BlogPostResponse {
  message: string;
  result: {
    blogNo: number;
    logNo: number;
    postUrl: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
