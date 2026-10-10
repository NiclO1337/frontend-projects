import { isRouteErrorResponse, useRouteError } from "react-router";
import NotFoundPage from "../NotFoundPage/NotFoundPage.jsx";

/**
 * The errorElement of the /projects/:slug route. A route's errorElement is
 * shown for every error in that route: the loader's 404 for an unknown slug,
 * but also a crash while the page renders. Only the first one means "this
 * page doesn't exist", so only that one gets the not-found page. Anything
 * else is thrown again, and the error handling of the route above (the root
 * ErrorPage, "Something went wrong") takes over.
 */
export default function ProjectDetailError() {
  // The error that was thrown, in the loader or while rendering.
  const error = useRouteError();

  // isRouteErrorResponse is true for what projectLoader throws with data(),
  // and its `status` is the number we gave it.
  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  throw error;
}
