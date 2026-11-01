import { timingSafeEqual } from "node:crypto";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

/**
 * On-demand revalidation (issue #31).
 *
 * Every page regenerates on a day-long window, which keeps the CPU bill inside
 * the Hobby allowance but means an edit in the admin takes up to a day to show,
 * and a page regenerated during an API outage would hold its fallback for the
 * same day. A POST here purges pages now:
 *
 *   curl -X POST https://dileepa.dev/api/revalidate \
 *     -H "Authorization: Bearer $REVALIDATE_SECRET" \
 *     -H "Content-Type: application/json" \
 *     -d '{"paths": ["/blog", "/blog/2026-09-01-some-post"]}'
 *
 * With no body, or no `paths`, it purges every page. The caller is meant to be
 * the API after a write, or the admin after a save; until one is wired, it is
 * a command to run after publishing.
 *
 * `REVALIDATE_SECRET` is a server-only variable. Without it the endpoint is
 * switched off rather than open.
 */

const MAX_PATHS = 50;

function authorised(request: Request, secret: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const given = Buffer.from(token);
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

async function requestedPaths(request: Request): Promise<string[] | null> {
  const text = await request.text();
  if (!text.trim()) return [];
  try {
    const body: unknown = JSON.parse(text);
    const paths = (body as { paths?: unknown }).paths;
    if (paths === undefined) return [];
    if (!Array.isArray(paths) || paths.length > MAX_PATHS) return null;
    if (
      !paths.every((p) => typeof p === "string" && /^\/[^\s?#]{0,200}$/.test(p))
    ) {
      return null;
    }
    return paths as string[];
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "On-demand revalidation is not configured." },
      { status: 503 },
    );
  }
  if (!authorised(request, secret)) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  const paths = await requestedPaths(request);
  if (paths === null) {
    return NextResponse.json(
      {
        error: `Send {"paths": [...]} with up to ${MAX_PATHS} site paths, each starting with "/".`,
      },
      { status: 400 },
    );
  }

  if (paths.length === 0) {
    revalidatePath("/", "layout");
  } else {
    for (const path of paths) revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: paths.length === 0 ? ["/ (every page)"] : paths,
    at: new Date().toISOString(),
  });
}
