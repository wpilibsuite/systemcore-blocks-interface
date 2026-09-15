import JSZip from 'jszip';
import { describe, expect, test } from 'vitest';
import * as blocksLib from '../frontend/libraries/blocks_lib';
import { getLibraryToolbox } from '../frontend/toolbox/library_toolbox';

const METADATA: blocksLib.LibraryMetadata = {
  formatVersion: 1,
  name: 'demo',
  version: '1.0.0',
  author: 'Someone',
  summary: 'A summary',
  details: 'Some details',
  blocksVersion: '>=0.0.1',
  color: '#1E88E5',
};

const TOOLBOX = {
  kind: 'category',
  name: 'Demo',
  categorystyle: 'text_category',
  contents: [
    { kind: 'block', type: 'text' },
    { kind: 'category', name: 'Sub', colour: '#000000', contents: [{ kind: 'block', type: 'math_number' }] },
  ],
};

const COMPONENT = {
  className: 'demo_pkg.Sensor',
  moduleName: 'demo_pkg',
  constructors: [{
    functionName: '__init__',
    args: [{ name: 'channel', type: 'int' }],
    componentArgs: [{ name: 'smart_io_port', type: 'SYSTEMCORE_SMART_IO_PORT' }],
    isComponent: true,
  }],
  instanceMethods: [{
    functionName: 'get',
    args: [{ name: 'self', type: 'demo_pkg.Sensor' }],
    returnType: 'bool',
  }],
};

async function makeWheel(): Promise<ArrayBuffer> {
  const wheel = new JSZip();
  wheel.file('demo_pkg/__init__.py', '');
  wheel.file('demo_pkg/helpers.py', '');
  wheel.file('demo_module.py', '');
  wheel.file('demo_pkg-1.0.0.dist-info/METADATA', '');
  return wheel.generateAsync({ type: 'arraybuffer' });
}

async function makeLib(
    entries: {[name: string]: any}, prefix = ''): Promise<ArrayBuffer> {
  const zip = new JSZip();
  for (const name in entries) {
    const content = entries[name];
    zip.file(prefix + name,
        (typeof content === 'string' || content instanceof ArrayBuffer) ? content : JSON.stringify(content));
  }
  return zip.generateAsync({ type: 'arraybuffer' });
}

async function validEntries(): Promise<{[name: string]: any}> {
  return {
    'metadata.json': METADATA,
    'toolboxes/demo.json': TOOLBOX,
    'components/sensor.json': COMPONENT,
    'wheels/demo_pkg-1.0.0-py3-none-any.whl': await makeWheel(),
  };
}

function makeLibrary(overrides: Partial<blocksLib.LibraryMetadata> = {}): blocksLib.Library {
  return {
    metadata: { ...METADATA, ...overrides },
    toolboxes: { 'demo.json': TOOLBOX as any },
    components: { 'sensor.json': COMPONENT as any },
    wheels: [],
    pythonModules: [],
  };
}

