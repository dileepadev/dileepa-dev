import { type ClassValue, clsx } from "clsx";

/** Merges class names. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

/**
 * Serialises a JSON-LD object for embedding in a `<script>` tag.
 *
 * `JSON.stringify` escapes quotes and backslashes but leaves `<` alone, so a
 * value containing `</script>` closes the tag early and the rest of the string
 * is parsed as HTML. Rewriting `<` to `<` is the whole fix: a JSON parser
 * reads the escape as the same character, and the HTML tokeniser never sees a
 * `<` to act on.
 *
 * The fields that reach here — post titles, event summaries, speaker names —
 * are written through the admin or the blog sync today, so this is not closing
 * an open hole. It is here so that the day one of them is sourced from
 * somewhere less trusted, the answer is already correct rather than newly
 * wrong.
 *
 * U+2028 and U+2029 get the same treatment for a different reason: they are
 * legal inside a JSON string but are line terminators in the script grammar.
 * Both are written here as escape sequences rather than literal characters,
 * because a literal one cannot appear inside a regular-expression literal — a
 * regex literal may not span lines, and these two count as a line break.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}
