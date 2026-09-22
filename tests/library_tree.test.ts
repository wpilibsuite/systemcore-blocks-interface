import { describe, expect, test } from 'vitest';
import * as blocksLib from '../frontend/libraries/blocks_lib';
import {
    buildLibraryTree,
    CheckState,
    getCheckStates,
    toggleNode } from '../frontend/libraries/library_tree';
import { getLibraryToolbox } from '../frontend/toolbox/library_toolbox';

function component(className: string): any {
  return {
    className,
    moduleName: 'demo_pkg',
    constructors: [{ functionName: '__init__', args: [], componentArgs: [], isComponent: true }],
  };
}

const block = { kind: 'block', type: 'text' };

// demo
//   Components
//     A
//     B
//   Demo (has blocks)
//     Sub (has blocks)
//     Sub2 (has blocks)
//   Group (only subcategories)
//     X (has blocks)
//     Y (has blocks)
const LIBRARY: blocksLib.Library = {
  metadata: {
    formatVersion: 1,
    name: 'demo',
    version: '1.0.0',
    author: 'Someone',
    summary: '',
    details: '',
    blocksVersion: '>=0.0.1',
  },
  toolboxes: {
    'demo.json': {
      kind: 'category',
      name: 'Demo',
      contents: [
        block,
        { kind: 'category', name: 'Sub', contents: [block] },
        { kind: 'category', name: 'Sub2', contents: [block] },
      ],
    } as any,
    'group.json': {
      kind: 'category',
      name: 'Group',
      contents: [
        { kind: 'category', name: 'X', contents: [block] },
        { kind: 'category', name: 'Y', contents: [block] },
      ],
    } as any,
  },
  components: {
    'a.json': component('demo_pkg.A'),
    'b.json': component('demo_pkg.B'),
  },
  wheels: [],
  pythonModules: [],
};

const KEYS = {
  library: blocksLib.getToolboxKey('demo'),
  components: blocksLib.getComponentsGroupKey('demo'),
  a: blocksLib.getComponentKey('demo', 'a.json'),
  b: blocksLib.getComponentKey('demo', 'b.json'),
  demo: blocksLib.getToolboxKey('demo', 'demo.json', ['Demo']),
  sub: blocksLib.getToolboxKey('demo', 'demo.json', ['Demo', 'Sub']),
  sub2: blocksLib.getToolboxKey('demo', 'demo.json', ['Demo', 'Sub2']),
  group: blocksLib.getToolboxKey('demo', 'group.json', ['Group']),
  x: blocksLib.getToolboxKey('demo', 'group.json', ['Group', 'X']),
  y: blocksLib.getToolboxKey('demo', 'group.json', ['Group', 'Y']),
};

const tree = buildLibraryTree([LIBRARY]);

/** Returns the state of each node, by the names in KEYS. */
function states(hiddenKeys: Set<string>): {[name: string]: CheckState} {
  const checkStates = getCheckStates(tree, hiddenKeys);
  const result: {[name: string]: CheckState} = {};
  for (const [name, key] of Object.entries(KEYS)) {
    result[name] = checkStates.get(key)!;
  }
  return result;
}

/**
 * Returns the names of the categories and components that are in the toolbox, leaving out the
 * category named after the library.
 */
function toolboxNames(hiddenKeys: Set<string>): string[] {
  const libraryToolbox = getLibraryToolbox([LIBRARY], hiddenKeys);
  const names: string[] = [];
  const collect = (category: any) => {
    names.push(category.name);
    (category.contents || []).filter((item: any) => item.kind === 'category').forEach(collect);
  };
  libraryToolbox.categories.forEach(libraryCategory => (libraryCategory.contents || []).forEach(collect));
  libraryToolbox.components.forEach(lc => lc.componentClasses.forEach(c => names.push(c.className)));
  return names.sort();
}

const { CHECKED, HALF_CHECKED, UNCHECKED } = CheckState;