describe('parseBlocksLib', () => {
  test('parses a valid library', async () => {
    const library = await blocksLib.parseBlocksLib(await makeLib(await validEntries()));
    expect(library.metadata).toEqual(METADATA);
    expect(library.toolboxes).toEqual({ 'demo.json': TOOLBOX });
    expect(library.components).toEqual({ 'sensor.json': COMPONENT });
    expect(library.wheels).toEqual(['demo_pkg-1.0.0-py3-none-any.whl']);
    expect(library.pythonModules).toEqual(['demo_module', 'demo_pkg']);
  });

  test('parses a flyout toolbox', async () => {
    const flyout = { kind: 'flyoutToolbox', contents: [{ kind: 'label', text: 'Demo' }, { kind: 'block', type: 'text' }] };
    const library = await blocksLib.parseBlocksLib(
        await makeLib({ ...await validEntries(), 'toolboxes/blocks.json': flyout }));
    expect(library.toolboxes['blocks.json']).toEqual(flyout);
    expect(blocksLib.isFlyoutToolbox(library.toolboxes['blocks.json'])).toBe(true);
    expect(blocksLib.isFlyoutToolbox(library.toolboxes['demo.json'])).toBe(false);
  });

  test('parses a library zipped inside a folder', async () => {
    const library = await blocksLib.parseBlocksLib(await makeLib(await validEntries(), 'folder/'));
    expect(library.metadata.name).toBe('demo');
    expect(Object.keys(library.toolboxes)).toEqual(['demo.json']);
  });

  test('rejects invalid libraries', async () => {
    const withoutAuthor = { ...METADATA } as any;
    delete withoutAuthor.author;
    const withoutJsonFiles = await validEntries();
    delete withoutJsonFiles['toolboxes/demo.json'];
    delete withoutJsonFiles['components/sensor.json'];
    const cases: {[description: string]: {[name: string]: any}} = {
      'missing author': { ...await validEntries(), 'metadata.json': withoutAuthor },
      'bad format version': { ...await validEntries(), 'metadata.json': { ...METADATA, formatVersion: 99 } },
      'bad name': { ...await validEntries(), 'metadata.json': { ...METADATA, name: '../evil' } },
      'color not hex': { ...await validEntries(), 'metadata.json': { ...METADATA, color: 'blue' } },
      'no toolboxes or components': withoutJsonFiles,
      'component class not in module': {
        ...await validEntries(), 'components/sensor.json': { ...COMPONENT, className: 'other.Sensor' } },
      'component without component constructor': {
        ...await validEntries(), 'components/sensor.json': { ...COMPONENT, constructors: [{ args: [] }] } },
      'toolbox not a category': { ...await validEntries(), 'toolboxes/demo.json': { kind: 'block', type: 'text' } },
      'flyout toolbox without contents': { ...await validEntries(), 'toolboxes/demo.json': { kind: 'flyoutToolbox' } },
      'flyout toolbox with a category': {
        ...await validEntries(), 'toolboxes/demo.json': { kind: 'flyoutToolbox', contents: [TOOLBOX] } },
      'toolbox not json': { ...await validEntries(), 'toolboxes/demo.json': '{' },
      'bad wheel name': { ...await validEntries(), 'wheels/not-a-wheel.whl': '' },
    };
    for (const description in cases) {
      await expect(blocksLib.parseBlocksLib(await makeLib(cases[description])), description)
          .rejects.toThrow(blocksLib.BlocksLibError);
    }
    await expect(blocksLib.parseBlocksLib(new TextEncoder().encode('not a zip').buffer))
        .rejects.toThrow(blocksLib.BlocksLibError);
  });
});

describe('normalizeComponentClass', () => {
  test('fills in the optional fields', () => {
    const classData = blocksLib.normalizeComponentClass(COMPONENT as any);
    expect(classData.isComponent).toBe(true);
    expect(classData.staticMethods).toEqual([]);
    expect(classData.enums).toEqual([]);
    expect(classData.constructors[0].declaringClassName).toBe('demo_pkg.Sensor');
    expect(classData.constructors[0].returnType).toBe('demo_pkg.Sensor');
    expect(classData.constructors[0].componentArgs).toEqual(
        [{ name: 'smart_io_port', type: 'SYSTEMCORE_SMART_IO_PORT', defaultValue: '' }]);
    expect(classData.instanceMethods[0].tooltip).toBe('');
    expect(classData.instanceMethods[0].args[0].defaultValue).toBe('');
  });
});

describe('isCompatible', () => {
  test('checks the blocks version against the range', () => {
    const version = blocksLib.getBlocksVersion();
    expect(blocksLib.isCompatible({ ...METADATA, blocksVersion: `>=${version}` })).toBe(true);
    expect(blocksLib.isCompatible({ ...METADATA, blocksVersion: `>${version}` })).toBe(false);
    expect(blocksLib.isCompatible({ ...METADATA, blocksVersion: 'not a range' })).toBe(false);
  });
});

