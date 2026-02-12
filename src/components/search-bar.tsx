"use client";

import { useState, useCallback } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search people, roles...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <span className="material-icons text-[20px]">search</span>
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder={placeholder}
        />
      </div>
      <button className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
        <span className="material-icons text-slate-500 dark:text-slate-300">
          tune
        </span>
      </button>
    </div>
  );
}
