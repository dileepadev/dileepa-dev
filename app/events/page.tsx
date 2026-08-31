import type { Metadata } from "next";
import {
  ApiOfflinePage,
  Container,
  EmptyState,
  PagePath,
  Section,
} from "@/components/ui";
import { api, checkApiHealth } from "@/lib/api";
import { EMPTY_STATES, PAGES } from "@/lib/constants";
import { EventSearch } from "./_components/EventSearch";

export const metadata: Metadata = {
  title: PAGES.events.meta.title,
  description: PAGES.events.meta.description,
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

  const total = upcoming.length + completed.length;
  if (total === 0) {
    const health = await checkApiHealth();
    if (!health.ok) {
      return <ApiOfflinePage path="/events" />;
    }
  }

  const empty = total === 0;

  return (
    <Section>
      <Container>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="mb-2">
              <PagePath path="/events" />
            </div>
            <div className="section-label">{PAGES.events.label}</div>
            <h1>{PAGES.events.title}</h1>
          </div>
          {total > 0 && (
            <div className="inline-flex items-center gap-1.5 font-mono text-small text-fg-muted border border-border-strong rounded-sm px-2.5 py-1 bg-bg-surface shrink-0 mt-1 transition-colors duration-150 hover:border-brand hover:bg-surface-hover hover:text-fg cursor-default">
              <span className="font-medium text-fg">{total}</span>
              <span>{total === 1 ? "Event" : "Events"}</span>
            </div>
          )}
        </div>

        <p className="section-intro">{PAGES.events.intro}</p>

        {empty ? (
          <EmptyState {...EMPTY_STATES.events} />
        ) : (
          <EventSearch upcoming={upcoming} completed={completed} />
        )}
      </Container>
    </Section>
  );
}
