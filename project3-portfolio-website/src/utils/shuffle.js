/**
 * Returns a new array with the same items in random order (Fisher-Yates:
 * walk from the end and swap each item with a random one at or before it,
 * which gives every order the same chance). The original is not changed.
 * @param {Array} items
 * @param {() => number} [random] returns a number from 0 up to (not including) 1
 */
export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
