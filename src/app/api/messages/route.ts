import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const eventId = searchParams.get("eventId");
  const partnerId = searchParams.get("partnerId");

  if (!eventId || !partnerId) {
    return NextResponse.json(
      { error: "Missing eventId or partnerId" },
      { status: 400 }
    );
  }

  const currentUserId = session.user.id;

  const messages = await db.message.findMany({
    where: {
      eventId,
      OR: [
        { senderId: currentUserId, receiverId: partnerId },
        { senderId: partnerId, receiverId: currentUserId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  const clientMessages = messages.map((m) => ({
    id: m.id,
    content: m.content,
    isOutgoing: m.senderId === currentUserId,
    isRead: m.read,
    createdAt: m.createdAt.toISOString(),
    isIcebreaker: m.isIcebreaker,
  }));

  return NextResponse.json({ messages: clientMessages });
}
