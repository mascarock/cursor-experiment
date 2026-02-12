"use client";

interface QuickFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { key: "all", label: "All Matches" },
  { key: "developers", label: "Developers" },
  { key: "designers", label: "Designers" },
  { key: "investors", label: "Investors" },
];

export function QuickFilters({ activeFilter, onFilterChange }: QuickFiltersProps) {
  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.key;
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`flex-none px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
              isActive
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
          >
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
