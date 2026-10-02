// Copyright 2026 Porpoiseful LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Makes an SVG image of the blocks in a JSON file.
//
// Usage: node scripts/blocks_to_svg/blocks_to_svg.mjs [options] <blocks.json> [output_dir]
//    or: npm run blocks-to-svg -- [options] <blocks.json> [output_dir]
//
// The JSON file can be a module file (like Robot.robot.json), a Blockly workspace serialization,
// a single block, or a list of blocks. Unless -o is given, the SVG has the same name as the JSON
// file, with .svg in place of .json, and is written to output_dir, or the current directory if it
// isn't given.
//
// Options:
//   -o, --output <file>   The path and name of the SVG file. Can't be used with output_dir.
//   --theme <name>        The theme, like light or dark. Defaults to light.
//   --renderer <name>     The Blockly renderer. Defaults to first_blocks_style.
//   --module-type <type>  robot, mechanism, or opmode, for JSON that isn't a module file.
//                         Defaults to the type in the file name, like Foo.robot.json, or opmode.
//
// The blocks are rendered by the frontend code, bundled with vite, in headless Chromium with
// Playwright, so npm install (and npx playwright install chromium) has to have been run.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { build } from 'vite';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_DIR = path.resolve(SCRIPT_DIR, '..', '..');
const MODULE_TYPES = ['robot', 'mechanism', 'opmode'];

// npm run changes to the repo directory, but sets INIT_CWD to the directory it was run from.
const CALLER_DIR = process.env.INIT_CWD ?? process.cwd();

const USAGE = 'Usage: node scripts/blocks_to_svg/blocks_to_svg.mjs ' +
    '[-o <file>] [--theme <name>] [--renderer <name>] [--module-type <type>] ' +
    '<blocks.json> [output_dir]';

function parseArgs(args) {
  const options = { theme: 'light', renderer: 'first_blocks_style', moduleType: null };
  let output = null;
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      console.log(USAGE);
      process.exit(0);
    }
    const match = arg.match(/^(-o|--output|--theme|--renderer|--module-type)(?:=(.*))?$/);
    if (match) {
      const value = match[2] ?? args[++i];
      if (value === undefined) {
        throw new Error(`${match[1]} needs a value\n${USAGE}`);
      }
      if (match[1] === '-o' || match[1] === '--output') {
        output = value;
      } else {
        options[match[1] === '--module-type' ? 'moduleType' : match[1].slice(2)] = value;
      }
    } else if (arg.startsWith('-')) {
      throw new Error(`Unknown option ${arg}\n${USAGE}`);
    } else {
      positional.push(arg);
    }
  }
  if (positional.length < 1 || positional.length > 2) {
    throw new Error(USAGE);
  }
  if (output !== null && positional.length > 1) {
    throw new Error(`-o and output_dir can't both be given\n${USAGE}`);
  }
  const inputFile = path.resolve(CALLER_DIR, positional[0]);
  const outputFile = output !== null ?
      path.resolve(CALLER_DIR, output) :
      path.resolve(CALLER_DIR, positional[1] ?? '.',
          path.basename(inputFile).replace(/(\.json)?$/i, '.svg'));
  if (!options.moduleType) {
    const suffix = path.basename(inputFile).match(/\.(\w+)\.json$/)?.[1];
    options.moduleType = MODULE_TYPES.includes(suffix) ? suffix : 'opmode';
  } else if (!MODULE_TYPES.includes(options.moduleType)) {
    throw new Error(`--module-type must be one of ${MODULE_TYPES.join(', ')}`);
  }
  return { inputFile, outputFile, options };
}

/**
 * Bundles render.ts and everything it uses, including Blockly, into a single script that can be
 * added to a page, and returns its path.
 */
async function bundleRenderer(outDir) {
  await build({
    configFile: false,
    root: REPO_DIR,
    logLevel: 'warn',
    define: {
      __APP_VERSION__: JSON.stringify(JSON.parse(fs.readFileSync(path.join(REPO_DIR, 'package.json'), 'utf-8')).version),
      __APP_NAME__: JSON.stringify('blocks_to_svg'),
    },
    build: {
      lib: {
        entry: path.join(SCRIPT_DIR, 'render.ts'),
        formats: ['iife'],
        name: 'BlocksToSvg',
        fileName: () => 'render.js',
      },
      outDir,
      emptyOutDir: true,
      minify: false,
    },
  });
  return path.join(outDir, 'render.js');
}

async function main() {
  const { inputFile, outputFile, options } = parseArgs(process.argv.slice(2));
  const jsonText = fs.readFileSync(inputFile, 'utf-8');

  const bundleDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blocks-to-svg-'));
  try {
    const scriptPath = await bundleRenderer(bundleDir);
    const browser = await chromium.launch();
    try {
      const page = await browser.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error));
      await page.setContent('<!DOCTYPE html><html><head><meta charset="utf-8"></head><body></body></html>');
      await page.addScriptTag({ path: scriptPath });
      if (errors.length) {
        throw errors[0];
      }
      const { svg, error } = await page.evaluate(([jsonText, options]) =>
          window.renderBlocksToSvg(jsonText, options).then(
              svg => ({ svg }), error => ({ error: error.message })),
          [jsonText, options]);
      if (error) {
        throw new Error(error);
      }
      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, svg + '\n');
    } finally {
      await browser.close();
    }
  } finally {
    fs.rmSync(bundleDir, { recursive: true, force: true });
  }
  console.log(`Wrote ${outputFile}`);
}

main().catch(e => {
  console.error(e.message ?? e);
  process.exit(1);
});
