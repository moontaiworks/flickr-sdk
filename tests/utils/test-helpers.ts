/**
 * Test utility functions for both unit and e2e tests
 */

/**
 * Generates a random number within a range
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns A random number between min and max
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates an array of random numbers
 * @param count - Number of elements to generate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns An array of random numbers
 */
export function randomNumberArray(
  count: number,
  min: number,
  max: number,
): number[] {
  return Array.from({ length: count }, () => randomInt(min, max));
}

/**
 * Creates a test fixture with commonly used test data
 */
export const testFixtures = {
  names: ["Alice", "Bob", "Charlie", "David"],
  numbers: {
    decimals: [1.5, 2.5, 3.5],
    mixed: [1, -2, 3, -4, 5],
    negative: [-1, -2, -3, -4, -5],
    positive: [1, 2, 3, 4, 5],
    zeros: [0, 0, 0],
  },
};
