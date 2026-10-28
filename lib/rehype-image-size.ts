/**
 * Gives Cloudinary images in a post their intrinsic width and height.
 *
 * A Markdown image carries no size, so the browser lays it out at zero height
 * and grows it when it loads. Every image that arrives pushes the text below
 * it down - mid-sentence while reading, and past the target when the contents
 * jump to a heading. With `width` and `height` on the tag, the browser reserves
 * the right box up front (CSS keeps it fluid: `w-full h-auto`).
 *
 * Every image in the posts is on Cloudinary, which answers `fl_getinfo` with
 * the dimensions as JSON - one small request per image, at build time, cached
 * with the page. Anything else, or a failed lookup, is left as it was.
 */

const CLOUDINARY_UPLOAD =
  /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//;

interface Element {
  type: "element";
  tagName: string;
  properties?: Record<string, unknown>;
  children?: Node[];
}

type Node = Element | { type: string; children?: Node[] };

function collectImages(node: Node, found: Element[]) {
  if (node.type === "element" && (node as Element).tagName === "img") {
    found.push(node as Element);
  }
  for (const child of node.children ?? []) collectImages(child, found);
}

async function cloudinarySize(
  src: string,
): Promise<{ width: number; height: number } | null> {
  const infoUrl = src.replace("/image/upload/", "/image/upload/fl_getinfo/");
  try {
    const response = await fetch(infoUrl, {
      cache: "force-cache",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return null;
    const info = (await response.json()) as {
      output?: { width?: number; height?: number };
      input?: { width?: number; height?: number };
    };
    const size = info.output ?? info.input;
    return size?.width && size?.height
      ? { width: size.width, height: size.height }
      : null;
  } catch {
    return null;
  }
}

export default function rehypeImageSize() {
  return async (tree: Node) => {
    const images: Element[] = [];
    collectImages(tree, images);

    await Promise.all(
      images.map(async (image) => {
        const properties = (image.properties ??= {});
        const src = properties.src;
        if (typeof src !== "string" || !CLOUDINARY_UPLOAD.test(src)) return;
        if (properties.width && properties.height) return;
        const size = await cloudinarySize(src);
        if (size) {
          properties.width = size.width;
          properties.height = size.height;
        }
      }),
    );
  };
}
