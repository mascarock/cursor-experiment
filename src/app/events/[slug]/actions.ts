"use server";

import { auth, signIn } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function joinEvent(formData: FormData) {
  const eventSlug = formData.get("eventSlug") as string;
  const session = await auth();

  if (!session?.user) {
    // Redirect to login with callback
    await signIn(undefined, { redirectTo: `/events/${eventSlug}` });
    return;
  }

  const event = await db.event.findUnique({ where: { slug: eventSlug } });
  if (!event) return;

  // Create participant if not exists
  await db.eventParticipant.upsert({
    where: {
      eventId_userId: { eventId: event.id, userId: session.user.id },
    },
    update: {},
    create: {
      eventId: event.id,
      userId: session.user.id,
    },
  });

  // Check if profile exists
  const profile = await db.profile.findUnique({
    where: {
      userId_eventId: { userId: session.user.id, eventId: event.id },
    },
  });

  if (!profile || !profile.onboardingComplete) {
    redirect(`/events/${eventSlug}/onboarding`);
  } else {
    redirect(`/events/${eventSlug}/discover`);
  }
}
