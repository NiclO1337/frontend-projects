import { projects } from "../data/projects.js";
import { toSlug } from "./toSlug.js";

// Pure functions: the same input always gives the same output, and they change
// nothing. That makes them easy to test. The list defaults to the real data,
// and a test can pass its own small list instead.

/**
 * Finds one project by its URL slug.
 * @param {string} slug
 * @returns {object | undefined} the project, or undefined for an unknown slug
 */
export function getProjectBySlug(slug, list = projects) {
  return list.find((project) => project.slug === slug);
}

/**
 * Every technology that can be filtered on (the `filters` of the projects),
 * once each, most used first. Ties are sorted alphabetically, so the order
 * never changes between renders.
 * @param {object[]} list
 * @returns {string[]}
 */
export function getTechList(list) {
  const counts = new Map();
  for (const project of list) {
    for (const name of project.filters) {
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
  }

  return [...counts.keys()].sort(
    (a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b),
  );
}

// Where the live demos are hosted, recognised by the end of the hostname.
const HOSTS = [
  { domain: "vercel.app", name: "Vercel" },
  { domain: "github.io", name: "GitHub Pages" },
  { domain: "herokuapp.com", name: "Heroku" },
];

/**
 * The hosting service of a live demo, worked out from its URL, so the data
 * doesn't need a second field that could disagree with `liveUrl`.
 * @param {string} [liveUrl]
 * @returns {string | undefined} e.g. "Vercel", or undefined when there is no
 *   URL or the host isn't one of the known services
 */
export function getHostName(liveUrl) {
  if (!liveUrl) return undefined;
  const { hostname } = new URL(liveUrl);
  return HOSTS.find(
    ({ domain }) => hostname === domain || hostname.endsWith(`.${domain}`),
  )?.name;
}

/**
 * The projects that have a technology among their `filters`. Without a
 * technology (the "All" chip) every project is returned. A slug nobody uses
 * gives an empty list.
 * @param {object[]} list
 * @param {string | null} [techSlug] a slug like "next-js", as used in the URL
 * @returns {object[]}
 */
export function filterProjectsByTech(list, techSlug) {
  if (!techSlug) return list;
  return list.filter((project) =>
    project.filters.some((name) => toSlug(name) === techSlug),
  );
}

/**
 * The project before and after this one in the list. It wraps around: the
 * project after the last one is the first, and the other way round.
 * @param {string} slug
 * @returns {{ previous: object | null, next: object | null }} both null for an unknown slug
 */
export function getAdjacentProjects(slug, list = projects) {
  const index = list.findIndex((project) => project.slug === slug);
  if (index === -1) return { previous: null, next: null };

  return {
    previous: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  };
}
