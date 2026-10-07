import { useEffect, useRef } from "react";
import { useLocation } from "react-router";

/**
 * After navigating to a new page, scroll to the top and move focus to the
 * page's <h1>. A normal page load resets focus, but React Router only swaps
 * the content, so without this the link you pressed would keep focus (and its
 * focus ring), and screen readers would not announce the new page.
 *
 * Call it once, in the layout that wraps every page.
 */
export default function useRouteFocus() {
  const { pathname } = useLocation();
  const previousPathname = useRef(pathname);

  // Effects run after the new page is on screen, so the new <h1> exists.
  // Only the pathname counts: changing the search params (the project filter)
  // stays on the same page, so it must not scroll or move focus.
  useEffect(() => {
    // Skip the first load, or focus would be taken from the skip link.
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    window.scrollTo(0, 0);
    const heading = document.querySelector("main h1");
    if (heading) {
      // tabindex="-1" lets code focus the heading, without adding it to the Tab order.
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);
}
