import { act, renderHook } from "@testing-library/react";
import useLocalStorage from "./useLocalStorage.js";

describe("useLocalStorage", () => {
  it("uses the initial value when nothing is saved", () => {
    const { result } = renderHook(() => useLocalStorage("theme", "dark"));

    expect(result.current[0]).toBe("dark");
  });

  it("reads a saved value", () => {
    localStorage.setItem("theme", JSON.stringify("light"));

    const { result } = renderHook(() => useLocalStorage("theme", "dark"));

    expect(result.current[0]).toBe("light");
  });

  it("saves the value when it changes", () => {
    const { result } = renderHook(() => useLocalStorage("theme", "dark"));

    act(() => result.current[1]("light"));

    expect(result.current[0]).toBe("light");
    expect(localStorage.getItem("theme")).toBe('"light"');
  });

  it("falls back to the initial value when the saved text is not valid JSON", () => {
    localStorage.setItem("theme", "{not json");

    const { result } = renderHook(() => useLocalStorage("theme", "dark"));

    expect(result.current[0]).toBe("dark");
  });

  // Some browsers block storage (for example with all cookies blocked) and
  // throw when it is used. The value should still work for this visit.
  it("falls back to the initial value when reading storage is blocked", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("blocked", "SecurityError");
    });

    const { result } = renderHook(() => useLocalStorage("theme", "dark"));

    expect(result.current[0]).toBe("dark");
  });

  it("still changes the value when saving is not possible", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("full", "QuotaExceededError");
    });
    const { result } = renderHook(() => useLocalStorage("theme", "dark"));

    act(() => result.current[1]("light"));

    expect(result.current[0]).toBe("light");
  });
});
