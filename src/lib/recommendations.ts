import { db } from "@/lib/db";
import { parseJsonArray } from "@/lib/arrays";

interface ProfileWithUser {
  id: string;
  userId: string;
  eventId: string;
  aboutMe: string | null;
  aboutMeAiExpanded: string | null;
  currentRole: string | null;
  company: string | null;
  skills: string[];
  interests: string[];
  lookingFor: string[];
  isVisible: boolean;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    linkedinUrl: string | null;
    websiteUrl: string | null;
  };
}

/** Convert a raw Prisma profile (JSON string fields) to ProfileWithUser with parsed arrays */
function toProfileWithUser(raw: {
  id: string;
  userId: string;
  eventId: string;
  aboutMe: string | null;
  aboutMeAiExpanded: string | null;
  currentRole: string | null;
  company: string | null;
  skills: string;
  interests: string;
  lookingFor: string;
  isVisible: boolean;
  user: { id: string; name: string | null; email: string; image: string | null; linkedinUrl: string | null; websiteUrl: string | null };
}): ProfileWithUser {
  return {
    ...raw,
    skills: parseJsonArray(raw.skills),
    interests: parseJsonArray(raw.interests),
    lookingFor: parseJsonArray(raw.lookingFor),
  };
}

export interface RecommendationResult {
  profile: ProfileWithUser;
  matchScore: number;
  matchType: "skills" | "interests" | "complementary" | "alumni";
  matchExplanation: string;
  matchIcon: string;
  sharedTags: string[];
  connectionStatus: "none" | "pending" | "accepted";
}

function intersect(a: string[], b: string[]): string[] {
  const setB = new Set(b.map((s) => s.toLowerCase()));
  return a.filter((s) => setB.has(s.toLowerCase()));
}

function computeMatchScore(
  myProfile: ProfileWithUser,
  theirProfile: ProfileWithUser
): {
  score: number;
  matchType: "skills" | "interests" | "complementary" | "alumni";
  explanation: string;
  icon: string;
  sharedTags: string[];
} {
  let totalScore = 0;

  // Skills match: 3x per shared skill
  const sharedSkills = intersect(myProfile.skills, theirProfile.skills);
  totalScore += sharedSkills.length * 3;

  // Interests match: 2x per shared interest
  const sharedInterests = intersect(myProfile.interests, theirProfile.interests);
  totalScore += sharedInterests.length * 2;

  // Complementary: 4x if my lookingFor matches their currentRole
  let isComplementary = false;
  if (myProfile.lookingFor.length > 0 && theirProfile.currentRole) {
    const theirRoleLower = theirProfile.currentRole.toLowerCase();
    for (const looking of myProfile.lookingFor) {
      if (theirRoleLower.includes(looking.toLowerCase()) || looking.toLowerCase().includes(theirRoleLower)) {
        totalScore += 4;
        isComplementary = true;
        break;
      }
    }
  }

  // Reverse complementary: their lookingFor matches my currentRole
  let theyLookForMe = false;
  if (theirProfile.lookingFor.length > 0 && myProfile.currentRole) {
    const myRoleLower = myProfile.currentRole.toLowerCase();
    for (const looking of theirProfile.lookingFor) {
      if (myRoleLower.includes(looking.toLowerCase()) || looking.toLowerCase().includes(myRoleLower)) {
        totalScore += 4;
        theyLookForMe = true;
        break;
      }
    }
  }

  // Normalize to 0-100
  const maxPossible = Math.max(
    (Math.max(myProfile.skills.length, theirProfile.skills.length) * 3) +
    (Math.max(myProfile.interests.length, theirProfile.interests.length) * 2) +
    8, // complementary both ways
    1
  );
  const normalizedScore = Math.min(Math.round((totalScore / maxPossible) * 100), 99);

  // Determine best match explanation
  const allShared = [...sharedInterests, ...sharedSkills];

  if (isComplementary || theyLookForMe) {
    const roleLabel = theirProfile.currentRole || "professionals";
    return {
      score: Math.max(normalizedScore, 85),
      matchType: "complementary",
      explanation: `Looking for ${roleLabel}s like you`,
      icon: "lightbulb",
      sharedTags: allShared.slice(0, 3),
    };
  }

  if (sharedInterests.length >= sharedSkills.length && sharedInterests.length > 0) {
    const top2 = sharedInterests.slice(0, 2);
    return {
      score: normalizedScore,
      matchType: "interests",
      explanation: `Both interested in ${top2.map((t) => t).join(" & ")}`,
      icon: "auto_awesome",
      sharedTags: allShared.slice(0, 4),
    };
  }

  if (sharedSkills.length > 0) {
    const top2 = sharedSkills.slice(0, 2);
    return {
      score: normalizedScore,
      matchType: "skills",
      explanation: `Both skilled in ${top2.join(" & ")}`,
      icon: "code",
      sharedTags: allShared.slice(0, 4),
    };
  }

  // Fallback: low match
  return {
    score: Math.max(normalizedScore, 40),
    matchType: "interests",
    explanation: "Attending the same event",
    icon: "domain",
    sharedTags: allShared.slice(0, 3),
  };
}

