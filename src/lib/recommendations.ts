import { db } from "@/lib/db";

interface RecommendedProfile {
  userId: string;
  name: string;
  image: string | null;
  currentRole: string;
  company: string;
  skills: string[];
  interests: string[];
  lookingFor: string[];
  matchScore: number;
  matchReason: string;
  matchIcon: string;
  sharedTags: string[];
}

export async function getRecommendations(
  eventId: string,
  currentUserId: string,
  filter?: string
): Promise<RecommendedProfile[]> {
  // Get current user's profile
  const myProfile = await db.profile.findUnique({
    where: { userId_eventId: { userId: currentUserId, eventId } },
  });

  if (!myProfile) return [];

  // Get all visible profiles in the event except the current user
  const profiles = await db.profile.findMany({
    where: {
      eventId,
      isVisible: true,
      onboardingComplete: true,
      userId: { not: currentUserId },
    },
    include: {
      user: {
        select: { id: true, name: true, image: true },
      },
    },
  });

  // Calculate match scores
  const recommendations: RecommendedProfile[] = profiles
    .map((profile) => {
      let score = 0;
      const sharedSkills = profile.skills.filter((s) =>
        myProfile.skills.map((ms) => ms.toLowerCase()).includes(s.toLowerCase())
      );
      const sharedInterests = profile.interests.filter((i) =>
        myProfile.interests
          .map((mi) => mi.toLowerCase())
          .includes(i.toLowerCase())
      );

      // Skills match: 3 points each
      score += sharedSkills.length * 3;
      // Interests match: 2 points each
      score += sharedInterests.length * 2;

      // Complementary lookingFor match: 4 points
      let complementaryMatch = false;
      for (const lookFor of myProfile.lookingFor) {
        const roleLower = (profile.currentRole || "").toLowerCase();
        if (roleLower.includes(lookFor.toLowerCase())) {
          score += 4;
          complementaryMatch = true;
          break;
        }
      }

      // Reverse complementary
      for (const lookFor of profile.lookingFor) {
        const roleLower = (myProfile.currentRole || "").toLowerCase();
        if (roleLower.includes(lookFor.toLowerCase())) {
          score += 4;
          if (!complementaryMatch) complementaryMatch = true;
          break;
        }
      }

      // Base score for being in the same event
      score += 1;

      // Normalize to 0-100
      const maxPossible = Math.max(
        (myProfile.skills.length + profile.skills.length) * 3 +
        (myProfile.interests.length + profile.interests.length) * 2 + 8 + 1,
        1
      );
      const normalizedScore = Math.min(Math.round((score / maxPossible) * 100), 99);

      // Determine match reason
      let matchReason = "";
      let matchIcon = "bolt";
      const sharedTags = [...sharedSkills, ...sharedInterests];

      if (sharedTags.length >= 2) {
        matchReason = `Both interested in ${sharedTags[0]} & ${sharedTags[1]}`;
        matchIcon = "auto_awesome";
      } else if (sharedTags.length === 1) {
        matchReason = `Shared interest in ${sharedTags[0]}`;
        matchIcon = "auto_awesome";
      } else if (complementaryMatch) {
        matchReason = `Looking for ${myProfile.currentRole || "your role"}`;
        matchIcon = "lightbulb";
      } else {
        matchReason = "Attending the same event";
        matchIcon = "domain";
      }

      return {
        userId: profile.userId,
        name: profile.user.name || "Anonymous",
        image: profile.user.image,
        currentRole: profile.currentRole || "",
        company: profile.company || "",
        skills: profile.skills,
        interests: profile.interests,
        lookingFor: profile.lookingFor,
        matchScore: normalizedScore,
        matchReason,
        matchIcon,
        sharedTags,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  // Apply filter
  if (filter && filter !== "all") {
    return recommendations.filter((r) => {
      const role = r.currentRole.toLowerCase();
      switch (filter) {
        case "developers":
          return (
            role.includes("engineer") ||
            role.includes("developer") ||
            role.includes("dev")
          );
        case "designers":
          return role.includes("design");
        case "investors":
          return (
            role.includes("invest") ||
            role.includes("vc") ||
            role.includes("capital")
          );
        default:
          return true;
      }
    });
  }

  return recommendations;
}
