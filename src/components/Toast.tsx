"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

let addToastFn: ((type: ToastType, text: string) => void) | null = null;

export function showToast(type: ToastType, text: string): void {
  addToastFn?.(type, text);
}

const TOAST_DURATION_MS = 4000;

const TOAST_STYLES: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-gray-800",
};

let nextId = 0;

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToastFn = (type, text) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, type, text }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, TOAST_DURATION_MS);
    };
    return () => {
      addToastFn = null;
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`animate-slide-up rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${TOAST_STYLES[toast.type]}`}
        >
          {toast.text}
        </div>
      ))}
    </div>
  );
}
