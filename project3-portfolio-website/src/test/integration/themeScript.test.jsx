import { readFileSync } from "node:fs";
import { join } from "node:path";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithRouter } from "../renderWithRouter.jsx";

// index.html has a small script that sets the saved theme before React loads,
// so the page doesn't flash dark first. It is plain code in the HTML file and
// reads the same localStorage entry that useLocalStorage writes. Nothing else
// ties the two together, so these tests check that they still agree.

// The inline script is the only <script> without attributes. (The one that
// loads the app has type="module".) The file is found from this test's own
// location: src/test/integration/ -> the project folder.
const html = readFileSync(
  join(import.meta.dirname, "../../../index.html"),
  "utf8",
);
const themeScript = html.match(/<script>([\s\S]*?)<\/script>/)[1];

const runThemeScript = () => new Function(themeScript)();
const getTheme = () => document.documentElement.dataset.theme;

describe("the theme script in index.html", () => {
  it.each(["light", "dark"])("applies a saved %s theme", (theme) => {
    localStorage.setItem("theme", JSON.stringify(theme));

    runThemeScript();

    expect(getTheme()).toBe(theme);
  });

  it.each([
    ["nothing is saved", null],
    ["the saved text is not JSON", "{not json"],
    ["the saved theme is not a known one", JSON.stringify("purple")],
  ])("leaves the page alone when %s", (_label, saved) => {
    if (saved !== null) localStorage.setItem("theme", saved);

    runThemeScript();

    expect(getTheme()).toBeUndefined();
  });

  it("does not crash when the browser blocks storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });

    expect(runThemeScript).not.toThrow();
    expect(getTheme()).toBeUndefined();
  });

  it("reads what the app saves when the visitor changes the theme", async () => {
    const user = userEvent.setup();
    const { unmount } = renderWithRouter(["/"]);
    await user.click(screen.getByRole("button", { name: "Dark mode" }));
    // Closing the tab: the page is gone, only localStorage is left.
    unmount();
    delete document.documentElement.dataset.theme;

    runThemeScript();

    expect(getTheme()).toBe("light");
  });
});
