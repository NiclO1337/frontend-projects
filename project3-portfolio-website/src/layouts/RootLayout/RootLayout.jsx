import { NavLink, Outlet } from "react-router";

// Temporary links so the routes can be tried out. Step 7 replaces this
// with the real sidebar navigation.
const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/resume", label: "Resume" },
  { to: "/projects", label: "Projects" },
  { to: "/contact", label: "Contact" },
];

/** Shared page frame. The matching child route is rendered where <Outlet /> is. */
export default function RootLayout() {
  return (
    <>
      <nav aria-label="Main">
        {links.map(({ to, label }) => (
          // `end` makes "/" active only on the home page, not on every page.
          <NavLink key={to} to={to} end={to === "/"}>
            {label}
          </NavLink>
        ))}
      </nav>
      <main id="main">
        <Outlet />
      </main>
    </>
  );
}
