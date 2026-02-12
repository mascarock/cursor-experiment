"use client";

import Link from "next/link";
import { useTransition } from "react";

interface RecommendationCardProps {
  eventSlug: string;
  userId: string;
  name: string;
  image: string | null;
  currentRole: string | null;
  company: string | null;
  matchScore: number;
  matchType: "skills" | "interests" | "complementary" | "alumni";
  matchExplanation: string;
  matchIcon: string;
  sharedTags: string[];
  connectionStatus: "none" | "pending" | "accepted";
  onConnect: () => Promise<void>;
  isOnline?: boolean;
}

export function RecommendationCard({
  eventSlug,
  userId,
  name,
  image,
  currentRole,
  company,
  matchScore,
  matchType,
  matchExplanation,
  matchIcon,
  sharedTags,
  connectionStatus,
  onConnect,
  isOnline = false,
}: RecommendationCardProps) {
  const [isPending, startTransition] = useTransition();

  const isAlumni = matchType === "alumni";
  const badgeBg = isAlumni
    ? "bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/10"
    : "bg-primary/10 dark:bg-primary/20 text-primary border-primary/10";
  const badgeIcon = isAlumni ? "school" : "bolt";
  const badgeText = isAlumni ? "Alumni" : `${matchScore}% Match`;

  // Generate avatar initials
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  // Display max 3 tags + overflow
  const visibleTags = sharedTags.slice(0, 3);
  const overflowCount = sharedTags.length - 3;

  return (
    <article className="group bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md dark:hover:border-slate-700 transition-all duration-300 overflow-hidden relative">
      {/* Match Badge */}
      <div
        className={`absolute top-0 right-0 ${badgeBg} px-3 py-1 rounded-bl-xl border-l border-b backdrop-blur-sm`}
      >
        <div className="flex items-center gap-1.5">
          <span className="material-icons text-[14px]">{badgeIcon}</span>
          <span className="text-[10px] font-bold uppercase tracking-wide">
            {badgeText}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Link
            href={`/events/${eventSlug}/attendee/${userId}`}
            className="relative flex-none"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-700">
              {image ? (
                <img
                  src={image}
                  alt={name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <span className="text-lg font-bold text-slate-500 dark:text-slate-300">
                    {initials}
                  </span>
                </div>
              )}
            </div>
            {isOnline && (
              <div
                className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-card-dark"
                title="Online Now"
              />
            )}
          </Link>

          {/* Info */}
          <div className="flex-1 min-w-0 pt-1">
            <Link href={`/events/${eventSlug}/attendee/${userId}`}>
              <h3 className="text-lg font-bold truncate leading-tight hover:text-primary transition-colors">
                {name || "Anonymous"}
              </h3>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              {currentRole || "Attendee"}
              {company && (
                <>
                  {" at "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {company}
                  </span>
                </>
              )}
            </p>

            {/* Match explanation */}
            <div className="mt-3 inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700/50 w-full">
              <span className="material-icons text-primary text-[16px]">
                {matchIcon}
              </span>
              <p
                className="text-xs font-medium text-slate-600 dark:text-slate-300 truncate"
                dangerouslySetInnerHTML={{
                  __html: matchExplanation.replace(
                    /\b([A-Z][a-zA-Z\s\/]+(?:&\s*[A-Z][a-zA-Z\s\/]+)?)\b/g,
                    (match, p1) => {
                      // Bold the key terms already formatted as "Both interested in X & Y"
                      return match;
                    }
                  ),
                }}
              />
            </div>
          </div>
        </div>

        {/* Interest Tags */}
        {visibleTags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleTags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700"
              >
                {tag}
              </span>
            ))}
            {overflowCount > 0 && (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium border border-slate-200 dark:border-slate-700">
                +{overflowCount}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link
            href={`/events/${eventSlug}/chats/${userId}`}
            className="col-span-1 py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-icons text-[18px]">
              chat_bubble_outline
            </span>
            Message
          </Link>
          <button
            onClick={() => startTransition(onConnect)}
            disabled={connectionStatus !== "none" || isPending}
            className={`col-span-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              connectionStatus === "accepted"
                ? "bg-green-600 text-white cursor-default"
                : connectionStatus === "pending"
                  ? "bg-slate-600 text-white cursor-default"
                  : "bg-primary text-white hover:bg-blue-600 shadow-lg shadow-primary/20"
            } disabled:opacity-70`}
          >
            <span className="material-icons text-[18px]">
              {connectionStatus === "accepted"
                ? "check_circle"
                : connectionStatus === "pending"
                  ? "hourglass_top"
                  : "person_add"}
            </span>
            {isPending
              ? "..."
              : connectionStatus === "accepted"
                ? "Connected"
                : connectionStatus === "pending"
                  ? "Pending"
                  : "Connect"}
          </button>
        </div>
      </div>
    </article>
  );
}
