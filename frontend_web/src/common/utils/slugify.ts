/**
 * Converts a title into a URL-safe slug.
 * e.g. slugify("My First Project!") -> "my-first-project"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word characters
    .replace(/[\s_]+/g, "-") // collapse whitespace/underscores into a single dash
    .replace(/-+/g, "-") // collapse multiple dashes
    .replace(/^-+|-+$/g, ""); // trim leading/trailing dashes
}