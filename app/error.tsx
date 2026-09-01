"use client";

import { useEffect } from "react";
import { ApiOfflinePage, Button, ErrorPage } from "@/components/ui";

/**
 * The root render boundary.
 *
 * Two outcomes, and neither screen is written here: a failed upstream fetch
 * renders the same `/503` page every degraded route renders, and everything
 * else renders the same `/500` page that lives at that address. Both were
 * hand-copied into this file before, which is how the 503 here lost the
 * gateway host row that the real one shows.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (error && error.digest !== "0x500_TELEMETRY_DEMO") {
      console.error(error);
    }
  }, [error]);

  const isApiOffline =
    error.name === "ApiConnectionError" ||
    error.digest === "API_CONNECTION_OFFLINE" ||
    error.digest?.includes("503") ||
    error.message?.includes("API connection offline") ||
    error.message?.includes("Failed to connect to API") ||
    error.message?.includes("fetch failed") ||
    error.message?.includes("ECONNREFUSED") ||
    error.message?.includes("ENOTFOUND") ||
    error.message?.includes("proxy_error");

  if (isApiOffline) {
    return (
      <ApiOfflinePage
        path="/503"
        action={<Button onClick={reset}>Retry uplink</Button>}
      />
    );
  }

  return <ErrorPage error={error} reset={reset} />;
}
