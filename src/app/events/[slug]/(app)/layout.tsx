import { BottomNavBar } from "@/components/bottom-nav-bar";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/events/${slug}`);
  }

  const event = await db.event.findUnique({
    where: { slug },
  });

  if (!event) {
    notFound();
  }

  // Count unread messages
  const unreadCount = await db.message.count({
    where: {
      eventId: event.id,
      receiverId: session.user.id,
      read: false,
    },
  });

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark pb-20">
      {children}
      <BottomNavBar eventSlug={slug} unreadCount={unreadCount} />
    </div>
  );
}
