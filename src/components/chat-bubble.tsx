interface ChatBubbleProps {
  content: string;
  timestamp: string;
  isOutgoing: boolean;
  isRead?: boolean;
  senderImage?: string | null;
  senderName?: string;
  showAvatar?: boolean;
}

export function ChatBubble({
  content,
  timestamp,
  isOutgoing,
  isRead = false,
  senderImage,
  senderName,
  showAvatar = false,
}: ChatBubbleProps) {
  if (isOutgoing) {
    return (
      <div className="flex flex-col items-end gap-1 ml-auto max-w-[85%]">
        <div className="bg-primary px-4 py-3 rounded-2xl rounded-tr-none shadow-md shadow-primary/20">
          <p className="text-sm leading-relaxed text-white">{content}</p>
        </div>
        <div className="flex items-center gap-1 mr-1">
          <span className="text-[10px] text-slate-400">{timestamp}</span>
          {isRead && (
            <span className="material-icons text-[12px] text-primary">
              done_all
            </span>
          )}
        </div>
      </div>
    );
  }

  // Generate initials for fallback avatar
  const initials = senderName
    ? senderName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="flex gap-3 max-w-[85%]">
      {showAvatar && (
        <div className="w-8 h-8 rounded-full overflow-hidden self-end mb-5 flex-none">
          {senderImage ? (
            <img
              src={senderImage}
              alt={senderName || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-300">
                {initials}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col gap-1">
        <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50">
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {content}
          </p>
        </div>
        <span className="text-[10px] text-slate-400 ml-1">{timestamp}</span>
      </div>
    </div>
  );
}
