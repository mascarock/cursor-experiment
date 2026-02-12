import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { parseJsonArray } from "@/lib/arrays";
import { OnboardingWizard } from "./onboarding-wizard";

export default async function OnboardingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/events/${slug}`);
  }

  const event = await db.event.findUnique({ where: { slug } });
  if (!event) notFound();

  // Ensure participant exists
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

  // Get existing profile if any
  const profile = await db.profile.findUnique({
    where: {
      userId_eventId: { userId: session.user.id, eventId: event.id },
    },
  });

  if (profile?.onboardingComplete) {
    redirect(`/events/${slug}/discover`);
  }

  return (
    <OnboardingWizard
      eventSlug={slug}
      eventId={event.id}
      eventName={event.name}
      existingProfile={
        profile
          ? {
              aboutMe: profile.aboutMe || "",
              currentRole: profile.currentRole || "",
              company: profile.company || "",
              skills: parseJsonArray(profile.skills),
              interests: parseJsonArray(profile.interests),
              lookingFor: parseJsonArray(profile.lookingFor),
            }
          : undefined
      }
    />
  );
}
