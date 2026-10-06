import RootLayout from "./layouts/RootLayout/RootLayout.jsx";
import HomePage from "./pages/HomePage/HomePage.jsx";
import AboutPage from "./pages/AboutPage/AboutPage.jsx";
import ResumePage from "./pages/ResumePage/ResumePage.jsx";
import ProjectsPage from "./pages/ProjectsPage/ProjectsPage.jsx";
import ProjectDetailPage from "./pages/ProjectDetailPage/ProjectDetailPage.jsx";
import ContactPage from "./pages/ContactPage/ContactPage.jsx";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.jsx";
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";

// Route config as plain objects. It lives in its own file so the app
// (createBrowserRouter) and the tests (createMemoryRouter) share it.
export const routes = [
  {
    path: "/",
    element: <RootLayout />,
    // Shown if something crashes unexpectedly anywhere below.
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "resume", element: <ResumePage /> },
      { path: "projects", element: <ProjectsPage /> },
      { path: "projects/:slug", element: <ProjectDetailPage /> },
      { path: "contact", element: <ContactPage /> },
      // "*" matches any URL no other route matched.
      { path: "*", element: <NotFoundPage /> },
    ],
  },
];
