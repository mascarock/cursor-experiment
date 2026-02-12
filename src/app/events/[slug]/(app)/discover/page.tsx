import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect, notFound } from "next/navigation";
import { getRecommendations } from "@/lib/recommendations";
import { StickyHeader } from "@/components/sticky-header";
import { DiscoverClient } from "./discover-client";

export default async function DiscoverPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/events/${slug}`);
  }

  const event = await db.event.findUnique({
    where: { slug },
  });

  if (!event) notFound();

  // Get recommendations
  const recommendations = await getRecommendations(session.user.id, event.id);

  // Transform for client component
  const clientRecommendations = recommendations.map((r) => ({
    userId: r.profile.userId,
    name: r.profile.user.name || "Anonymous",
    image: r.profile.user.image,
    currentRole: r.profile.currentRole,
    company: r.profile.company,
    matchScore: r.matchScore,
    matchType: r.matchType,
    matchExplanation: r.matchExplanation,
    matchIcon: r.matchIcon,
    sharedTags: r.sharedTags,
    connectionStatus: r.connectionStatus,
    skills: r.profile.skills,
  }));

  // Get live activity info
  const participantCount = await db.eventParticipant.count({
    where: { eventId: event.id },
  });

  return (
    <div className="flex flex-col min-h-screen">
      <StickyHeader
        eventName={event.name}
        eventLocation={event.location}
        userImage={session.user.image}
      >
        <div className="mt-4">
          {/* Search and filters rendered by client component */}
        </div>
      </StickyHeader>

      <main className="flex-1 w-full max-w-md mx-auto px-5 pt-2 pb-6">
        <DiscoverClient
          eventSlug={slug}
          eventId={event.id}
          recommendations={clientRecommendations}
        />

        {/* Live Activity Card */}
        {event.isLive && (
          <section className="mt-8 pb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Live Activity</h2>
            </div>
            <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {/* Stack of participant avatars */}
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white dark:border-card-dark bg-slate-200 dark:bg-slate-700 flex items-center justify-center"
                    >
                      <span className="material-icons text-slate-400 text-sm">
                        person
                      </span>
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-slate-800 dark:text-white">
                    {event.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {participantCount} attendees • {event.location}
                  </p>
                </div>
              </div>
              <span className="text-primary text-sm font-semibold">Live</span>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
