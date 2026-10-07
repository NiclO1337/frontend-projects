import { render, screen, within } from "@testing-library/react";
import Footer from "./Footer.jsx";

describe("Footer", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("is a contentinfo landmark with the credit line and the current year", () => {
    // Fake only the clock, so the expected year doesn't depend on today's date.
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2030-06-01"));

    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("Designed & built by Niclas Hugdahl");
    expect(footer).toHaveTextContent("© 2030");
  });

  it("includes the social links (CSS hides them on desktop)", () => {
    render(<Footer />);

    expect(
      within(screen.getByRole("contentinfo")).getByRole("link", {
        name: /github/i,
      }),
    ).toBeInTheDocument();
  });
});
