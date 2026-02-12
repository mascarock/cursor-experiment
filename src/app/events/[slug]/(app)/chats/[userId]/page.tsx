import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { ChatThreadClient } from "./chat-thread-client";

export default async function ChatThreadPage({
  params,
}: {
  params: Promise<{ slug: string; userId: string }>;
}) {
  const { slug, userId: partnerId } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/events/${slug}`);
  }

  const event = await db.event.findUnique({
    where: { slug },
  });

  if (!event) notFound();

  const currentUserId = session.user.id;

  // Get partner info
  const partnerProfile = await db.profile.findUnique({
    where: {
      userId_eventId: { userId: partnerId, eventId: event.id },
    },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  // If no profile, try user directly
  const partnerUser = partnerProfile?.user ??
    (await db.user.findUnique({
      where: { id: partnerId },
      select: { id: true, name: true, image: true },
    }));

  if (!partnerUser) notFound();

  // Get messages between these two users for this event
  const messages = await db.message.findMany({
    where: {
      eventId: event.id,
      OR: [
        { senderId: currentUserId, receiverId: partnerId },
        { senderId: partnerId, receiverId: currentUserId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  // Mark incoming messages as read
  await db.message.updateMany({
    where: {
      eventId: event.id,
      senderId: partnerId,
      receiverId: currentUserId,
      read: false,
    },
    data: { read: true },
  });

  const clientMessages = messages.map((m) => ({
    id: m.id,
    content: m.content,
    isOutgoing: m.senderId === currentUserId,
    isRead: m.read,
    createdAt: m.createdAt.toISOString(),
    isIcebreaker: m.isIcebreaker,
  }));

  return (
    <ChatThreadClient
      eventSlug={slug}
      eventId={event.id}
      currentUserId={currentUserId}
      partner={{
        id: partnerUser.id,
        name: partnerUser.name || "Anonymous",
        image: partnerUser.image,
        role: partnerProfile?.currentRole || null,
      }}
      initialMessages={clientMessages}
    />
  );
}
