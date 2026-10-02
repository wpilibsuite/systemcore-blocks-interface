/**
 * @license
 * Copyright 2026 Porpoiseful LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Renders blocks as a standalone SVG. This is bundled by blocks_to_svg.mjs and run
 * in a headless browser, because Blockly needs a real DOM to measure and lay out the blocks.
 * @author alan@porpoiseful.com (Alan Smith)
 */

import * as Blockly from 'blockly/core';
import * as En from 'blockly/msg/en';
import 'blockly/blocks';
import i18n from 'i18next';

import * as CustomBlocks from '../../frontend/blocks/setup_custom_blocks';
import { customTokens } from '../../frontend/blocks/tokens';
import { initialize as initializePythonBlocks } from '../../frontend/blocks/utils/python';
import * as workspaces from '../../frontend/blocks/utils/workspaces';
import * as storageModule from '../../frontend/storage/module';
import { themes } from '../../frontend/themes/mrc_themes';
import '../../frontend/themes/first_blocks_style'; // Registers the first_blocks_style renderer.
import enMessages from '../../frontend/i18n/locales/en.json';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Space around the blocks in the SVG, in pixels. */
const MARGIN = 10;

export interface RenderOptions {
  theme: string;
  renderer: string;
  /** Used when the content isn't a module file, which has its own module type. */
  moduleType: string;
}

let initialized = false;

async function initialize(): Promise<void> {
  if (initialized) {
    return;
  }
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: { en: { translation: enMessages } },
    interpolation: { escapeValue: false },
  });
  Blockly.setLocale(En as any);
  Blockly.setLocale(customTokens(i18n.t.bind(i18n) as (key: string) => string));
  CustomBlocks.setup(Object.create(null));
  initializePythonBlocks();
  initialized = true;
}

/**
 * Returns the workspace serialization and module type for the given JSON, which can be a module
 * file (like Robot.robot.json), a workspace serialization, a single block, or a list of blocks.
 */
function parseContent(
    content: any, defaultModuleType: string): {blocks: object, moduleType: storageModule.ModuleType} {
  let blocks = content;
  let moduleType = defaultModuleType;
  if (content && typeof content === 'object' && 'moduleType' in content && 'blocks' in content) {
    blocks = content.blocks;
    moduleType = content.moduleType;
  } else if (Array.isArray(content)) {
    blocks = { blocks: { languageVersion: 0, blocks: content } };
  } else if (content && typeof content === 'object' && 'type' in content) {
    blocks = { blocks: { languageVersion: 0, blocks: [content] } };
  }
  if (!blocks || typeof blocks !== 'object' || !('blocks' in blocks)) {
    throw new Error('The JSON is not a module file, workspace, block, or list of blocks.');
  }
  return { blocks, moduleType: storageModule.stringToModuleType(moduleType) };
}

/** Returns the text of all the style sheets in the document, which includes Blockly's CSS. */
function getCssText(): string {
  const cssTexts: string[] = [];
  for (const styleSheet of Array.from(document.styleSheets)) {
    for (const rule of Array.from(styleSheet.cssRules)) {
      cssTexts.push(rule.cssText);
    }
  }
  return cssTexts.join('\n');
}

/**
 * Makes a standalone SVG with a copy of the workspace's blocks. The ancestors of the block canvas
 * are copied without their transforms so that the CSS selectors that use their classes still
 * match, and the view box is the bounding box of the blocks in workspace coordinates.
 */
function makeSvg(workspace: Blockly.WorkspaceSvg, injectionDiv: Element): string {
  const canvas = workspace.getCanvas();
  const box = workspace.getBlocksBoundingBox();
  const x = box.left - MARGIN;
  const y = box.top - MARGIN;
  const width = box.right - box.left + 2 * MARGIN;
  const height = box.bottom - box.top + 2 * MARGIN;

  const ancestors: Element[] = [];
  for (let element = canvas.parentElement; element && element !== injectionDiv;
      element = element.parentElement) {
    ancestors.unshift(element);
  }
  const svg = document.createElementNS(SVG_NS, 'svg');
  // The outermost ancestor is Blockly's svg. Its classes are combined with the injection div's,
  // since the renderer and theme classes can be on either.
  const classNames = [injectionDiv.getAttribute('class'), ancestors[0]?.getAttribute('class')];
  svg.setAttribute('class', classNames.filter(c => c).join(' '));
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);

  const style = document.createElementNS(SVG_NS, 'style');
  style.textContent = getCssText();
  svg.appendChild(style);

  // Copy the definitions, like the patterns and filters used by disabled and highlighted blocks.
  for (const defs of Array.from(injectionDiv.querySelectorAll('defs'))) {
    svg.appendChild(defs.cloneNode(true));
  }

  let parent: Element = svg;
  for (const ancestor of ancestors.slice(1)) {
    const group = document.createElementNS(SVG_NS, 'g');
    const className = ancestor.getAttribute('class');
    if (className) {
      group.setAttribute('class', className);
    }
    parent.appendChild(group);
    parent = group;
  }
  const canvasCopy = canvas.cloneNode(true) as Element;
  canvasCopy.removeAttribute('transform');
  parent.appendChild(canvasCopy);

  return new XMLSerializer().serializeToString(svg);
}

/** Returns an SVG of the blocks in the given JSON text. */
async function renderBlocksToSvg(jsonText: string, options: RenderOptions): Promise<string> {
  await initialize();
  const { blocks, moduleType } = parseContent(JSON.parse(jsonText), options.moduleType);

  const themeName = 'mrc_theme_' + options.theme.replace(/-/g, '_');
  const theme = themes.find(theme => theme.name === themeName);
  if (!theme) {
    const themeNames = themes.map(theme => theme.name.replace(/^mrc_theme_/, '').replace(/_/g, '-'));
    throw new Error(`Unknown theme "${options.theme}". The themes are ${themeNames.join(', ')}.`);
  }

  const container = document.createElement('div');
  container.style.width = '1000px';
  container.style.height = '1000px';
  document.body.appendChild(container);
  const workspace = Blockly.inject(container, {
    theme,
    renderer: options.renderer,
    scrollbars: false,
    trashcan: false,
  });
  try {
    workspaces.addWorkspace(workspace, moduleType);
    Blockly.serialization.workspaces.load(blocks, workspace);
    if (workspace.getTopBlocks().length === 0) {
      throw new Error('There are no blocks.');
    }
    return makeSvg(workspace, container.querySelector('.injectionDiv') ?? container);
  } finally {
    workspaces.removeWorkspace(workspace);
    workspace.dispose();
    container.remove();
  }
}

(window as any).renderBlocksToSvg = renderBlocksToSvg;
