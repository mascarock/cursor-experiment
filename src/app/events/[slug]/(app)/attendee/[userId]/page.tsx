import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { GlassHeader } from "@/components/glass-header";
import { parseJsonArray } from "@/lib/arrays";
import Link from "next/link";

export default async function AttendeeProfilePage({
  params,
}: {
  params: Promise<{ slug: string; userId: string }>;
}) {
  const { slug, userId } = await params;
  const session = await auth();
  const event = await db.event.findUnique({ where: { slug } });
  if (!event) notFound();

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) notFound();

  const profile = await db.profile.findUnique({
    where: { userId_eventId: { userId, eventId: event.id } },
  });
  if (!profile || !profile.isVisible) notFound();

  const skills = parseJsonArray(profile.skills);
  const interests = parseJsonArray(profile.interests);
  const lookingFor = parseJsonArray(profile.lookingFor);

  const experiences = await db.experience.findMany({
    where: { userId },
    orderBy: { isCurrent: "desc" },
  });

  // Check connection status
  const connection = session?.user?.id
    ? await db.connection.findFirst({
        where: {
          eventId: event.id,
          OR: [
            { requesterId: session.user.id, receiverId: userId },
            { requesterId: userId, receiverId: session.user.id },
          ],
        },
      })
    : null;

  return (
    <div className="w-full max-w-md mx-auto bg-bg-light dark:bg-bg-dark min-h-dvh relative flex flex-col">
      <GlassHeader showBookmark />

      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        {/* Hero Section */}
        <div className="relative pt-32 pb-8 px-6 bg-gradient-to-b from-primary/10 via-bg-light dark:via-bg-dark to-bg-light dark:to-bg-dark">
          <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-br from-primary/20 to-transparent opacity-50 blur-3xl pointer-events-none" />
          <div className="relative flex flex-col items-center text-center z-10">
            {/* Avatar */}
            <div className="relative mb-5">
              <div className="p-1 rounded-full bg-gradient-to-br from-primary to-primary/40 shadow-lg shadow-primary/20">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "User"}
                    className="w-32 h-32 rounded-full object-cover border-4 border-bg-light dark:border-bg-dark"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-bg-light dark:border-bg-dark flex items-center justify-center">
                    <span className="material-icons-round text-slate-400 text-5xl">
                      person
                    </span>
                  </div>
                )}
              </div>
              <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-bg-light dark:border-bg-dark rounded-full" />
            </div>

            {/* Name & Role */}
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
              {user.name || "Anonymous"}
            </h1>
            {profile.currentRole && (
              <p className="text-base text-primary font-medium mb-1">
                {profile.currentRole}
              </p>
            )}
            {profile.company && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-6">
                <span className="material-icons-round text-base">business</span>
                <span>{profile.company}</span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-4 w-full max-w-xs mx-auto mb-2">
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-[#0077b5]/10 hover:bg-[#0077b5]/20 text-[#0077b5] dark:text-[#389ce6] rounded-lg transition-all text-sm font-semibold border border-[#0077b5]/20"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  LinkedIn
                </a>
              )}
              {user.websiteUrl && (
                <a
                  href={user.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-all text-sm font-semibold border border-transparent dark:border-slate-700"
                >
                  <span className="material-icons-round text-base">link</span>
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-28 space-y-8">
          {/* About */}
          {(profile.aboutMe || profile.aboutMeAiExpanded) && (
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  About
                </h2>
                {profile.aboutMeAiExpanded && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-[10px] font-bold uppercase tracking-wider">
                    <span className="material-icons-round text-[10px]">
                      auto_awesome
                    </span>
                    AI Summary
                  </div>
                )}
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                {profile.aboutMeAiExpanded || profile.aboutMe}
              </p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                Experience
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-primary">
                      {exp.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                        {exp.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {exp.company} &bull; {exp.period}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Interests
              </h2>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Looking For */}
          {lookingFor.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Looking For
              </h2>
              <div className="flex flex-wrap gap-2">
                {lookingFor.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Sticky Footer CTA */}
      <footer className="absolute bottom-16 left-0 right-0 p-4 glass-panel border-t border-slate-200/10 dark:border-slate-700/30 z-30">
        <div className="flex gap-3 items-center">
          <Link
            href={`/events/${slug}/chats/${userId}`}
            className="flex-1 bg-primary hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-primary/25 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span className="material-icons-round text-xl">
              chat_bubble_outline
            </span>
            Send Message
          </Link>
          <form
            action={async () => {
              "use server";
              // Connection handled by client action
            }}
          >
            <button
              type="button"
              className={`p-3.5 rounded-xl transition-colors active:scale-95 border ${
                connection
                  ? "bg-primary/20 text-primary border-primary/30"
                  : "bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-transparent dark:border-slate-700"
              }`}
            >
              <span className="material-icons-round text-xl">
                {connection ? "person_add_disabled" : "person_add"}
              </span>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
