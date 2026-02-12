interface DateDividerProps {
  date: string;
}

export function DateDivider({ date }: DateDividerProps) {
  return (
    <div className="flex justify-center">
      <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs px-3 py-1 rounded-full">
        {date}
      </span>
    </div>
  );
}
