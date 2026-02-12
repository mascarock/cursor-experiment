"use client";

import { useRouter } from "next/navigation";

interface GlassHeaderProps {
  showBookmark?: boolean;
  onBookmark?: () => void;
}

export function GlassHeader({ showBookmark, onBookmark }: GlassHeaderProps) {
  const router = useRouter();

  return (
    <header className="absolute top-0 left-0 right-0 z-20 px-4 pt-12 pb-4 flex justify-between items-center glass-panel border-b border-slate-200/10 dark:border-slate-700/30">
      <button
        onClick={() => router.back()}
        className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
      >
        <span className="material-icons-round text-2xl">arrow_back</span>
      </button>
      <div className="flex gap-2">
        {showBookmark && (
          <button
            onClick={onBookmark}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          >
            <span className="material-icons-round text-xl">bookmark_border</span>
          </button>
        )}
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
          <span className="material-icons-round text-xl">more_vert</span>
        </button>
      </div>
    </header>
  );
}
