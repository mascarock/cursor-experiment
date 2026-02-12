"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function sendConnectionRequest(eventId: string, receiverId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const userId = session.user.id;
  if (userId === receiverId) throw new Error("Cannot connect with yourself");

  // Check if connection already exists
  const existing = await db.connection.findFirst({
    where: {
      eventId,
      OR: [
        { requesterId: userId, receiverId },
        { requesterId: receiverId, receiverId: userId },
      ],
    },
  });

  if (existing) return { success: false, message: "Connection already exists" };

  await db.connection.create({
    data: {
      eventId,
      requesterId: userId,
      receiverId,
    },
  });

  revalidatePath(`/events`);
  return { success: true, message: "Connection request sent" };
}
