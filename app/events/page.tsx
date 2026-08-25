import type { Metadata } from "next";
import { Container, EmptyState, Section } from "@/components/ui";
import { api } from "@/lib/api";
import { EMPTY_STATES } from "@/lib/constants";
import { EventSearch } from "./_components/EventSearch";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Talks, workshops and webinars, with slides and recordings where they exist.",
  alternates: { canonical: "/events" },
};

export default async function EventsPage() {
  // Two queries rather than one filtered in the browser: upcoming sorts
  // soonest-first and completed sorts most-recent-first, which is two opposite
  // orders and cannot be one query.
  const [upcoming, completed] = await Promise.all([
    api.getEvents({ status: "upcoming", limit: 50 }),
    api.getEvents({ status: "completed", limit: 100 }),
  ]);

  const empty = upcoming.length === 0 && completed.length === 0;

  return (
    <Section>
      <Container>
        <div className="section-label">Events</div>
        <h1>Talks and workshops</h1>
        <p className="section-intro">
          Events I have delivered at meetups, conferences and online. Slides and
          recordings are linked where they exist.
        </p>

        {empty ? (
          <EmptyState {...EMPTY_STATES.events} />
        ) : (
          <EventSearch upcoming={upcoming} completed={completed} />
        )}
      </Container>
    </Section>
  );
}
