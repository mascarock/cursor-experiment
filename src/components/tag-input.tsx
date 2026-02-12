"use client";

import { useState, KeyboardEvent } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
  label: string;
}

export function TagInput({
  tags,
  onChange,
  placeholder = "Add more...",
  suggestions = [],
  label,
}: TagInputProps) {
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && input === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const unusedSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
        {label}
      </label>
      <div className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition-all">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/20 text-primary text-xs font-semibold"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:text-white transition-colors"
              >
                <span className="material-icons-round text-[14px]">close</span>
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full bg-transparent border-none p-0 text-sm text-slate-700 dark:text-white placeholder-slate-400 focus:ring-0 outline-none"
        />
      </div>
      {unusedSuggestions.length > 0 && (
        <div className="mt-3 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            {unusedSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addTag(suggestion)}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
