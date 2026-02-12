import Link from "next/link";

interface ChatListItemProps {
  eventSlug: string;
  userId: string;
  name: string;
  image: string | null;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline?: boolean;
}

export function ChatListItem({
  eventSlug,
  userId,
  name,
  image,
  lastMessage,
  timestamp,
  unreadCount,
  isOnline = false,
}: ChatListItemProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <Link
      href={`/events/${eventSlug}/chats/${userId}`}
      className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-b-0"
    >
      {/* Avatar */}
      <div className="relative flex-none">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-800"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-800">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-300">
              {initials}
            </span>
          </div>
        )}
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3
            className={`text-sm truncate ${
              unreadCount > 0
                ? "font-bold text-slate-900 dark:text-white"
                : "font-semibold text-slate-700 dark:text-slate-200"
            }`}
          >
            {name}
          </h3>
          <span className="text-[10px] text-slate-400 flex-none ml-2">
            {timestamp}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p
            className={`text-xs truncate ${
              unreadCount > 0
                ? "font-medium text-slate-600 dark:text-slate-300"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {lastMessage}
          </p>
          {unreadCount > 0 && (
            <span className="ml-2 flex-none bg-primary text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
