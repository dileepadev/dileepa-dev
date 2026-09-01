/**
 * YouTube integration utilities.
 *
 * Retrieves video duration for YouTube videos either via the YouTube Data API v3
 * (if `YOUTUBE_API_KEY` is provided) or by parsing the public metadata from the watch page.
 * Durations are cached via Next.js fetch cache.
 */

/**
 * Extracts an 11-character YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeId(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

/**
 * Parses an ISO 8601 duration string (e.g., "PT11M18S", "PT1H9M49S", "PT45S")
 * into total seconds.
 */
export function parseIsoDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

import https from "node:https";

const durationCache = new Map<string, number>();

function fetchPublicYouTubeDuration(id: string): Promise<number | null> {
  return new Promise((resolve) => {
    function get(url: string, redirectCount = 0) {
      if (redirectCount > 3) {
        resolve(null);
        return;
      }

      const req = https.get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "text/html",
          },
        },
        (res) => {
          if (
            res.statusCode &&
            res.statusCode >= 300 &&
            res.statusCode < 400 &&
            res.headers.location
          ) {
            get(res.headers.location, redirectCount + 1);
            return;
          }

          if (res.statusCode !== 200) {
            res.resume();
            resolve(null);
            return;
          }

          let buffer = "";
          let resolved = false;

          res.on("data", (chunk: Buffer) => {
            if (resolved) return;
            buffer += chunk.toString("utf8");
            const match = buffer.match(
              /itemprop="duration"\s+content="([^"]+)"/,
            );
            if (match?.[1]) {
              resolved = true;
              const seconds = parseIsoDuration(match[1]);
              res.destroy();
              resolve(seconds);
            }
            if (buffer.length > 50000) {
              buffer = buffer.slice(-2000);
            }
          });

          res.on("end", () => {
            if (!resolved) resolve(null);
          });

          res.on("error", () => {
            if (!resolved) resolve(null);
          });
        },
      );

      req.on("error", () => resolve(null));
      req.setTimeout(8000, () => {
        req.destroy();
        resolve(null);
      });
    }

    get(`https://www.youtube.com/watch?v=${id}`);
  });
}

/**
 * Fetches the duration of a YouTube video in seconds.
 *
 * Fails soft to null if the video is private, deleted, or if the request fails.
 */
export async function getYouTubeDuration(
  urlOrId: string,
): Promise<number | null> {
  const id = extractYouTubeId(urlOrId);
  if (!id) return null;

  if (durationCache.has(id)) {
    return durationCache.get(id)!;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey) {
    try {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${id}&key=${apiKey}`,
        { next: { revalidate: 86400 } },
      );
      if (res.ok) {
        const data = await res.json();
        const iso = data.items?.[0]?.contentDetails?.duration;
        if (iso) {
          const seconds = parseIsoDuration(iso);
          durationCache.set(id, seconds);
          return seconds;
        }
      }
    } catch {
      // Fall through to public page parsing
    }
  }

  const seconds = await fetchPublicYouTubeDuration(id);
  if (seconds !== null) {
    durationCache.set(id, seconds);
  }
  return seconds;
}
