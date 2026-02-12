"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function sendMessage(
  eventId: string,
  receiverId: string,
  content: string,
  isIcebreaker: boolean = false
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  // Anti-spam: check daily message limit to new contacts
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayMessageCount = await db.message.count({
    where: {
      senderId: session.user.id,
      receiverId,
      eventId,
      createdAt: { gte: today },
    },
  });

  // Check if they've had a conversation before today
  const previousMessages = await db.message.count({
    where: {
      eventId,
      OR: [
        { senderId: session.user.id, receiverId },
        { senderId: receiverId, receiverId: session.user.id },
      ],
      createdAt: { lt: today },
    },
  });

  // Limit to 10 messages/day for new contacts
  if (previousMessages === 0 && todayMessageCount >= 10) {
    throw new Error("Daily message limit reached for new contacts");
  }

  await db.message.create({
    data: {
      eventId,
      senderId: session.user.id,
      receiverId,
      content,
      isIcebreaker,
    },
  });
}
