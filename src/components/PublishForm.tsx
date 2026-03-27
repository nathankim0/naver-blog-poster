"use client";

import { useEffect, useState } from "react";

const OPEN_TYPE_OPTIONS = [
  { value: "all", label: "전체 공개" },
  { value: "neighbor", label: "이웃 공개" },
  { value: "agreedNeighbor", label: "서로이웃 공개" },
  { value: "closed", label: "비공개" },
] as const;

interface Category {
  categoryNo: number;
  categoryName: string;
}

interface PublishFormProps {
  onPublish: (options: { categoryNo?: number; openType: string }) => void;
  isPublishing: boolean;
  disabled: boolean;
}

export default function PublishForm({
  onPublish,
  isPublishing,
  disabled,
}: PublishFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [openType, setOpenType] = useState("all");
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      setLoadingCategories(true);
      try {
        const res = await fetch("/api/blog/categories");
        const json = await res.json();
        if (json.success && json.data) {
          setCategories(json.data);
        }
      } catch {
        // 카테고리 로드 실패 시 무시 (선택 사항이므로)
      } finally {
        setLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  const handlePublish = () => {
    onPublish({
      categoryNo: selectedCategory ? Number(selectedCategory) : undefined,
      openType,
    });
  };

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-800">발행 설정</h3>

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">카테고리</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          disabled={loadingCategories}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">
            {loadingCategories ? "불러오는 중..." : "선택 안함"}
          </option>
          {categories.map((cat) => (
            <option key={cat.categoryNo} value={cat.categoryNo}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm text-gray-600">공개 설정</label>
        <select
          value={openType}
          onChange={(e) => setOpenType(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          {OPEN_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handlePublish}
        disabled={disabled || isPublishing}
        className="w-full rounded-lg bg-[#03C75A] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#02b351] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPublishing ? "발행 중..." : "블로그에 발행"}
      </button>
    </div>
  );
}
