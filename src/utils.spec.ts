import { greet, multiply } from "./utils.js";

describe("multiply", () => {
  it("should multiply two positive numbers", () => {
    expect(multiply(3, 4)).toBe(12);
  });

  it("should multiply negative numbers", () => {
    expect(multiply(-2, -3)).toBe(6);
  });

  it("should multiply positive and negative numbers", () => {
    expect(multiply(5, -2)).toBe(-10);
  });

  it("should handle zero", () => {
    expect(multiply(0, 5)).toBe(0);
    expect(multiply(5, 0)).toBe(0);
    expect(multiply(0, 0)).toBe(0);
  });

  it("should handle decimal numbers", () => {
    expect(multiply(2.5, 4)).toBe(10);
    expect(multiply(0.5, 0.2)).toBeCloseTo(0.1);
  });
});

describe("greet", () => {
  it("should greet with a name", () => {
    expect(greet("Alice")).toBe("Hello, Alice!");
  });

  it("should handle empty string", () => {
    expect(greet("")).toBe("Hello, !");
  });

  it("should handle special characters", () => {
    expect(greet("O'Brien")).toBe("Hello, O'Brien!");
  });

  it("should handle numbers in name", () => {
    expect(greet("User123")).toBe("Hello, User123!");
  });
});
