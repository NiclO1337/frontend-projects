/**
 * Turns text into something safe to put in a URL: lower case, with every run
 * of other characters replaced by one dash. "Next.js" becomes "next-js".
 * "#" and "+" are spelled out first, so "C#" becomes "c-sharp" and not just "c".
 * @param {string} text
 * @returns {string}
 */
export function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/#/g, "-sharp")
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
