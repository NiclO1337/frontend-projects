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
});
