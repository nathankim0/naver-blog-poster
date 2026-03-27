"use client";

import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onImageAdd: (file: File) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
  onImageAdd,
}: MarkdownEditorProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 최신 value를 ref로 유지하여 stale closure 방지
  const valueRef = useRef(value);
  valueRef.current = value;

  const insertImageTag = useCallback(
    (file: File) => {
      onImageAdd(file);
      const placeholder = `![${file.name}](첨부:${file.name})`;
      const updated = valueRef.current + "\n" + placeholder + "\n";
      onChange(updated);
      valueRef.current = updated;
    },
    [onChange, onImageAdd]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = Array.from(e.clipboardData.items);
      const imageItem = items.find((item) => item.type.startsWith("image/"));

      if (imageItem) {
        e.preventDefault();
        const file = imageItem.getAsFile();
        if (file) {
          insertImageTag(file);
        }
      }
    },
    [insertImageTag]
  );

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const mdFile = files.find((f) => f.name.endsWith(".md"));

      if (mdFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result;
          if (typeof text === "string") {
            onChange(text);
            valueRef.current = text;
          }
        };
        reader.readAsText(mdFile);
        return;
      }

      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      for (const file of imageFiles) {
        insertImageTag(file);
      }
    },
    [onChange, insertImageTag]
  );

  const handleToolbarImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;
      for (const file of Array.from(files)) {
        if (file.type.startsWith("image/")) {
          insertImageTag(file);
        }
      }
      e.target.value = "";
    },
    [insertImageTag]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          본문 (마크다운)
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToolbarImageClick}
            className="rounded-md border border-gray-300 px-2.5 py-1 text-xs text-gray-600 transition-colors hover:bg-gray-100"
          >
            + 이미지 삽입
          </button>
          <span className="text-xs text-gray-400">
            Ctrl+V 붙여넣기 | .md 드래그앤드롭
          </span>
        </div>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        onPaste={handlePaste}
        className={`rounded-lg transition-all ${
          isDragging ? "ring-2 ring-blue-400 ring-offset-2" : ""
        }`}
        data-color-mode="light"
      >
        <MDEditor
          value={value}
          onChange={(val) => {
            const updated = val ?? "";
            onChange(updated);
            valueRef.current = updated;
          }}
          height={500}
          preview="live"
        />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />
    </div>
  );
}