describe('getLibraryToolbox', () => {
  const categoryNames = (categories: any[]): any[] => categories.map(c => ({
    name: c.name,
    children: categoryNames((c.contents || []).filter((item: any) => item.kind === 'category')),
  }));
  const componentNames = (libraryToolbox: any): any[] =>
      libraryToolbox.components.map((lc: any) => ({
        displayName: lc.displayName,
        classNames: lc.componentClasses.map((c: any) => c.className),
      }));

  test('includes everything when nothing is hidden', () => {
    const libraryToolbox = getLibraryToolbox([makeLibrary()], new Set());
    expect(categoryNames(libraryToolbox.categories)).toEqual(
        [{ name: 'demo', children: [{ name: 'Demo', children: [{ name: 'Sub', children: [] }] }] }]);
    expect((libraryToolbox.categories[0].contents![0] as any).contents.length).toBe(2);
    expect(componentNames(libraryToolbox)).toEqual([{ displayName: 'demo', classNames: ['demo_pkg.Sensor'] }]);
  });

  test('leaves out hidden libraries, categories, and components', () => {
    const library = makeLibrary();

    const hiddenLibrary = getLibraryToolbox([library], new Set([blocksLib.getToolboxKey('demo')]));
    expect(hiddenLibrary.categories).toEqual([]);
    expect(hiddenLibrary.components).toEqual([]);

    expect(getLibraryToolbox(
        [library], new Set([blocksLib.getToolboxKey('demo', 'demo.json', ['Demo'])])).categories).toEqual([]);
    const hiddenSub = getLibraryToolbox(
        [library], new Set([blocksLib.getToolboxKey('demo', 'demo.json', ['Demo', 'Sub'])]));
    expect(categoryNames(hiddenSub.categories)).toEqual([{ name: 'demo', children: [{ name: 'Demo', children: [] }] }]);
    expect(componentNames(hiddenSub)).toEqual([{ displayName: 'demo', classNames: ['demo_pkg.Sensor'] }]);
    // The original toolbox is not modified.
    expect(library.toolboxes['demo.json'].contents!.length).toBe(2);

    const hiddenComponents = getLibraryToolbox(
        [library], new Set([blocksLib.getComponentsGroupKey('demo')]));
    expect(hiddenComponents.categories.length).toBe(1);
    expect(hiddenComponents.components).toEqual([]);
    expect(getLibraryToolbox(
        [library], new Set([blocksLib.getComponentKey('demo', 'sensor.json')])).components).toEqual([]);
  });

  test('uses the library color for its categories', () => {
    const libraryToolbox = getLibraryToolbox([makeLibrary()], new Set());
    const libraryCategory = libraryToolbox.categories[0] as any;
    expect(libraryCategory.colour).toBe('#1E88E5');
    expect(libraryToolbox.components[0].colour).toBe('#1E88E5');
    // The categories in the library keep their own styles and colors.
    const demo = libraryCategory.contents[0];
    expect(demo.categorystyle).toBe('text_category');
    expect('colour' in demo).toBe(false);
    expect(demo.contents[1].colour).toBe('#000000');

    const withoutColor = getLibraryToolbox([makeLibrary({ color: undefined })], new Set());
    const withoutColorCategory = withoutColor.categories[0] as any;
    expect('colour' in withoutColorCategory).toBe(false);
    expect('colour' in withoutColor.components[0]).toBe(false);
    expect(withoutColorCategory.contents[0].categorystyle).toBe('text_category');
  });

  test('puts the blocks from flyout toolboxes directly in the library category', () => {
    const library = makeLibrary();
    library.toolboxes['z_blocks.json'] = {
      kind: 'flyoutToolbox',
      contents: [{ kind: 'label', text: 'Label' } as any, { kind: 'block', type: 'logic_boolean' } as any],
    };
    const libraryCategory = getLibraryToolbox([library], new Set()).categories[0];
    expect(libraryCategory.contents!.map((item: any) => item.kind === 'category' ? item.name : item.kind))
        .toEqual(['label', 'block', 'Demo']);

    // The blocks are still shown when all of the library's categories are hidden.
    const allCategoriesHidden = getLibraryToolbox(
        [library], new Set([blocksLib.getToolboxKey('demo', 'demo.json', ['Demo'])])).categories[0];
    expect(allCategoriesHidden.contents!.map((item: any) => item.kind)).toEqual(['label', 'block']);

    expect(getLibraryToolbox([library], new Set([blocksLib.getToolboxKey('demo')])).categories).toEqual([]);
  });

  test('leaves out incompatible libraries', () => {
    const libraryToolbox = getLibraryToolbox([makeLibrary({ blocksVersion: '<0.0.1' })], new Set());
    expect(libraryToolbox.categories).toEqual([]);
    expect(libraryToolbox.components).toEqual([]);
  });
});
