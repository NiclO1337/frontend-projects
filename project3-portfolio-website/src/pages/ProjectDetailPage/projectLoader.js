import { data } from "react-router";
import { getProjectBySlug } from "../../utils/projects.js";

/**
 * Route loader for /projects/:slug. React Router runs it before the page
 * renders, so the page always has a project to show. For an unknown slug it
 * throws a 404, and the route's errorElement (the not-found page) is shown
 * instead of the page.
 * It lives in its own file because a file that exports a component and
 * another function breaks Fast Refresh.
 * @param {{ params: { slug: string } }} args `params` holds the ":slug" part of the URL
 */
export function projectLoader({ params }) {
  const project = getProjectBySlug(params.slug);

  if (!project) {
    // `data()` makes a response-like error with a status the router understands.
    throw data("Project not found", { status: 404 });
  }

  return project;
}
