"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface ProfileData {
  aboutMe: string;
  currentRole: string;
  company: string;
  skills: string[];
  interests: string[];
  lookingFor: string[];
}

export async function saveProfile(eventId: string, data: ProfileData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  await db.profile.upsert({
    where: {
      userId_eventId: { userId: session.user.id, eventId },
    },
    update: {
      aboutMe: data.aboutMe,
      currentRole: data.currentRole,
      company: data.company,
      skills: data.skills,
      interests: data.interests,
      lookingFor: data.lookingFor,
      onboardingComplete: true,
    },
    create: {
      userId: session.user.id,
      eventId,
      aboutMe: data.aboutMe,
      currentRole: data.currentRole,
      company: data.company,
      skills: data.skills,
      interests: data.interests,
      lookingFor: data.lookingFor,
      onboardingComplete: true,
    },
  });
}
