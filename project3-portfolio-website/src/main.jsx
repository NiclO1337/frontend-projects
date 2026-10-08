import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { EffectsProvider } from "./context/EffectsProvider.jsx";
import { ThemeProvider } from "./context/ThemeProvider.jsx";
import { routes } from "./routes.jsx";
import "./styles/tokens.css";
import "./styles/global.css";

// Create the router once, outside React, so it isn't rebuilt on re-renders.
const router = createBrowserRouter(routes);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <EffectsProvider>
        <RouterProvider router={router} />
      </EffectsProvider>
    </ThemeProvider>
  </StrictMode>,
);
