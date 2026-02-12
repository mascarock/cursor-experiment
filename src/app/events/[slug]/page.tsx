import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { joinEvent } from "./actions";

export const dynamic = "force-dynamic";

export default async function EventWelcomePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await db.event.findUnique({ where: { slug } });

  if (!event) {
    notFound();
  }

  const session = await auth();

  // If already a participant with completed profile, go to discover
  if (session?.user) {
    const participant = await db.eventParticipant.findUnique({
      where: {
        eventId_userId: { eventId: event.id, userId: session.user.id },
      },
    });
    const profile = await db.profile.findUnique({
      where: {
        userId_eventId: { userId: session.user.id, eventId: event.id },
      },
    });
    if (participant && profile?.onboardingComplete) {
      redirect(`/events/${slug}/discover`);
    }
  }

  const participantCount = await db.eventParticipant.count({
    where: { eventId: event.id },
  });

  const startStr = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const endStr = new Date(event.endDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="relative w-full h-dvh max-w-md mx-auto bg-white dark:bg-bg-dark shadow-2xl overflow-hidden flex flex-col">
      {/* Hero Background */}
      <div
        className="absolute inset-0 z-0 h-3/5 w-full bg-cover bg-center"
        style={{
          backgroundImage: event.heroImage
            ? `url('${event.heroImage}')`
            : "linear-gradient(135deg, #101922 0%, #137fec 100%)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-bg-dark/80 to-bg-dark" />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 w-full px-6 pt-12 flex justify-between items-center text-white/80">
        <Link
          href="/events"
          className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
        >
          <span className="material-icons-outlined text-sm">arrow_back</span>
        </Link>
        <div className="text-xs font-medium tracking-wider uppercase opacity-80">
          TechConnect App
        </div>
        <button className="p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition">
          <span className="material-icons-outlined text-sm">more_horiz</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-end px-6 pb-10 space-y-8">
        {/* Event Header */}
        <div className="space-y-4">
          {event.isLive && (
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                Live Now
              </span>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
            {event.name}
          </h1>
          <div className="flex items-center space-x-4 text-gray-300">
            <div className="flex items-center space-x-1.5">
              <span className="material-icons-outlined text-lg text-primary">
                calendar_today
              </span>
              <span className="text-sm font-medium">
                {startStr}-{endStr}
              </span>
            </div>
            <div className="h-1 w-1 rounded-full bg-gray-500" />
            <div className="flex items-center space-x-1.5">
              <span className="material-icons-outlined text-lg text-primary">
                location_on
              </span>
              <span className="text-sm font-medium">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Value Proposition Card */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 p-3 bg-primary/20 rounded-lg">
              <span className="material-icons-outlined text-primary text-xl">
                hub
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Unlock Smart Networking
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Join over {participantCount.toLocaleString()} developers &amp;
                founders. Complete your profile to get personalized 1:1 meeting
                recommendations.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-2">
          <form action={joinEvent}>
            <input type="hidden" name="eventSlug" value={slug} />
            <button
              type="submit"
              className="w-full py-4 px-6 bg-primary hover:bg-blue-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/25 transition transform active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>Join Event</span>
              <span className="material-icons-outlined text-xl">
                arrow_forward
              </span>
            </button>
          </form>
          {!session && (
            <Link
              href={`/login?callbackUrl=/events/${slug}`}
              className="block w-full py-3 text-sm font-medium text-gray-400 hover:text-white transition text-center"
            >
              Already registered?{" "}
              <span className="text-primary underline decoration-primary/50 underline-offset-4">
                Log in here
              </span>
            </Link>
          )}
        </div>

        {/* Footer Indicator */}
        <div className="flex justify-center pt-2">
          <div className="h-1 w-1/3 bg-gray-700 rounded-full opacity-50" />
        </div>
      </div>
    </div>
  );
}
