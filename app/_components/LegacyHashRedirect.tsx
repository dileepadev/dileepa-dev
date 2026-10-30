"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** The homepage sections that became pages, and where each one went. */
const MOVED: Record<string, string> = {
  "#work": "/work",
  "#education": "/education",
  "#community": "/communities",
};

/**
 * Keeps the old homepage section links working (v2.1.0 draft).
 *
 * Work, Education and Community were sections of the homepage, linked as
 * `/#work` and so on - from the nav, the footer, and anywhere those links were
 * shared. A hash never reaches the server, so no redirect rule can catch one;
 * this does it on arrival, replacing the history entry so Back does not land
 * on the hash again. Renders nothing.
 */
export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const target = MOVED[window.location.hash];
    if (target) router.replace(target);
  }, [router]);

  return null;
}
