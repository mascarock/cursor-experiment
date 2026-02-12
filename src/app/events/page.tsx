import Link from "next/link";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const events = await db.event.findMany({
    orderBy: { startDate: "desc" },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark">
      <div className="max-w-md mx-auto px-5 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Tech<span className="text-primary">Connect</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Find your next event and start networking
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16">
            <span className="material-icons-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4 block">
              event
            </span>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No events available yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="block bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-5 hover:shadow-md dark:hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {event.isLive && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-semibold text-primary uppercase tracking-wide">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                          </span>
                          Live
                        </span>
                      )}
                    </div>
                    <h2 className="text-lg font-bold mb-1">{event.name}</h2>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <span className="material-icons-outlined text-sm text-primary">
                          calendar_today
                        </span>
                        {new Date(event.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                        {" - "}
                        {new Date(event.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-icons-outlined text-sm text-primary">
                          location_on
                        </span>
                        {event.location}
                      </span>
                    </div>
                  </div>
                  <span className="material-icons-outlined text-slate-400">
                    chevron_right
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
