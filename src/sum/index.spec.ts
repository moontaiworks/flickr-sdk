import { sum } from "./index.js";

describe("sum", () => {
  it("should sum multiple positive numbers", () => {
    expect(sum(1, 2, 3, 4, 5)).toBe(15);
  });

  it("should sum negative numbers", () => {
    expect(sum(-1, -2, -3)).toBe(-6);
  });

  it("should sum mixed positive and negative numbers", () => {
    expect(sum(10, -5, 3, -2)).toBe(6);
  });

  it("should handle single number", () => {
    expect(sum(42)).toBe(42);
  });

  it("should return 0 for no arguments", () => {
    expect(sum()).toBe(0);
  });

  it("should handle zeros", () => {
    expect(sum(0, 0, 0)).toBe(0);
    expect(sum(1, 0, 2)).toBe(3);
  });

  it("should handle decimal numbers", () => {
    expect(sum(1.5, 2.5, 3.0)).toBe(7);
    expect(sum(0.1, 0.2, 0.3)).toBeCloseTo(0.6);
  });
});
