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

// Makes toolbox files for an example library from its python data and components.
//
// Usage: node generate_python_toolboxes.mjs <example_dir> <output_dir>
//
// <example_dir>/python_toolbox.json lists the full names of the python modules and classes that
// get toolbox categories, like the ones that can be chosen in the toolbox settings:
//
//   {"shownCategories": ["rev.A301", "rev.ColorSensorV3"], "ignore": [...]}
//
// ignore is only used when the python data is generated (see writeBlocksLibFiles in
// python_tools/json_util.py), to leave those out of the python data.
//
// The toolbox files are written to <output_dir>/toolboxes/. The label between the common blocks
// and the rest of the blocks in a category is a message, so it is added to the locale files in
// <output_dir>/locales/, in each language that Blocks has, unless the library already has it.
//
// The frontend code that makes the toolbox for the built-in RobotPy modules is used, bundled with
// vite, so npm install has to have been run.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build } from 'vite';

const REPO_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APP_LOCALES_DIR = path.join(REPO_DIR, 'frontend', 'i18n', 'locales');

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function writeJson(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(content, null, 2) + '\n');
}

/** Returns the contents of the .json files in the directory, keyed by filename. */
function readJsonFiles(dir) {
  const contents = {};
  if (fs.existsSync(dir)) {
    for (const filename of fs.readdirSync(dir).sort()) {
      if (filename.endsWith('.json')) {
        contents[filename] = readJson(path.join(dir, filename));
      }
    }
  }
  return contents;
}

/**
 * Bundles frontend/libraries/python_data_toolboxes.ts and everything it uses, including Blockly,
 * into a single ES module that node can run, and imports it. Bundling is used because Blockly's
 * node modules are commonjs, which the frontend code can't import by name.
 */
async function loadGenerator() {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'blocks-python-toolboxes-'));
  try {
    await build({
      configFile: false,
      root: REPO_DIR,
      logLevel: 'warn',
      define: { __APP_VERSION__: JSON.stringify(readJson(path.join(REPO_DIR, 'package.json')).version) },
      ssr: {
        noExternal: true,
        target: 'node',
        resolve: {
          conditions: ['import', 'module', 'default'],
          externalConditions: ['import', 'module', 'default'],
        },
      },
      build: {
        ssr: path.join(REPO_DIR, 'frontend', 'libraries', 'python_data_toolboxes.ts'),
        outDir,
        emptyOutDir: true,
        minify: false,
        rollupOptions: { output: { format: 'es', entryFileNames: 'generator.mjs', codeSplitting: false } },
      },
    });
    return await import(pathToFileURL(path.join(outDir, 'generator.mjs')).href);
  } finally {
    fs.rmSync(outDir, { recursive: true, force: true });
  }
}

async function main() {
  const [exampleDir, outputDir] = process.argv.slice(2);
  if (!exampleDir || !outputDir) {
    console.error('Usage: node generate_python_toolboxes.mjs <example_dir> <output_dir>');
    process.exit(1);
  }
  const { shownCategories } = readJson(path.join(exampleDir, 'python_toolbox.json'));
  const library = {
    metadata: readJson(path.join(exampleDir, 'metadata.json')),
    toolboxes: {},
    components: readJsonFiles(path.join(exampleDir, 'components')),
    pythonData: readJsonFiles(path.join(exampleDir, 'python_data')),
    wheels: [],
    pythonModules: [],
  };

  const module = await loadGenerator();
  const toolboxes = module.makePythonDataToolboxes(library, shownCategories);
  const moreBlocksMessageKey = module.MORE_BLOCKS_MESSAGE_KEY;
  if (Object.keys(toolboxes).length === 0) {
    throw new Error(`None of ${shownCategories.join(', ')} are in the python data`);
  }

  for (const [filename, toolbox] of Object.entries(toolboxes)) {
    const file = path.join(outputDir, 'toolboxes', filename);
    if (fs.existsSync(file)) {
      throw new Error(`toolboxes/${filename} already exists`);
    }
    writeJson(file, toolbox);
  }

  for (const filename of fs.readdirSync(APP_LOCALES_DIR).sort()) {
    const moreBlocksLabel = readJson(path.join(APP_LOCALES_DIR, filename)).BLOCKLY?.MORE_BLOCKS_LABEL;
    if (!moreBlocksLabel) {
      continue;
    }
    const file = path.join(outputDir, 'locales', filename);
    const messages = fs.existsSync(file) ? readJson(file) : {};
    if (!(moreBlocksMessageKey in messages)) {
      messages[moreBlocksMessageKey] = moreBlocksLabel;
      writeJson(file, messages);
    }
  }
  console.log(`  Generated ${Object.keys(toolboxes).sort().map(f => 'toolboxes/' + f).join(', ')}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
