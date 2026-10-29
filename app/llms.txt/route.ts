import { buildLlmsTxt, llmsResponse } from "@/lib/llms";

/**
 * The short llms.txt: the newest posts and talks, every project and the index
 * pages. The everything version is `/llms-full.txt`; both are built in
 * `lib/llms.ts`. Rebuilt daily, like the pages they describe.
 */
export const revalidate = 86400;

export async function GET() {
  return llmsResponse(await buildLlmsTxt({ full: false }));
}
