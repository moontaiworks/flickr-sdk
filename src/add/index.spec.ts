import { add } from "./index.js";

describe("add", () => {
  it("should add two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("should add negative numbers", () => {
    expect(add(-2, -3)).toBe(-5);
  });

  it("should add positive and negative numbers", () => {
    expect(add(5, -3)).toBe(2);
  });

  it("should handle zero", () => {
    expect(add(0, 5)).toBe(5);
    expect(add(5, 0)).toBe(5);
    expect(add(0, 0)).toBe(0);
  });

  it("should handle decimal numbers", () => {
    expect(add(1.5, 2.5)).toBe(4);
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
});
