"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TagInput } from "@/components/tag-input";
import { saveProfile } from "./actions";

interface ProfileData {
  aboutMe: string;
  currentRole: string;
  company: string;
  skills: string[];
  interests: string[];
  lookingFor: string[];
}

interface OnboardingWizardProps {
  eventSlug: string;
  eventId: string;
  eventName: string;
  existingProfile?: ProfileData;
}

const SKILL_SUGGESTIONS = [
  "React", "TypeScript", "Python", "Node.js", "AWS", "Docker",
  "Kubernetes", "ML/AI", "Product Design", "Data Science",
];

const INTEREST_SUGGESTIONS = [
  "Startups", "Open Source", "Fintech", "HealthTech", "Web3",
  "Leadership", "Marketing", "DevOps", "Mobile", "Coding",
];

const LOOKING_FOR_OPTIONS = [
  "Co-founders", "Mentors", "Investors", "Clients",
  "Collaborators", "Hiring Talent", "Job Opportunities",
  "Learning Partners", "Tech Leads", "Advisors",
];

export function OnboardingWizard({
  eventSlug,
  eventId,
  eventName,
  existingProfile,
}: OnboardingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(
    existingProfile || {
      aboutMe: "",
      currentRole: "",
      company: "",
      skills: [],
      interests: [],
      lookingFor: [],
    }
  );

  const totalSteps = 4;

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveProfile(eventId, profile);
      router.push(`/events/${eventSlug}/discover`);
    } catch {
      setSaving(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true;
      case 2:
        return profile.aboutMe.length > 0 || profile.currentRole.length > 0;
      case 3:
        return true;
      case 4:
        return true;
      default:
        return true;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-bg-light dark:bg-bg-dark min-h-dvh flex flex-col overflow-hidden">
      {/* Header with Progress */}
      <header className="px-6 py-4 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
            className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
          >
            <span className="material-icons-round">arrow_back</span>
          </button>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Step {step} of {totalSteps}
          </span>
          <button
            onClick={() => {
              if (step < totalSteps) setStep(step + 1);
              else handleSave();
            }}
            className="text-sm font-semibold text-primary hover:text-blue-400"
          >
            Skip
          </button>
        </div>
        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-32">
        {step === 1 && <StepWelcome eventName={eventName} />}
        {step === 2 && (
          <StepProfile profile={profile} setProfile={setProfile} />
        )}
        {step === 3 && (
          <StepInterests profile={profile} setProfile={setProfile} />
        )}
        {step === 4 && <StepPreview profile={profile} />}
      </main>

      {/* Sticky Footer */}
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-bg-light via-bg-light to-transparent dark:from-bg-dark dark:via-bg-dark dark:to-transparent pt-12">
        <button
          onClick={() => {
            if (step < totalSteps) {
              setStep(step + 1);
            } else {
              handleSave();
            }
          }}
          disabled={!canProceed() || saving}
          className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <span className="material-icons-round text-sm animate-spin">
              refresh
            </span>
          ) : step === totalSteps ? (
            "Complete Setup"
          ) : (
            <>
              Continue
              <span className="material-icons-round text-sm">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function StepWelcome({ eventName }: { eventName: string }) {
  return (
    <div className="mt-8 text-center space-y-6">
      <div className="w-20 h-20 bg-primary/20 rounded-2xl mx-auto flex items-center justify-center">
        <span className="material-icons-outlined text-primary text-4xl">
          hub
        </span>
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-3">
          Welcome to {eventName}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
          Let&apos;s set up your profile so others can find you and we can
          recommend the best connections for you.
        </p>
      </div>
      <div className="space-y-3 text-left max-w-xs mx-auto">
        {[
          { icon: "person", text: "Build your professional profile" },
          { icon: "auto_awesome", text: "Get AI-powered match recommendations" },
          { icon: "chat_bubble_outline", text: "Start conversations with icebreakers" },
        ].map((item) => (
          <div key={item.icon} className="flex items-center gap-3 text-sm">
            <span className="material-icons-outlined text-primary text-lg">
              {item.icon}
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepProfile({
  profile,
  setProfile,
}: {
  profile: ProfileData;
  setProfile: (p: ProfileData) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-8 mt-2">
        <h1 className="text-2xl font-bold mb-2">Build your Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Help others find you by sharing your role, experience, and interests.
        </p>
      </div>

      {/* LinkedIn Import Placeholder */}
      <button
        type="button"
        className="w-full mb-2 flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-surface-dark transition-colors group opacity-60 cursor-not-allowed"
        disabled
      >
        <svg
          className="w-5 h-5 fill-current text-slate-400"
          viewBox="0 0 24 24"
        >
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Autofill with LinkedIn (Coming Soon)
        </span>
      </button>

      {/* About Me */}
      <div className="relative group">
        <div className="flex justify-between items-end mb-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            About Me
          </label>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {profile.aboutMe.length}/500
          </span>
        </div>
        <div className="relative">
          <textarea
            value={profile.aboutMe}
            onChange={(e) =>
              setProfile({ ...profile, aboutMe: e.target.value.slice(0, 500) })
            }
            className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm min-h-[140px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 leading-relaxed"
            placeholder="I'm a Product Designer with 5 years of experience in SaaS..."
          />
          <button
            type="button"
            className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary px-3 py-1.5 rounded-lg transition-colors backdrop-blur-sm"
          >
            <span className="material-icons-round text-sm animate-pulse">
              auto_awesome
            </span>
            <span className="text-xs font-semibold">Enhance with AI</span>
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <span className="material-icons-round text-[14px]">info</span>
          AI will expand your bio to sound more professional.
        </p>
      </div>

      {/* Current Role */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Current Role
        </label>
        <input
          type="text"
          value={profile.currentRole}
          onChange={(e) =>
            setProfile({ ...profile, currentRole: e.target.value })
          }
          placeholder="e.g. Senior Frontend Engineer"
          className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-slate-700 dark:text-slate-200"
        />
      </div>

      {/* Company */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          Company
        </label>
        <input
          type="text"
          value={profile.company}
          onChange={(e) =>
            setProfile({ ...profile, company: e.target.value })
          }
          placeholder="e.g. Stripe, Google, YourStartup"
          className="w-full bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-slate-700 dark:text-slate-200"
        />
      </div>
    </div>
  );
}

function StepInterests({
  profile,
  setProfile,
}: {
  profile: ProfileData;
  setProfile: (p: ProfileData) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="mb-8 mt-2">
        <h1 className="text-2xl font-bold mb-2">Your Interests</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Help us match you with the right people.
        </p>
      </div>

      <TagInput
        label="Skills & Technologies"
        tags={profile.skills}
        onChange={(skills) => setProfile({ ...profile, skills })}
        placeholder="Add skills (e.g. React, Python)"
        suggestions={SKILL_SUGGESTIONS}
      />

      <TagInput
        label="Interests"
        tags={profile.interests}
        onChange={(interests) => setProfile({ ...profile, interests })}
        placeholder="Add interests (e.g. Fintech, AI)"
        suggestions={INTEREST_SUGGESTIONS}
      />

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
          Looking to Connect With
        </label>
        <div className="flex flex-wrap gap-2">
          {LOOKING_FOR_OPTIONS.map((option) => {
            const isSelected = profile.lookingFor.includes(option);
            return (
              <button
                key={option}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    setProfile({
                      ...profile,
                      lookingFor: profile.lookingFor.filter((l) => l !== option),
                    });
                  } else {
                    setProfile({
                      ...profile,
                      lookingFor: [...profile.lookingFor, option],
                    });
                  }
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                  isSelected
                    ? "bg-primary/20 border-primary/30 text-primary"
                    : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {isSelected ? "✓ " : "+ "}
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepPreview({ profile }: { profile: ProfileData }) {
  return (
    <div className="space-y-6">
      <div className="mb-8 mt-2">
        <h1 className="text-2xl font-bold mb-2">Preview Your Profile</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          This is how others will see you at the event.
        </p>
      </div>

      {/* Preview Card */}
      <div className="bg-white dark:bg-card-dark rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="material-icons-round text-primary text-2xl">
              person
            </span>
          </div>
          <div>
            <h3 className="text-lg font-bold">Your Name</h3>
            {profile.currentRole && (
              <p className="text-sm text-primary font-medium">
                {profile.currentRole}
              </p>
            )}
            {profile.company && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {profile.company}
              </p>
            )}
          </div>
        </div>

        {profile.aboutMe && (
          <div>
            <h4 className="text-sm font-semibold mb-1">About</h4>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {profile.aboutMe}
            </p>
          </div>
        )}

        {profile.skills.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.interests.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Interests</h4>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.lookingFor.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2">Looking for</h4>
            <div className="flex flex-wrap gap-2">
              {profile.lookingFor.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
