"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatBubble } from "@/components/chat-bubble";
import { ChatHeader } from "@/components/chat-header";
import { IcebreakersCarousel } from "@/components/icebreakers-carousel";
import { MessageInput } from "@/components/message-input";
import { DateDivider } from "@/components/date-divider";
import { sendMessage, markMessagesAsRead } from "../actions";

interface MessageData {
  id: string;
  content: string;
  isOutgoing: boolean;
  isRead: boolean;
  createdAt: string;
  isIcebreaker: boolean;
}

interface ChatThreadClientProps {
  eventSlug: string;
  eventId: string;
  currentUserId: string;
  partner: {
    id: string;
    name: string;
    image: string | null;
    role: string | null;
  };
  initialMessages: MessageData[];
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
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

function groupMessagesByDate(messages: MessageData[]): Map<string, MessageData[]> {
  const groups = new Map<string, MessageData[]>();
  for (const msg of messages) {
    const dateKey = new Date(msg.createdAt).toDateString();
    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }
    groups.get(dateKey)!.push(msg);
  }
  return groups;
}

export function ChatThreadClient({
  eventSlug,
  eventId,
  currentUserId,
  partner,
  initialMessages,
}: ChatThreadClientProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [pendingIcebreaker, setPendingIcebreaker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Scroll to bottom on mount and new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read on mount
  useEffect(() => {
    markMessagesAsRead(eventId, partner.id);
  }, [eventId, partner.id]);

  // Poll for new messages every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/messages?eventId=${eventId}&partnerId=${partner.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages);
          markMessagesAsRead(eventId, partner.id);
        }
      } catch {
        // Silently fail on poll errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [eventId, partner.id]);

  const handleSend = useCallback(
    async (content: string, isIcebreaker: boolean) => {
      const result = await sendMessage(eventId, partner.id, content, isIcebreaker);
      if (result.success && result.messageId) {
        // Optimistic update
        const newMessage: MessageData = {
          id: result.messageId,
          content,
          isOutgoing: true,
          isRead: false,
          createdAt: new Date().toISOString(),
          isIcebreaker,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    },
    [eventId, partner.id]
  );

  const handleIcebreakerSelect = useCallback((text: string) => {
    setPendingIcebreaker(text);
  }, []);

  const handleClearIcebreaker = useCallback(() => {
    setPendingIcebreaker(null);
  }, []);

  const dateGroups = groupMessagesByDate(messages);

  return (
    <div className="flex flex-col h-screen bg-bg-light dark:bg-bg-dark">
      {/* Header */}
      <ChatHeader
        eventSlug={eventSlug}
        userId={partner.id}
        name={partner.name}
        image={partner.image}
        role={partner.role}
      />

      {/* Messages */}
      <main
        ref={mainRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        {messages.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-icons text-4xl text-slate-300 dark:text-slate-600 mb-3 block">
              waving_hand
            </span>
            <p className="text-sm text-slate-400 dark:text-slate-500 mb-1">
              No messages yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Send a message or try an icebreaker below!
            </p>
          </div>
        ) : (
          Array.from(dateGroups.entries()).map(([dateKey, msgs]) => (
            <div key={dateKey} className="space-y-4">
              <DateDivider date={formatDate(msgs[0].createdAt)} />
              {msgs.map((msg, i) => {
                // Show avatar only for first message in a group from same sender
                const showAvatar =
                  !msg.isOutgoing &&
                  (i === 0 || msgs[i - 1].isOutgoing);

                return (
                  <ChatBubble
                    key={msg.id}
                    content={msg.content}
                    timestamp={formatTime(msg.createdAt)}
                    isOutgoing={msg.isOutgoing}
                    isRead={msg.isRead}
                    senderImage={!msg.isOutgoing ? partner.image : undefined}
                    senderName={!msg.isOutgoing ? partner.name : undefined}
                    showAvatar={showAvatar}
                  />
                );
              })}
            </div>
          ))
        )}
        <div ref={messagesEndRef} className="h-2" />
      </main>

      {/* Footer: Icebreakers + Input */}
      <footer className="flex-none bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe">
        <IcebreakersCarousel onSelect={handleIcebreakerSelect} />
        <MessageInput
          onSend={handleSend}
          pendingIcebreaker={pendingIcebreaker}
          onClearIcebreaker={handleClearIcebreaker}
        />
      </footer>
    </div>
  );
}
