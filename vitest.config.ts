import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
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
    retry: 3,
    testTimeout: 30000,
    typecheck: {
      tsconfig: "./tests/tsconfig.json",
    },
  },
});
