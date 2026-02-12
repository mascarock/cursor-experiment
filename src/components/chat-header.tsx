"use client";

import Link from "next/link";

interface ChatHeaderProps {
  eventSlug: string;
  userId: string;
  name: string;
  image: string | null;
  role: string | null;
  isOnline?: boolean;
}

export function ChatHeader({
  eventSlug,
  name,
  image,
  role,
  isOnline = false,
}: ChatHeaderProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <header className="flex-none px-4 py-3 bg-white dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <Link
          href={`/events/${eventSlug}/chats`}
          className="text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"
        >
          <span className="material-icons">arrow_back_ios_new</span>
        </Link>
        <div className="relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-800">
              <span className="text-sm font-bold text-slate-500 dark:text-slate-300">
                {initials}
              </span>
            </div>
          )}
          {isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
          )}
        </div>
        <div>
          <h1 className="text-base font-bold leading-tight">{name}</h1>
          {role && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {role}
            </p>
          )}
        </div>
      </div>
      <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
        <span className="material-icons">more_vert</span>
      </button>
    </header>
  );
}
