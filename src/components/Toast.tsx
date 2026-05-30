"use client";

import { useState } from "react";

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
      <span className="text-sm">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white text-lg leading-none">
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
