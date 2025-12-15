import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      exclude: [
        "src/**/*.spec.ts",
        "src/**/*.test.ts",
        "src/index.ts", // Re-export file
      ],
      include: ["src/**/*.ts"],
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
    },
    environment: "node",
    globals: true,
    include: ["src/**/*.spec.ts", "tests/**/*.test.ts"],
    typecheck: {
      tsconfig: "./tests/tsconfig.json",
    },
  },
});
