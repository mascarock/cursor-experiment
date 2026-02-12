"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sendMessage } from "./actions";

interface Message {
  id: string;
  content: string;
  isOwn: boolean;
  isIcebreaker: boolean;
  read: boolean;
  createdAt: string;
}

interface ChatThreadProps {
  eventSlug: string;
  eventId: string;
  partnerId: string;
  partnerName: string;
  partnerImage: string | null;
  partnerRole: string;
  initialMessages: Message[];
  currentUserId: string;
}

const ICEBREAKERS = [
  { emoji: "👋", text: "Enjoyed your talk!" },
  { emoji: "☕", text: "Free for coffee?" },
  { emoji: "🤝", text: "Let's connect on LinkedIn" },
  { emoji: "🍕", text: "Lunch plans?" },
];

export function ChatThread({
  eventSlug,
  eventId,
  partnerId,
  partnerName,
  partnerImage,
  partnerRole,
  initialMessages,
}: ChatThreadProps) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 5000);
    return () => clearInterval(interval);
  }, [router]);

  // Sync with server
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSend = async (content: string, isIcebreaker = false) => {
    if (!content.trim()) return;
    setSending(true);

    // Optimistic update
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      content,
      isOwn: true,
      isIcebreaker,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    try {
      await sendMessage(eventId, partnerId, content, isIcebreaker);
      router.refresh();
    } catch {
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    }
    setSending(false);
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-[calc(100dvh-4rem)] bg-bg-light dark:bg-bg-dark">
      {/* Header */}
      <header className="flex-none px-4 py-3 bg-white dark:bg-slate-900/50 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/events/${eventSlug}/chats`)}
            className="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
          >
            <span className="material-icons">arrow_back_ios_new</span>
          </button>
          <div className="relative">
            {partnerImage ? (
              <img
                src={partnerImage}
                alt={partnerName}
                className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center border-2 border-white dark:border-slate-800">
                <span className="material-icons text-slate-400 text-lg">
                  person
                </span>
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">{partnerName}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {partnerRole}
            </p>
          </div>
        </div>
        <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
          <span className="material-icons">more_vert</span>
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
        {groupedMessages.map(({ date, messages: dayMessages }) => (
          <div key={date} className="space-y-4">
            {/* Date Divider */}
            <div className="flex justify-center">
              <span className="bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs px-3 py-1 rounded-full">
                {date}
              </span>
            </div>

            {dayMessages.map((msg) => (
              <div key={msg.id}>
                {msg.isOwn ? (
                  <div className="flex flex-col items-end gap-1 ml-auto max-w-[85%]">
                    <div className="bg-primary px-4 py-3 rounded-2xl rounded-tr-none shadow-md shadow-primary/20">
                      <p className="text-sm leading-relaxed text-white">
                        {msg.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 mr-1">
                      <span className="text-[10px] text-slate-400">
                        {formatMsgTime(msg.createdAt)}
                      </span>
                      <span
                        className={`material-icons text-[12px] ${
                          msg.read ? "text-primary" : "text-slate-400"
                        }`}
                      >
                        done_all
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="flex flex-col gap-1">
                      <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-700/50">
                        <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                          {msg.content}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 ml-1">
                        {formatMsgTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
        <div ref={bottomRef} className="h-2" />
      </main>

      {/* Footer: Icebreakers + Input */}
      <footer className="flex-none bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe">
        {/* Icebreakers */}
        {messages.length === 0 && (
          <div className="pt-3 pb-2 pl-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-2 pr-4 w-max">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider self-center mr-1">
                Icebreakers
              </p>
              {ICEBREAKERS.map((ib) => (
                <button
                  key={ib.text}
                  onClick={() => handleSend(`${ib.emoji} ${ib.text}`, true)}
                  disabled={sending}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 text-primary border border-primary/20 rounded-full transition-all group whitespace-nowrap disabled:opacity-50"
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">
                    {ib.emoji}
                  </span>
                  <span className="text-xs font-medium">{ib.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Field */}
        <div className="px-4 pb-4 pt-2 flex items-end gap-2">
          <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-primary transition-colors flex-none">
            <span className="material-icons text-2xl">add_circle_outline</span>
          </button>
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center px-4 py-2 border border-transparent focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(input);
                }
              }}
              className="w-full bg-transparent border-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:ring-0 resize-none py-1 max-h-24 outline-none"
              placeholder="Type a message..."
              rows={1}
            />
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-2">
              <span className="material-icons text-xl">
                sentiment_satisfied_alt
              </span>
            </button>
          </div>
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || sending}
            className="p-2.5 bg-primary text-white rounded-full shadow-lg shadow-primary/25 hover:bg-blue-600 transition-colors flex-none flex items-center justify-center disabled:opacity-50"
          >
            <span className="material-icons text-xl translate-x-0.5">send</span>
          </button>
        </div>
      </footer>
    </div>
  );
}

function formatMsgTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];
  let currentDate = "";

  for (const msg of messages) {
    const date = new Date(msg.createdAt);
    const dateStr = formatDate(date);
    if (dateStr !== currentDate) {
      currentDate = dateStr;
      groups.push({ date: dateStr, messages: [] });
    }
    groups[groups.length - 1].messages.push(msg);
  }

  return groups;
}

function formatDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  }
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
