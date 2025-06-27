/// <reference types="vitest" />
/// <reference types="@vitest/browser/matchers" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths(), viteStaticCopy({
    targets: [
      {
        src: path.resolve(__dirname, './oss-attribution') + '/**/*',
        dest: "./public",
      },
    ],
  }),
  ],
  server: {
    host: true,
    port: 3000,
  },
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '0.0.0'),
    '__APP_NAME__': JSON.stringify(process.env.npm_package_name || 'BlocksA'),
  },
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