export async function getRecommendations(
  userId: string,
  eventId: string,
  options?: {
    filter?: string;
    search?: string;
  }
): Promise<RecommendationResult[]> {
  // Get current user's profile
  const myProfile = await db.profile.findUnique({
    where: { userId_eventId: { userId, eventId } },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true, linkedinUrl: true, websiteUrl: true },
      },
    },
  });

  if (!myProfile) return [];
  const myParsed = toProfileWithUser(myProfile);

  // Get all other visible profiles for this event
  const otherProfiles = await db.profile.findMany({
    where: {
      eventId,
      isVisible: true,
      onboardingComplete: true,
      userId: { not: userId },
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true, linkedinUrl: true, websiteUrl: true },
      },
    },
  });

  // Get existing connections for this user in this event
  const connections = await db.connection.findMany({
    where: {
      eventId,
      OR: [{ requesterId: userId }, { receiverId: userId }],
    },
  });

  const connectionMap = new Map<string, "pending" | "accepted">();
  for (const conn of connections) {
    const otherUserId = conn.requesterId === userId ? conn.receiverId : conn.requesterId;
    connectionMap.set(
      otherUserId,
      conn.status === "ACCEPTED" ? "accepted" : "pending"
    );
  }

  // Calculate scores
  let results: RecommendationResult[] = otherProfiles.map((rawProfile) => {
    const profile = toProfileWithUser(rawProfile);
    const { score, matchType, explanation, icon, sharedTags } = computeMatchScore(
      myParsed,
      profile
    );
    return {
      profile,
      matchScore: score,
      matchType,
      matchExplanation: explanation,
      matchIcon: icon,
      sharedTags,
      connectionStatus: connectionMap.get(profile.userId) ?? "none",
    };
  });

  // Apply search filter
  if (options?.search) {
    const q = options.search.toLowerCase();
    results = results.filter(
      (r) =>
        r.profile.user.name?.toLowerCase().includes(q) ||
        r.profile.currentRole?.toLowerCase().includes(q) ||
        r.profile.company?.toLowerCase().includes(q)
    );
  }

  // Apply role category filter
  if (options?.filter && options.filter !== "all") {
    const filterLower = options.filter.toLowerCase();
    results = results.filter((r) => {
      const role = r.profile.currentRole?.toLowerCase() || "";
      const skills = r.profile.skills.map((s) => s.toLowerCase());

      if (filterLower === "developers") {
        return (
          role.includes("engineer") ||
          role.includes("developer") ||
          role.includes("dev") ||
          skills.some((s) => ["react", "typescript", "python", "javascript", "node", "go", "rust"].includes(s))
        );
      }
      if (filterLower === "designers") {
        return (
          role.includes("design") ||
          role.includes("ux") ||
          role.includes("ui") ||
          skills.some((s) => ["figma", "design", "ux", "ui", "prototyping"].includes(s))
        );
      }
      if (filterLower === "investors") {
        return (
          role.includes("invest") ||
          role.includes("vc") ||
          role.includes("partner") ||
          role.includes("capital")
        );
      }
      return true;
    });
  }

  // Sort by score descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return results;
}
