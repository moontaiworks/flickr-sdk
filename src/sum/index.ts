/**
 * A simple utility function that calculates the sum of multiple numbers
 * @param numbers - The numbers to sum
 * @returns The sum of the numbers
 */
export function sum(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}
