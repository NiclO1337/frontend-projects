import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import { EffectsProvider } from "../../context/EffectsProvider.jsx";
import { ThemeProvider } from "../../context/ThemeProvider.jsx";
import MobileHeader from "./MobileHeader.jsx";

// MobileHeader uses Link and NavLink, so it needs a router around it, and the
// theme toggle in the menu needs the ThemeProvider.
function renderMobileHeader(url = "/") {
  const router = createMemoryRouter(
    [{ path: "*", element: <MobileHeader /> }],
    {
      initialEntries: [url],
    },
  );
  return {
    router,
    ...render(
      <ThemeProvider>
        <EffectsProvider>
          <RouterProvider router={router} />
        </EffectsProvider>
      </ThemeProvider>,
    ),
  };
}

const getMenuButton = () => screen.getByRole("button", { name: "Menu" });

describe("MobileHeader", () => {
  it("starts closed, with the logo linking home", () => {
    renderMobileHeader();

    expect(getMenuButton()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Niclas Hugdahl" }),
    ).toHaveAttribute("href", "/");
  });

  it("opens the menu with the button and moves focus to the first link", async () => {
    const user = userEvent.setup();
    renderMobileHeader();

    await user.click(getMenuButton());

    expect(getMenuButton()).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About" })).toHaveFocus();
  });

  it("closes with the button", async () => {
    const user = userEvent.setup();
    renderMobileHeader();

    await user.click(getMenuButton());
    await user.click(getMenuButton());

    expect(getMenuButton()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("closes on Escape and gives focus back to the button", async () => {
    const user = userEvent.setup();
    renderMobileHeader();

    await user.click(getMenuButton());
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(getMenuButton()).toHaveFocus();
  });

  it("closes when a menu link is clicked", async () => {
    const user = userEvent.setup();
    renderMobileHeader();

    await user.click(getMenuButton());
    await user.click(screen.getByRole("link", { name: "Projects" }));

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("closes when the link of the current page is clicked", async () => {
    const user = userEvent.setup();
    renderMobileHeader("/about");

    await user.click(getMenuButton());
    await user.click(screen.getByRole("link", { name: "About" }));

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("closes when the route changes without a click, like browser back", async () => {
    const user = userEvent.setup();
    const { router } = renderMobileHeader();

    await user.click(getMenuButton());
    await act(() => router.navigate("/about"));

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("closes when the empty space around the links is clicked", async () => {
    const user = userEvent.setup();
    renderMobileHeader();

    await user.click(getMenuButton());
    // The <nav> spans the full width, so clicking it hits no link.
    await user.click(screen.getByRole("navigation", { name: "Main" }));

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("stays open when the theme toggle in the menu is clicked", async () => {
    const user = userEvent.setup();
    renderMobileHeader();

    await user.click(getMenuButton());
    await user.click(screen.getByRole("button", { name: /dark mode/i }));

    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("data-theme", "light");
  });
});
