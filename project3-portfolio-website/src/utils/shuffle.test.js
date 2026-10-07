import { shuffle } from "./shuffle.js";

describe("shuffle", () => {
  it("returns the same items without changing the original array", () => {
    const original = ["a", "b", "c", "d", "e"];

    const result = shuffle(original);

    expect(original).toEqual(["a", "b", "c", "d", "e"]);
    expect([...result].sort()).toEqual(["a", "b", "c", "d", "e"]);
  });

  it("uses the random function it is given", () => {
    // A random() that always returns 0 swaps every item with the first one.
    expect(shuffle(["a", "b", "c", "d"], () => 0)).toEqual([
      "b",
      "c",
      "d",
      "a",
    ]);
  });

  it("handles empty and single-item arrays", () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(["a"])).toEqual(["a"]);
  });
});
