import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { parseJsonArray } from "@/lib/arrays";
import Link from "next/link";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  if (!session?.user) redirect(`/events/${slug}`);

  const event = await db.event.findUnique({ where: { slug } });
  if (!event) notFound();

  const user = session.user;
  const profile = await db.profile.findUnique({
    where: { userId_eventId: { userId: user.id!, eventId: event.id } },
  });

  const experiences = await db.experience.findMany({
    where: { userId: user.id! },
    orderBy: { isCurrent: "desc" },
  });

  return (
    <div className="w-full max-w-md mx-auto pb-8">
      {/* Hero Section */}
      <div className="relative pt-8 pb-8 px-6 bg-gradient-to-b from-primary/10 via-bg-light dark:via-bg-dark to-bg-light dark:to-bg-dark">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="p-1 rounded-full bg-gradient-to-br from-primary to-primary/40 shadow-lg shadow-primary/20">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "You"}
                  className="w-28 h-28 rounded-full object-cover border-4 border-bg-light dark:border-bg-dark"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-bg-light dark:border-bg-dark flex items-center justify-center">
                  <span className="material-icons-round text-slate-400 text-4xl">
                    person
                  </span>
                </div>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">{user.name || "Your Name"}</h1>
          {profile?.currentRole && (
            <p className="text-base text-primary font-medium mb-1">
              {profile.currentRole}
            </p>
          )}
          {profile?.company && (
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 mb-4">
              <span className="material-icons-round text-base">business</span>
              <span>{profile.company}</span>
            </div>
          )}

          <Link
            href={`/events/${slug}/onboarding`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all text-sm font-semibold border border-primary/20"
          >
            <span className="material-icons-round text-base">edit</span>
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-8">
        {profile?.aboutMe && (
          <section>
            <h2 className="text-lg font-bold mb-3">About</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
              {profile.aboutMeAiExpanded || profile.aboutMe}
            </p>
          </section>
        )}

        {experiences.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4">Experience</h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-primary">
                    {exp.company.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold">{exp.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {exp.company} &bull; {exp.period}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile && parseJsonArray(profile.skills).length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {parseJsonArray(profile.skills).map((skill) => (
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

        {profile && parseJsonArray(profile.interests).length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {parseJsonArray(profile.interests).map((interest) => (
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

        {/* Sign Out */}
        <form
          action={async () => {
            "use server";
            const { signOut } = await import("@/lib/auth");
            await signOut({ redirectTo: "/events" });
          }}
        >
          <button
            type="submit"
            className="w-full py-3 mt-4 text-sm font-medium text-red-500 hover:text-red-400 transition text-center border border-red-500/20 rounded-xl hover:bg-red-500/5"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
