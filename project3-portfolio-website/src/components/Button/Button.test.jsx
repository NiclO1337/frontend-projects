import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import Button from "./Button.jsx";

// Button can render a router <Link>, so it needs a router around it.
function renderButton(button) {
  const router = createMemoryRouter([{ path: "*", element: button }]);
  render(<RouterProvider router={router} />);
}

describe("Button", () => {
  it("renders a <button> that does not submit forms by default", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderButton(<Button onClick={onClick}>Save</Button>);

    const button = screen.getByRole("button", { name: "Save" });
    await user.click(button);

    expect(button).toHaveAttribute("type", "button");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("lets the caller change the button type", () => {
    renderButton(<Button type="submit">Send</Button>);

    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("renders an internal link for `to`", () => {
    renderButton(<Button to="/projects">View projects</Button>);

    const link = screen.getByRole("link", { name: "View projects" });
    expect(link).toHaveAttribute("href", "/projects");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens http(s) links in a new tab and says so", () => {
    renderButton(<Button href="https://example.com/demo">Live demo</Button>);

    const link = screen.getByRole("link", { name: /live demo/i });
    expect(link).toHaveAttribute("href", "https://example.com/demo");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveAccessibleName(/opens in a new tab/i);
  });

  it("keeps file links like a CV download in the same tab", () => {
    renderButton(
      <Button href="/cv/cv.pdf" download>
        Download CV
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Download CV" });
    expect(link).toHaveAttribute("href", "/cv/cv.pdf");
    expect(link).toHaveAttribute("download");
    expect(link).not.toHaveAttribute("target");
  });
});
