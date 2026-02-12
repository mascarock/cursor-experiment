import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ChatListItem } from "@/components/chat-list-item";

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function ChatsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/events/${slug}`);
  }

  const event = await db.event.findUnique({
    where: { slug },
  });

  if (!event) notFound();

  const userId = session.user.id;

  // Get all conversations for this user in this event
  // Find all unique users this person has exchanged messages with
  const messages = await db.message.findMany({
    where: {
      eventId: event.id,
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    include: {
      sender: {
        select: { id: true, name: true, image: true },
      },
      receiver: {
        select: { id: true, name: true, image: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group messages by conversation partner
  const conversations = new Map<
    string,
    {
      partnerId: string;
      partnerName: string;
      partnerImage: string | null;
      lastMessage: string;
      lastMessageTime: Date;
      unreadCount: number;
    }
  >();

  for (const msg of messages) {
    const isOutgoing = msg.senderId === userId;
    const partner = isOutgoing ? msg.receiver : msg.sender;

    if (!conversations.has(partner.id)) {
      // Count unread from this partner
      const unread = messages.filter(
        (m) => m.senderId === partner.id && m.receiverId === userId && !m.read
      ).length;

      conversations.set(partner.id, {
        partnerId: partner.id,
        partnerName: partner.name || "Anonymous",
        partnerImage: partner.image,
        lastMessage: isOutgoing ? `You: ${msg.content}` : msg.content,
        lastMessageTime: msg.createdAt,
        unreadCount: unread,
      });
    }
  }

  const sortedConversations = Array.from(conversations.values()).sort(
    (a, b) => b.lastMessageTime.getTime() - a.lastMessageTime.getTime()
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-bg-light/80 dark:bg-bg-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="px-5 py-4 w-full max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Messages</h1>
            <div className="flex items-center gap-2">
              {sortedConversations.some((c) => c.unreadCount > 0) && (
                <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                  {sortedConversations.reduce(
                    (acc, c) => acc + c.unreadCount,
                    0
                  )}{" "}
                  new
                </span>
              )}
              <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300">
                <span className="material-icons">edit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat List */}
      <main className="flex-1 w-full max-w-md mx-auto">
        {sortedConversations.length === 0 ? (
          <div className="text-center py-16 px-5">
            <span className="material-icons text-5xl text-slate-300 dark:text-slate-600 mb-4 block">
              chat_bubble_outline
            </span>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">
              No messages yet
            </h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
              Start a conversation by messaging someone from the Discover tab or
              use an icebreaker!
            </p>
          </div>
        ) : (
          <div>
            {sortedConversations.map((conv) => (
              <ChatListItem
                key={conv.partnerId}
                eventSlug={slug}
                userId={conv.partnerId}
                name={conv.partnerName}
                image={conv.partnerImage}
                lastMessage={conv.lastMessage}
                timestamp={formatTimestamp(conv.lastMessageTime)}
                unreadCount={conv.unreadCount}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
