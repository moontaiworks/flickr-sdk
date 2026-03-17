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
    hookTimeout: 30000,
    include: ["src/**/*.spec.ts", "tests/**/*.test.ts"],
    retry: {
      count: 3,
      delay: 1500,
    },
    teardownTimeout: 30000,
    testTimeout: 30000,
    typecheck: {
      tsconfig: "./tests/tsconfig.json",
    },
  },
});
