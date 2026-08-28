"use client";

import ErrorComponent from "@/app/error";

export default function Error500PreviewPage() {
  return (
    <ErrorComponent
      error={{
        name: "Error",
        message: "Sample SSR render pipeline fault for telemetry preview",
        digest: "0x500_TELEMETRY_DEMO",
      }}
      reset={() => {
        if (typeof window !== "undefined") {
          window.location.reload();
        }
      }}
    />
  );
}
