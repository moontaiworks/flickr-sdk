import { add, greet, multiply, sum, VERSION } from "../../src/index.js";
import {
  randomInt,
  randomNumberArray,
  testFixtures,
} from "../utils/test-helpers.js";

describe("Module Integration Tests", () => {
  describe("Package exports", () => {
    it("should export all functions", () => {
      expect(add).toBeDefined();
      expect(sum).toBeDefined();
      expect(multiply).toBeDefined();
      expect(greet).toBeDefined();
    });

    it("should export VERSION constant", () => {
      expect(VERSION).toBeDefined();
      expect(typeof VERSION).toBe("string");
    });
  });

  describe("Math operations integration", () => {
    it("should perform complex calculations using multiple functions", () => {
      const result1 = add(10, 5);
      const result2 = multiply(result1, 2);
      const result3 = sum(result2, 10, 5);
      expect(result3).toBe(45); // (10+5)*2 + 10 + 5 = 45
    });

    it("should handle chain operations", () => {
      const numbers = [1, 2, 3, 4, 5];
      const total = sum(...numbers);
      const doubled = multiply(total, 2);
      const withBonus = add(doubled, 10);
      expect(withBonus).toBe(40); // (1+2+3+4+5)*2 + 10 = 40
    });
  });

  describe("Integration with test utilities", () => {
    it("should work with random test data", () => {
      const num1 = randomInt(1, 100);
      const num2 = randomInt(1, 100);
      const result = add(num1, num2);
      expect(result).toBe(num1 + num2);
    });

    it("should work with random arrays", () => {
      const numbers = randomNumberArray(5, 1, 10);
      const result = sum(...numbers);
      const expected = numbers.reduce((acc, n) => acc + n, 0);
      expect(result).toBe(expected);
    });

    it("should work with test fixtures", () => {
      const result = sum(...testFixtures.numbers.positive);
      expect(result).toBe(15);
    });
  });

  describe("String operations integration", () => {
    it("should greet multiple names", () => {
      const greetings = testFixtures.names.map((name) => greet(name));
      expect(greetings).toHaveLength(4);
      expect(greetings[0]).toBe("Hello, Alice!");
      expect(greetings[1]).toBe("Hello, Bob!");
    });

    it("should combine math and string operations", () => {
      const total = sum(1, 2, 3);
      const greeting = greet(`User${total}`);
      expect(greeting).toBe("Hello, User6!");
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle large numbers", () => {
      const largeNum = 999999999;
      const result = add(largeNum, 1);
      expect(result).toBe(1000000000);
    });

    it("should handle very small decimals", () => {
      const result = add(0.0000001, 0.0000002);
      expect(result).toBeCloseTo(0.0000003, 7);
    });

    it("should handle empty operations gracefully", () => {
      expect(sum()).toBe(0);
      expect(greet("")).toBe("Hello, !");
    });
  });
});
