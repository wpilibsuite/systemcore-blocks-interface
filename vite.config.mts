/// <reference types="vitest" />
/// <reference types="@vitest/browser/matchers" />
import { defineConfig } from "vitest/config";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { playwright } from '@vitest/browser-playwright'
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/blocks/',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react(), viteStaticCopy({
    targets: [
      {
        src: 'oss-attribution/**/*',
        dest: "./",
      },
      {
        src: 'src/i18n/locales/**/*',
        dest: "./locales/",
      },
    ],
  }),
  ],
  server: {
    port: 3000,
  },
  define: {
    '__APP_VERSION__': JSON.stringify(process.env.npm_package_version || '0.0.0'),
    '__APP_NAME__': JSON.stringify(process.env.npm_package_name || 'BlocksA'),
  },
  test: {
    setupFiles: ['./tests/setupTests.ts'],
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      instances: [
        { browser: 'chromium' },
      ]
    },
  },
});
