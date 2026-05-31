"use client";

import { useState } from "react";
import { Leaf } from "lucide-react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-moss text-white px-5 py-3.5 rounded-2xl shadow-card flex items-center gap-3 animate-fade-in border border-sage-600">
      <Leaf size={16} className="text-sage-300 shrink-0" />
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-sage-300 hover:text-white text-lg leading-none ml-2 transition-colors">
        &times;
      </button>
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const ToastComponent = message ? (
    <Toast message={message} onClose={() => setMessage(null)} />
  ) : null;

  return { showToast, ToastComponent };
}
