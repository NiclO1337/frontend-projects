import { act, renderHook } from "@testing-library/react";
import { mockMatchMedia } from "../test/mockMatchMedia.js";
import useMediaQuery from "./useMediaQuery.js";

const QUERY = "(prefers-reduced-motion: reduce)";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useMediaQuery", () => {
  it("is false when the query does not match", () => {
    mockMatchMedia();

    const { result } = renderHook(() => useMediaQuery(QUERY));

    expect(result.current).toBe(false);
  });

  it("is true when the query matches", () => {
    mockMatchMedia({ [QUERY]: true });

    const { result } = renderHook(() => useMediaQuery(QUERY));

    expect(result.current).toBe(true);
  });

  it("updates when the visitor changes the setting", () => {
    const media = mockMatchMedia();
    const { result } = renderHook(() => useMediaQuery(QUERY));

    act(() => media.set(QUERY, true));
    expect(result.current).toBe(true);

    act(() => media.set(QUERY, false));
    expect(result.current).toBe(false);
  });

  it("only reacts to its own query", () => {
    const media = mockMatchMedia();
    const { result } = renderHook(() => useMediaQuery(QUERY));

    act(() => media.set("(hover: hover)", true));

    expect(result.current).toBe(false);
  });
});
