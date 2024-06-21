/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  test: {
    include: ["**/*.test.{ts,tsx}"],
    setupFiles: "./vitest.setup.ts",
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "istanbul",
      reporter: ["html"],
    },
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
  },
});
