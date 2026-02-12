"use client";

interface IcebreakersCarouselProps {
  onSelect: (text: string) => void;
}

const icebreakers = [
  { emoji: "👋", text: "Enjoyed your talk!" },
  { emoji: "☕", text: "Free for coffee?" },
  { emoji: "🤝", text: "Let's connect on LinkedIn" },
  { emoji: "🍕", text: "Lunch plans?" },
];

export function IcebreakersCarousel({ onSelect }: IcebreakersCarouselProps) {
  return (
    <div className="pt-3 pb-2 pl-4 overflow-x-auto no-scrollbar">
      <div className="flex gap-2 pr-4 w-max">
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider self-center mr-1">
          Icebreakers
        </p>
        {icebreakers.map((ib, i) => (
          <button
            key={i}
            onClick={() => onSelect(`${ib.emoji} ${ib.text}`)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all group whitespace-nowrap ${
              i === 0
                ? "bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary border-primary/20"
                : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            <span className="text-sm group-hover:scale-110 transition-transform">
              {ib.emoji}
            </span>
            <span className="text-xs font-medium">{ib.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
