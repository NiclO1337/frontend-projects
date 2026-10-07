import { render, screen } from "@testing-library/react";
import { profile } from "../../data/profile.js";
import SocialLinks from "./SocialLinks.jsx";

describe("SocialLinks", () => {
  it("renders a link for every profile in the data", () => {
    render(<SocialLinks />);

    expect(screen.getAllByRole("link")).toHaveLength(profile.social.length);
    for (const { name, url } of profile.social) {
      expect(
        screen.getByRole("link", { name: new RegExp(name, "i") }),
      ).toHaveAttribute("href", url);
    }
  });

  it("opens in a new tab safely and says so in the accessible name", () => {
    render(<SocialLinks />);

    const github = screen.getByRole("link", { name: /github/i });

    expect(github).toHaveAccessibleName(/opens in a new tab/i);
    expect(github).toHaveAttribute("target", "_blank");
    expect(github).toHaveAttribute("rel", "noopener noreferrer");
  });
});
