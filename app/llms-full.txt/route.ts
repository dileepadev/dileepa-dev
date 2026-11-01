import { buildLlmsTxt, llmsResponse } from "@/lib/llms";

/**
 * The full llms.txt: every post, talk, project, video and community, with the
 * work history and education. Built in `lib/llms.ts` beside the short
 * `/llms.txt`. Rebuilt daily, like the pages it describes.
 */
export const revalidate = 86400;

export async function GET() {
  return llmsResponse(await buildLlmsTxt({ full: true }));
}
