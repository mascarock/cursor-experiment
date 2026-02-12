"use client";

import { useState, useCallback, useMemo } from "react";
import { RecommendationCard } from "@/components/recommendation-card";
import { QuickFilters } from "@/components/quick-filters";
import { SearchBar } from "@/components/search-bar";
import { sendConnectionRequest } from "./actions";

interface RecommendationData {
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
  // For client-side filtering
  skills: string[];
}

interface DiscoverClientProps {
  eventSlug: string;
  eventId: string;
  recommendations: RecommendationData[];
}

export function DiscoverClient({
  eventSlug,
  eventId,
  recommendations,
}: DiscoverClientProps) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionStatuses, setConnectionStatuses] = useState<
    Record<string, "none" | "pending" | "accepted">
  >(() => {
    const map: Record<string, "none" | "pending" | "accepted"> = {};
    for (const r of recommendations) {
      map[r.userId] = r.connectionStatus;
    }
    return map;
  });

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((filter: string) => {
    setActiveFilter(filter);
  }, []);

  // Client-side filtering for instant feedback
  const filtered = useMemo(() => {
    let results = recommendations;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.currentRole?.toLowerCase().includes(q) ||
          r.company?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (activeFilter !== "all") {
      results = results.filter((r) => {
        const role = r.currentRole?.toLowerCase() || "";
        const skills = r.skills.map((s) => s.toLowerCase());

        if (activeFilter === "developers") {
          return (
            role.includes("engineer") ||
            role.includes("developer") ||
            role.includes("dev") ||
            role.includes("cto") ||
            skills.some((s) =>
              ["react", "typescript", "python", "javascript", "node", "go", "rust"].includes(s)
            )
          );
        }
        if (activeFilter === "designers") {
          return (
            role.includes("design") ||
            role.includes("ux") ||
            role.includes("ui") ||
            skills.some((s) => ["figma", "design", "ux", "ui", "prototyping"].includes(s))
          );
        }
        if (activeFilter === "investors") {
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

    return results;
  }, [recommendations, searchQuery, activeFilter]);

  const handleConnect = useCallback(
    async (receiverUserId: string) => {
      const result = await sendConnectionRequest(eventId, receiverUserId);
      if (result.success) {
        setConnectionStatuses((prev) => ({
          ...prev,
          [receiverUserId]: "pending",
        }));
      }
    },
    [eventId]
  );

  return (
    <>
      {/* Search */}
      <SearchBar onSearch={handleSearch} />

      {/* Quick Filters */}
      <section className="mt-6">
        <QuickFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </section>

      {/* Recommended Section */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Recommended for You</h2>
          <span className="text-xs font-semibold text-primary">
            {filtered.length} match{filtered.length !== 1 ? "es" : ""}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-icons text-4xl text-slate-300 dark:text-slate-600 mb-3 block">
              person_search
            </span>
            <p className="text-sm text-slate-400 dark:text-slate-500">
              {searchQuery
                ? "No matches found for your search"
                : "No recommendations yet. More attendees will appear soon!"}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((r) => (
              <RecommendationCard
                key={r.userId}
                eventSlug={eventSlug}
                userId={r.userId}
                name={r.name}
                image={r.image}
                currentRole={r.currentRole}
                company={r.company}
                matchScore={r.matchScore}
                matchType={r.matchType}
                matchExplanation={r.matchExplanation}
                matchIcon={r.matchIcon}
                sharedTags={r.sharedTags}
                connectionStatus={connectionStatuses[r.userId] ?? r.connectionStatus}
                onConnect={() => handleConnect(r.userId)}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
