import { createHash } from "node:crypto";
import { compile, run } from "@mdx-js/mdx";
import type { MDXComponents } from "mdx/types";
import { unstable_cache } from "next/cache";
import * as runtime from "react/jsx-runtime";
import { markdownPlugins } from "./mdx";

/**
 * A post body, compiled once per body rather than once per render (issue #31).
 *
 * Compiling is the expensive half of a post page: remark, rehype, the image
 * size lookups and, above all, Shiki highlighting every fence. The post body
 * comes from the pinned content ref, so between deploys it does not change -
 * yet the page regenerates on its daily window and `MDXRemote` compiled it
 * from scratch each time. The compiled function body is cached in Next's data
 * cache, keyed by a hash of the source, so a regeneration only evaluates it.
 * An edited post hashes differently and compiles once.
 */
const compileBody = unstable_cache(
  async (_hash: string, source: string) =>
    String(
      await compile(source, {
        outputFormat: "function-body",
        development: false,
        ...markdownPlugins,
      }),
    ),
  ["post-body-v1"],
  { revalidate: false },
);

export async function PostBody({
  source,
  components,
}: {
  source: string;
  components: MDXComponents;
}) {
  const hash = createHash("sha256").update(source).digest("hex");
  const code = await compileBody(hash, source);
  const { default: Content } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });
  return <Content components={components} />;
}
