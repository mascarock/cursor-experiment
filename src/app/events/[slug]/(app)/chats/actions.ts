"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function sendMessage(
  eventId: string,
  receiverId: string,
  content: string,
  isIcebreaker: boolean = false
) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const userId = session.user.id;
  if (userId === receiverId) throw new Error("Cannot message yourself");

  // Anti-spam: max 10 messages per day to new users
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const recentMessageCount = await db.message.count({
    where: {
      eventId,
      senderId: userId,
      receiverId,
      createdAt: { gte: oneDayAgo },
    },
  });

  // Check if they've messaged us (if so, no limit)
  const theyMessaged = await db.message.count({
    where: {
      eventId,
      senderId: receiverId,
      receiverId: userId,
    },
  });

  if (recentMessageCount >= 10 && theyMessaged === 0) {
    return { success: false, message: "Daily message limit reached for this user" };
  }

  const message = await db.message.create({
    data: {
      eventId,
      senderId: userId,
      receiverId,
      content,
      isIcebreaker,
    },
  });

  revalidatePath(`/events`);
  return { success: true, messageId: message.id };
}

export async function markMessagesAsRead(eventId: string, senderId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await db.message.updateMany({
    where: {
      eventId,
      senderId,
      receiverId: session.user.id,
      read: false,
    },
    data: { read: true },
  });

  revalidatePath(`/events`);
}
