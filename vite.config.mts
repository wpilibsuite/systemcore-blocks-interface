/// <reference types="vitest" />
/// <reference types="@vitest/browser/matchers" />
import { execSync } from "child_process";
import { writeFileSync } from "fs";
import { defineConfig, Plugin } from "vitest/config";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { playwright } from '@vitest/browser-playwright'
import react from "@vitejs/plugin-react";
import packageJson from "./package.json";

function licenseCheckerPlugin(): Plugin {
  return {
    name: "license-checker",
    buildStart() {
      execSync(
        "license-checker-rseidelsohn --json --customPath oss-attribution/customFormat.json > oss-attribution/licenseInfos.json",
      );
    },
  };
}

function dependenciesJsonPlugin(): Plugin {
  return {
    name: "dependencies-json",
    buildStart() {
      writeFileSync(
        "oss-attribution/dependencies.json",
        JSON.stringify(packageJson.dependencies, null, 2),
      );
    },
  };
}

export default defineConfig({
  base: '/blocks/',
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [react(), licenseCheckerPlugin(), dependenciesJsonPlugin(), viteStaticCopy({
    targets: [
      {
        src: 'oss-attribution/*',
        dest: "./",
        rename: { stripBase: true },
      },
      {
        src: 'frontend/i18n/locales/*',
        dest: "./locales/",
        rename: { stripBase: true },
      },
      {
        src: 'frontend/public/*',
        dest: "./",
        rename: { stripBase: true },
      }
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
