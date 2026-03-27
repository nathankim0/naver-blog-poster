"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  const [isDragging, setIsDragging] = useState(false);

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
          }
        };
        reader.readAsText(mdFile);
      }
    },
    [onChange]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          본문 (마크다운)
        </label>
        <span className="text-xs text-gray-400">
          .md 파일을 드래그앤드롭하여 불러오기 가능
        </span>
      </div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleFileDrop}
        className={`rounded-lg transition-all ${
          isDragging ? "ring-2 ring-blue-400" : ""
        }`}
        data-color-mode="light"
      >
        <MDEditor
          value={value}
          onChange={(val) => onChange(val ?? "")}
          height={500}
          preview="live"
        />
      </div>
    </div>
  );
}
