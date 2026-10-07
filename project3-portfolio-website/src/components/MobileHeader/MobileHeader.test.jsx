import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import MobileHeader from "./MobileHeader.jsx";

// MobileHeader uses Link and NavLink, so it needs a router around it.
function renderMobileHeader() {
  const router = createMemoryRouter([{ path: "*", element: <MobileHeader /> }]);
  render(<RouterProvider router={router} />);
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
});
