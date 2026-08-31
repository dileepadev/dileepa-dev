import type { Metadata } from "next";
import { ApiOfflinePage } from "@/components/ui";

export const metadata: Metadata = {
  title: "API service unavailable (503)",
  description:
    "Upstream API connection status and fallback diagnostics on dileepa.dev.",
};

export default function Page() {
  return <ApiOfflinePage path="/503" />;
}
