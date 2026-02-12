"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface DiscoverContentProps {
  eventSlug: string;
  recommendations: unknown[];
  activeFilter: string;
  searchQuery: string;
}

const FILTERS = [
  { key: "all", label: "All Matches" },
  { key: "developers", label: "Developers" },
  { key: "designers", label: "Designers" },
  { key: "investors", label: "Investors" },
];

export function DiscoverContent({
  eventSlug,
  activeFilter,
  searchQuery,
}: DiscoverContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState(searchQuery);

  const updateParams = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    if (params.filter && params.filter !== "all")
      searchParams.set("filter", params.filter);
    if (params.q) searchParams.set("q", params.q);
    const qs = searchParams.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  return (
    <>
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <span className="material-icons text-[20px]">search</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                updateParams({ filter: activeFilter, q: search });
              }
            }}
            className="w-full bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg py-2.5 pl-10 pr-4 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="Search people, roles..."
          />
        </div>
        <button className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg px-3 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          <span className="material-icons text-slate-500 dark:text-slate-300">
            tune
          </span>
        </button>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 mt-4">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => updateParams({ filter: f.key, q: search })}
            className={`flex-none px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              activeFilter === f.key
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </>
  );
}
