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
import * as Es from 'blockly/msg/es';
import * as He from 'blockly/msg/he';
import 'blockly/blocks';
import i18n from 'i18next';

import * as CustomBlocks from '../../frontend/blocks/setup_custom_blocks';
import { customTokens } from '../../frontend/blocks/tokens';
import { initialize as initializePythonBlocks } from '../../frontend/blocks/utils/python';
import * as workspaces from '../../frontend/blocks/utils/workspaces';
import * as storageModule from '../../frontend/storage/module';
import { themes } from '../../frontend/themes/mrc_themes';
import '../../frontend/themes/first_blocks_style'; // Registers the first_blocks_style renderer.

const SVG_NS = 'http://www.w3.org/2000/svg';

/** The app's messages, keyed by language. */
const APP_MESSAGES: {[language: string]: object} = Object.fromEntries(
    Object.entries(import.meta.glob<object>(
        '../../frontend/i18n/locales/*.json', { eager: true, import: 'default' }))
        .map(([file, messages]) => [file.replace(/^.*\/|\.json$/g, ''), messages]));

/**
 * Blockly's own messages, keyed by language. Like the app (see BlocklyComponent), other languages
 * use the English ones.
 */
const BLOCKLY_MESSAGES: {[language: string]: object} = { en: En, es: Es, he: He };

/** Space around the blocks in the SVG, in pixels. */
const MARGIN = 10;

export interface RenderOptions {
  language: string;
  theme: string;
  renderer: string;
  /** Used when the content isn't a module file, which has its own module type. */
  moduleType: string;
  /**
   * The top block to render, with the blocks connected to it: its type and name (like
   * mrc_class_method_def:periodic), type, or id. If not given, all the blocks are rendered.
   */
  block?: string;
}

let initialized = false;

async function initialize(): Promise<void> {
  if (initialized) {
    return;
  }
  await i18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources: Object.fromEntries(Object.entries(APP_MESSAGES).map(
        ([language, messages]) => [language, { translation: messages }])),
    interpolation: { escapeValue: false },
  });
  CustomBlocks.setup(Object.create(null));
  initializePythonBlocks();
  initialized = true;
}

/** Sets the language of the app's and Blockly's messages, like the app does when it changes. */
async function setLanguage(language: string): Promise<void> {
  if (!(language in APP_MESSAGES)) {
    const languages = Object.keys(APP_MESSAGES).sort();
    throw new Error(`Unknown language "${language}". The languages are ${languages.join(', ')}.`);
  }
  await i18n.changeLanguage(language);
  Blockly.setLocale((BLOCKLY_MESSAGES[language] ?? En) as any);
  Blockly.setLocale(customTokens(i18n.t.bind(i18n) as (key: string) => string));
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

/** The field that has the name of a block, like the name of a method in mrc_class_method_def. */
const FIELD_NAME = 'NAME';

/**
 * Returns the block's type, followed by a colon and its name if it has one, like
 * mrc_class_method_def:periodic.
 */
function getTypeAndName(block: Blockly.BlockSvg): string {
  const name = block.getField(FIELD_NAME) ? block.getFieldValue(FIELD_NAME) : null;
  return name ? `${block.type}:${name}` : block.type;
}

/** Returns a line describing the top block, so that the user can pick it. */
function describeTopBlock(block: Blockly.BlockSvg): string {
  const MAX_TEXT_LENGTH = 60;
  // Blockly adds direction marks around some text, which aren't wanted in a terminal.
  let text = block.toString().replace(/[\u200e\u200f]/g, '').replace(/\s+/g, ' ');
  if (text.length > MAX_TEXT_LENGTH) {
    text = text.substring(0, MAX_TEXT_LENGTH - 3) + '...';
  }
  return `  ${getTypeAndName(block)}  (id ${block.id})  ${text}`;
}

/**
 * Returns the top block with the given id, type and name (like mrc_class_method_def:periodic), or
 * type. Throws an error listing the top blocks if there isn't exactly one.
 */
function findTopBlock(workspace: Blockly.WorkspaceSvg, key: string): Blockly.BlockSvg {
  const topBlocks = workspace.getTopBlocks(true);
  const blockWithId = topBlocks.find(block => block.id === key);
  if (blockWithId) {
    return blockWithId;
  }
  const matchingBlocks = topBlocks.filter(
      block => getTypeAndName(block) === key || block.type === key);
  if (matchingBlocks.length === 1) {
    return matchingBlocks[0];
  }
  const message = matchingBlocks.length ?
      `There are ${matchingBlocks.length} top blocks that match "${key}". Use one of:` :
      `There is no top block that matches "${key}". The top blocks are:`;
  const candidates = matchingBlocks.length ? matchingBlocks : topBlocks;
  throw new Error([message, ...candidates.map(describeTopBlock)].join('\n'));
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
  await setLanguage(options.language);
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
    rtl: i18n.dir() === 'rtl',
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
    if (options.block) {
      const topBlock = findTopBlock(workspace, options.block);
      for (const block of workspace.getTopBlocks()) {
        if (block !== topBlock) {
          block.dispose(false);
        }
      }
    }
    return makeSvg(workspace, container.querySelector('.injectionDiv') ?? container);
  } finally {
    workspaces.removeWorkspace(workspace);
    workspace.dispose();
    container.remove();
  }
}

(window as any).renderBlocksToSvg = renderBlocksToSvg;
