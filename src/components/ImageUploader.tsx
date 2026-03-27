"use client";

import { useCallback } from "react";

interface ImageUploaderProps {
  images: File[];
  onRemove: (index: number) => void;
}

export default function ImageUploader({ images, onRemove }: ImageUploaderProps) {
  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          첨부 이미지 ({images.length}개)
        </label>
        <span className="text-xs text-gray-400">
          본문에 자동 삽입됨
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {images.map((file, index) => (
          <div
            key={`${file.name}-${file.size}-${index}`}
            className="group relative"
          >
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="h-20 w-20 rounded-lg object-cover ring-1 ring-gray-200"
            />
            <button
              type="button"
              onClick={() => onRemove(index)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow-sm opacity-0 transition-opacity group-hover:opacity-100"
            >
              x
            </button>
            <p className="mt-1 max-w-[80px] truncate text-xs text-gray-500">
              {file.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
