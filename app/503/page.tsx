import type { Metadata } from "next";
import { ApiOfflinePage } from "@/components/ui";
import { PAGES } from "@/lib/constants";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: PAGES.apiOffline.meta.title,
  description: PAGES.apiOffline.meta.description,
  path: "/503",
  noindex: true,
});

export default function Page() {
  return <ApiOfflinePage path="/503" />;
}
