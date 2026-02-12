"use client";

import { useState, useRef, useCallback, useTransition } from "react";

interface MessageInputProps {
  onSend: (content: string, isIcebreaker: boolean) => Promise<void>;
  pendingIcebreaker?: string | null;
  onClearIcebreaker?: () => void;
}

export function MessageInput({
  onSend,
  pendingIcebreaker,
  onClearIcebreaker,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Apply icebreaker text
  const displayMessage = pendingIcebreaker || message;

  const handleSend = useCallback(() => {
    const content = (pendingIcebreaker || message).trim();
    if (!content || isPending) return;

    const isIcebreaker = !!pendingIcebreaker;

    startTransition(async () => {
      await onSend(content, isIcebreaker);
      setMessage("");
      onClearIcebreaker?.();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    });
  }, [message, pendingIcebreaker, isPending, onSend, onClearIcebreaker]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (pendingIcebreaker) {
        onClearIcebreaker?.();
      }
      setMessage(e.target.value);
      // Auto-resize
      const textarea = e.target;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
    },
    [pendingIcebreaker, onClearIcebreaker]
  );

  return (
    <div className="px-4 pb-4 pt-2 flex items-end gap-2">
      <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors flex-none">
        <span className="material-icons text-2xl">add_circle_outline</span>
      </button>
      <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center px-4 py-2 border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        <textarea
          ref={textareaRef}
          value={displayMessage}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:ring-0 focus:outline-none resize-none py-1"
          placeholder="Type a message..."
          rows={1}
          style={{ minHeight: "1.5rem", maxHeight: "6rem" }}
        />
        <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-2 flex-none">
          <span className="material-icons text-xl">
            sentiment_satisfied_alt
          </span>
        </button>
      </div>
      <button
        onClick={handleSend}
        disabled={!displayMessage.trim() || isPending}
        className="p-2.5 bg-primary text-white rounded-full shadow-lg shadow-primary/25 hover:bg-blue-600 transition-colors flex-none flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="material-icons text-xl translate-x-0.5">send</span>
      </button>
    </div>
  );
}
