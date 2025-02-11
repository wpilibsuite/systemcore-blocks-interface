/// <reference types="vitest" />
/// <reference types="@vitest/browser/matchers" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
   setupFiles: ['./tests/setupTests.ts'],

    browser: {
      provider: "playwright",
      enabled: true,
      instances: [{ browser: "chromium" }],
      headless: true,
    },
  },
});