describe('library tree', () => {
  test('builds the tree with components first', () => {
    expect(tree.roots.length).toBe(1);
    expect(tree.roots[0].children.map(child => child.key)).toEqual([KEYS.components, KEYS.demo, KEYS.group]);
  });

  test('everything is checked when nothing is hidden', () => {
    expect(Object.values(states(new Set())).every(state => state === CHECKED)).toBe(true);
  });

  test('a parent is half checked when some of its children are hidden', () => {
    const hidden = new Set([KEYS.a]);
    expect(states(hidden)).toMatchObject(
        { library: HALF_CHECKED, components: HALF_CHECKED, a: UNCHECKED, b: CHECKED, demo: CHECKED });
  });

  test('a parent without its own blocks is unchecked when all its children are hidden', () => {
    const hidden = new Set([KEYS.a, KEYS.b, KEYS.x, KEYS.y]);
    expect(states(hidden)).toMatchObject(
        { library: HALF_CHECKED, components: UNCHECKED, group: UNCHECKED, demo: CHECKED });
    expect(toolboxNames(hidden)).toEqual(['Demo', 'Sub', 'Sub2']);
  });

  test('a category with its own blocks is half checked when all its subcategories are hidden', () => {
    const hidden = new Set([KEYS.sub, KEYS.sub2]);
    expect(states(hidden)).toMatchObject({ demo: HALF_CHECKED, sub: UNCHECKED, sub2: UNCHECKED });
    expect(toolboxNames(hidden)).toContain('Demo');
  });

  test('clicking a half checked parent shows everything under it', () => {
    const hidden = toggleNode(tree, new Set([KEYS.a, KEYS.sub]), KEYS.components);
    expect(hidden).toEqual(new Set([KEYS.sub]));
    expect(states(hidden)).toMatchObject({ components: CHECKED, a: CHECKED, b: CHECKED });
  });

  test('clicking an unchecked parent whose children are all hidden shows everything under it', () => {
    const hidden = toggleNode(tree, new Set([KEYS.x, KEYS.y]), KEYS.group);
    expect(hidden).toEqual(new Set());
  });

  test('clicking a checked node hides it and everything under it', () => {
    const hidden = toggleNode(tree, new Set([KEYS.x]), KEYS.demo);
    expect(hidden).toEqual(new Set([KEYS.x, KEYS.demo]));
    expect(states(hidden)).toMatchObject(
        { library: HALF_CHECKED, demo: UNCHECKED, sub: UNCHECKED, sub2: UNCHECKED });

    const allHidden = toggleNode(tree, new Set(), KEYS.library);
    expect(Object.values(states(allHidden)).every(state => state === UNCHECKED)).toBe(true);
    expect(toolboxNames(allHidden)).toEqual([]);
  });

  test('a library with blocks directly under it is half checked when its categories are hidden', () => {
    const library: blocksLib.Library = {
      ...LIBRARY,
      toolboxes: {
        'blocks.json': { kind: 'flyoutToolbox', contents: [block as any] },
        'group.json': LIBRARY.toolboxes['group.json'],
      },
      components: {},
    };
    const flyoutTree = buildLibraryTree([library]);
    // The flyout toolbox doesn't have its own node.
    expect(flyoutTree.roots[0].children.map(child => child.key)).toEqual([KEYS.group]);
    const checkStates = getCheckStates(flyoutTree, new Set([KEYS.group]));
    expect(checkStates.get(KEYS.library)).toBe(HALF_CHECKED);
    expect(getCheckStates(flyoutTree, new Set([KEYS.library])).get(KEYS.library)).toBe(UNCHECKED);
  });

  test('checking a node under a hidden ancestor shows only that node', () => {
    const hidden = toggleNode(tree, new Set([KEYS.library]), KEYS.sub);
    expect(states(hidden)).toMatchObject({
      library: HALF_CHECKED,
      components: UNCHECKED,
      demo: HALF_CHECKED,
      sub: CHECKED,
      sub2: UNCHECKED,
      group: UNCHECKED,
    });
    expect(toolboxNames(hidden)).toEqual(['Demo', 'Sub']);
  });
});
