import JSZip from 'jszip';
import { describe, expect, test } from 'vitest';
import * as blocksLib from '../frontend/libraries/blocks_lib';
import * as libraryI18n from '../frontend/libraries/library_i18n';
import { setInstalledLibraries } from '../frontend/libraries/library_registry';
import { buildLibraryTree } from '../frontend/libraries/library_tree';
import * as pythonDataToolboxes from '../frontend/libraries/python_data_toolboxes';
import * as python from '../frontend/blocks/utils/python';
import * as samplesRegistry from '../frontend/samples/samples_registry';
import { getLibraryToolbox } from '../frontend/toolbox/library_toolbox';
import * as robotPyToolbox from '../frontend/toolbox/robotpy_toolbox';

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

const PYTHON_DATA = {
  modules: [{
    moduleName: 'demo_pkg',
    enums: [{ enumClassName: 'demo_pkg.Mode', moduleName: 'demo_pkg', enumValues: ['FAST', 'SLOW'], tooltip: '' }],
  }],
  classes: [
    { className: 'demo_pkg.Motor', moduleName: 'demo_pkg', instanceMethods: [
      { functionName: 'stop', args: [{ name: 'self', type: 'demo_pkg.Motor' }] },
    ] },
    { className: 'demo_pkg.Sensor.Reading', moduleName: 'demo_pkg', instanceVariables: [
      { name: 'value', type: 'float', writable: false, tooltip: '' },
    ] },
  ],
  aliases: { 'demo_pkg.meters': 'float' },
  subclasses: { 'wpilib.MotorController': ['demo_pkg.Motor'] },
};

const SAMPLE_ENTRIES = {
  'samples/DemoBot/project.info.json': { version: '0.3.0' },
  'samples/DemoBot/description.json': { description: 'A demo', tags: ['demo'] },
  'samples/DemoBot/Robot.robot.json': { moduleType: 'robot' },
  'samples/DemoBot/Teleop.opmode.json': { moduleType: 'opmode' },
};

const LOCALIZED_ENTRIES = {
  'toolboxes/demo.json': {
    kind: 'category',
    name: '%{TOOLBOX.DEMO}',
    contents: [
      { kind: 'label', text: '%{TOOLBOX.LABEL}' },
      { kind: 'block', type: 'text', extraState: { tooltip: '%{TOOLBOX.TOOLTIP}' } },
      { kind: 'category', name: 'Literal', contents: [{ kind: 'block', type: 'text' }] },
    ],
  },
  'components/sensor.json': {
    ...COMPONENT,
    instanceMethods: [{ ...COMPONENT.instanceMethods[0], tooltip: '%{COMPONENT.GET}' }],
  },
  'locales/en.json': {
    NAME: 'Demo Library',
    TOOLBOX: { DEMO: 'Demo', LABEL: 'Label', TOOLTIP: 'Tooltip' },
    COMPONENT: { GET: 'Gets the value' },
  },
  'locales/es.json': {
    NAME: 'Biblioteca de demostración',
    TOOLBOX: { DEMO: 'Demostración' },
    COMPONENT: { GET: 'Obtiene el valor' },
  },
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
    if (content === undefined) {
      continue;
    }
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

  test('parses samples', async () => {
    const library = await blocksLib.parseBlocksLib(await makeLib({
      ...await validEntries(),
      ...SAMPLE_ENTRIES,
      'samples/DemoBot/notes.json': {},
      'samples/DemoBot/nested/Robot.robot.json': {},
      'samples/lowercase/Robot.robot.json': {},
    }));
    expect(library.samples).toEqual({
      DemoBot: {
        'project.info.json': { version: '0.3.0' },
        'description.json': { description: 'A demo', tags: ['demo'] },
        'Robot.robot.json': { moduleType: 'robot' },
        'Teleop.opmode.json': { moduleType: 'opmode' },
      },
    });
  });

  test('parses python data', async () => {
    const library = await blocksLib.parseBlocksLib(
        await makeLib({ ...await validEntries(), 'python_data/demo_pkg.json': PYTHON_DATA }));
    expect(library.pythonData).toEqual({ 'demo_pkg.json': PYTHON_DATA });
    expect((await blocksLib.parseBlocksLib(await makeLib(await validEntries()))).pythonData).toEqual({});
  });

  test('parses a library that only has samples', async () => {
    const library = await blocksLib.parseBlocksLib(
        await makeLib({ 'metadata.json': METADATA, ...SAMPLE_ENTRIES }));
    expect(Object.keys(library.samples!)).toEqual(['DemoBot']);
  });

  test('parses locales', async () => {
    const library = await blocksLib.parseBlocksLib(await makeLib({
      ...await validEntries(),
      ...LOCALIZED_ENTRIES,
      'metadata.json': { ...METADATA, displayName: '%{NAME}' },
      'locales/not a locale.json': {},
    }));
    expect(library.locales).toEqual({ en: LOCALIZED_ENTRIES['locales/en.json'], es: LOCALIZED_ENTRIES['locales/es.json'] });
    expect([...blocksLib.getReferencedKeys(library)].sort()).toEqual(
        ['COMPONENT.GET', 'NAME', 'TOOLBOX.DEMO', 'TOOLBOX.LABEL', 'TOOLBOX.TOOLTIP']);
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
      'only python data': { 'metadata.json': METADATA, 'python_data/demo_pkg.json': PYTHON_DATA },
      'python data not an object': { ...await validEntries(), 'python_data/demo_pkg.json': [] },
      'python data not json': { ...await validEntries(), 'python_data/demo_pkg.json': '{' },
      'python data classes not an array': {
        ...await validEntries(), 'python_data/demo_pkg.json': { ...PYTHON_DATA, classes: {} } },
      'python data class not in module': {
        ...await validEntries(), 'python_data/demo_pkg.json': { ...PYTHON_DATA, classes: [{ className: 'other.Motor', moduleName: 'demo_pkg' }] } },
      'python data module without name': {
        ...await validEntries(), 'python_data/demo_pkg.json': { ...PYTHON_DATA, modules: [{ enums: [] }] } },
      'python data alias not a string': {
        ...await validEntries(), 'python_data/demo_pkg.json': { ...PYTHON_DATA, aliases: { a: 1 } } },
      'python data subclasses not an array': {
        ...await validEntries(), 'python_data/demo_pkg.json': { ...PYTHON_DATA, subclasses: { a: 'b' } } },
      'bad wheel name': { ...await validEntries(), 'wheels/not-a-wheel.whl': '' },
      'sample without robot': {
        ...await validEntries(), 'samples/DemoBot/project.info.json': {}, 'samples/DemoBot/Teleop.opmode.json': {} },
      'sample without project info': { ...await validEntries(), 'samples/DemoBot/Robot.robot.json': {} },
      'sample file not json': { ...await validEntries(), ...SAMPLE_ENTRIES, 'samples/DemoBot/Teleop.opmode.json': '{' },
      'locale not an object': { ...await validEntries(), 'locales/en.json': [] },
      'locale value not a string': { ...await validEntries(), 'locales/en.json': { A: 1 } },
      'reference without default locale': {
        ...await validEntries(), ...LOCALIZED_ENTRIES, 'locales/en.json': undefined },
      'reference missing from default locale': {
        ...await validEntries(), ...LOCALIZED_ENTRIES, 'locales/en.json': { TOOLBOX: { DEMO: 'Demo', LABEL: 'Label' } } },
      'sample file not an object': { ...await validEntries(), ...SAMPLE_ENTRIES, 'samples/DemoBot/Teleop.opmode.json': [] },
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
    const classData = blocksLib.normalizeComponentClass(COMPONENT as any, 'demo');
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

describe('normalizePythonData', () => {
  test('fills in the optional fields', () => {
    const pythonData = blocksLib.normalizePythonData(
        { ...PYTHON_DATA, aliases: undefined, subclasses: undefined } as any);
    expect(pythonData.modules[0].functions).toEqual([]);
    expect(pythonData.modules[0].moduleVariables).toEqual([]);
    expect(pythonData.classes[0].isComponent).toBe(false);
    expect(pythonData.classes[0].constructors).toEqual([]);
    expect(pythonData.classes[0].instanceMethods[0].returnType).toBe('None');
    expect(pythonData.classes[0].instanceMethods[0].declaringClassName).toBe('demo_pkg.Motor');
    expect(pythonData.classes[1].instanceMethods).toEqual([]);
    expect(pythonData.aliases).toEqual({});
    expect(pythonData.subclasses).toEqual({});
  });
});

describe('library python data', () => {
  const makePythonDataLibrary = async () => blocksLib.parseBlocksLib(
      await makeLib({ ...await validEntries(), 'python_data/demo_pkg.json': PYTHON_DATA }));

  /** Returns the names of the modules in the built-in RobotPy toolbox categories. */
  const getRobotPyModuleNames = (): string[] => robotPyToolbox.getToolboxCategories(null, false)
      .map(category => (category as any).moduleName);

  /** Returns the names of the categories in the toolbox file, and their subcategories. */
  const getCategoryNames = (category: any): string[] => [
    category.name,
    ...(category.contents || []).filter((item: any) => item.kind === 'category').flatMap(getCategoryNames),
  ];

  test('registers the modules, classes, aliases, and subclasses of installed libraries', async () => {
    const builtInSubclasses = python.getSubclassNames('wpilib.MotorController');
    expect(builtInSubclasses.length).toBeGreaterThan(0);
    setInstalledLibraries([await makePythonDataLibrary()]);
    try {
      expect(python.getModuleData('demo_pkg')!.moduleName).toBe('demo_pkg');
      expect(python.getClassData('demo_pkg.Motor')!.isComponent).toBe(false);
      expect(python.getClassData('demo_pkg.Sensor')!.isComponent).toBe(true);
      expect(python.getEnumData('demo_pkg.Mode')!.enumValues).toEqual(['FAST', 'SLOW']);
      expect(python.getAlias('demo_pkg.meters')).toBe('float');
      expect(python.getSubclassNames('wpilib.MotorController')).toEqual([...builtInSubclasses, 'demo_pkg.Motor']);
      expect(python.getAllowedTypesForSetCheck('wpilib.MotorController')).toContain('demo_pkg.Motor');
      // Python data from libraries is not shown with the built-in RobotPy modules.
      expect(getRobotPyModuleNames()).not.toContain('demo_pkg');
    } finally {
      setInstalledLibraries([]);
    }
    expect(python.getClassData('demo_pkg.Motor')).toBeNull();
    expect(python.getSubclassNames('wpilib.MotorController')).toEqual(builtInSubclasses);
  });

  test('makes toolbox files for the modules and classes that are shown', async () => {
    const library = await makePythonDataLibrary();
    const toolboxes = pythonDataToolboxes.makePythonDataToolboxes(
        library, ['demo_pkg', 'demo_pkg.Sensor', 'demo_pkg.Sensor.Reading']);
    expect(Object.keys(toolboxes).sort()).toEqual(['demo_pkg.json', 'sensor.json']);
    // The module's own blocks, its enum values, are in a file named after the module.
    expect(toolboxes['demo_pkg.json'].name).toBe('demo_pkg');
    expect(toolboxes['demo_pkg.json'].contents!.map((block: any) => block.fields.ENUM_VALUE))
        .toEqual(['FAST', 'SLOW']);
    expect(getCategoryNames(toolboxes['sensor.json'])).toEqual(['Sensor', 'Reading']);
    // Only the properties of a Blockly toolbox category are kept.
    expect(Object.keys(toolboxes['sensor.json']).sort()).toEqual(['contents', 'kind', 'name']);
    // The toolbox files can be used in a library, and the registered python data is restored.
    expect(python.getClassData('demo_pkg.Motor')).toBeNull();
    const libraryToolbox = getLibraryToolbox([{ ...library, toolboxes }], new Set());
    expect(getCategoryNames(libraryToolbox.categories[0])).toEqual(['demo', 'demo_pkg', 'Sensor', 'Reading']);

    const motorToolboxes = pythonDataToolboxes.makePythonDataToolboxes(library, ['demo_pkg.Motor']);
    expect(Object.keys(motorToolboxes)).toEqual(['motor.json']);
    const labels = motorToolboxes['motor.json'].contents!.filter(item => item.kind === 'label');
    expect(labels).toEqual([]);
    expect(pythonDataToolboxes.makePythonDataToolboxes(library, [])).toEqual({});
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

describe('library samples', () => {
  const librarySamples = (libraries: blocksLib.Library[]) =>
      samplesRegistry.listSamples(libraries).filter(sample => sample.library);

  test('lists the samples of installed libraries after the built-in samples', async () => {
    const library = await blocksLib.parseBlocksLib(await makeLib({ ...await validEntries(), ...SAMPLE_ENTRIES }));
    const builtInCount = samplesRegistry.listSamples().length;
    const samples = samplesRegistry.listSamples([library]);
    expect(samples.length).toBe(builtInCount + 1);
    const sample = samples[builtInCount];
    expect(sample.sampleName).toBe('DemoBot');
    expect(sample.library!.metadata).toEqual(METADATA);
    expect(sample.description).toBe('A demo');
    expect(sample.tags).toEqual(['demo']);
    expect(Object.keys(sample.files).sort()).toEqual(['Robot.robot.json', 'Teleop.opmode.json', 'project.info.json']);
    expect(JSON.parse(sample.files['Robot.robot.json'])).toEqual({ moduleType: 'robot' });
    expect(sample.moduleFiles.map(m => m.className)).toEqual(['Robot', 'Teleop']);
  });

  test('leaves out removed and incompatible libraries', async () => {
    const library = await blocksLib.parseBlocksLib(await makeLib({ ...await validEntries(), ...SAMPLE_ENTRIES }));
    expect(librarySamples([library]).length).toBe(1);
    expect(librarySamples([])).toEqual([]);
    const incompatible = { ...library, metadata: { ...library.metadata, blocksVersion: '<0.0.1' } };
    expect(librarySamples([incompatible])).toEqual([]);
    // Libraries installed before samples were supported don't have samples.
    expect(librarySamples([makeLibrary()])).toEqual([]);
  });
});

describe('library translations', () => {
  const makeLocalizedLibrary = async () => blocksLib.parseBlocksLib(await makeLib({
    ...await validEntries(),
    ...LOCALIZED_ENTRIES,
    'metadata.json': { ...METADATA, displayName: '%{NAME}' },
  }));

  test('falls back to the base language, the default locale, and then the key', async () => {
    const library = await makeLocalizedLibrary();
    expect(libraryI18n.localizeLibraryText(library, '%{TOOLBOX.DEMO}', 'es')).toBe('Demostración');
    expect(libraryI18n.localizeLibraryText(library, '%{TOOLBOX.DEMO}', 'es-MX')).toBe('Demostración');
    expect(libraryI18n.localizeLibraryText(library, '%{TOOLBOX.LABEL}', 'es')).toBe('Label');
    expect(libraryI18n.localizeLibraryText(library, '%{TOOLBOX.DEMO}', 'fr')).toBe('Demo');
    expect(libraryI18n.localizeLibraryText(library, '%{MISSING}', 'es')).toBe('MISSING');
    expect(libraryI18n.localizeLibraryText(library, 'Not a reference', 'es')).toBe('Not a reference');
    expect(libraryI18n.localizeLibraryText(library, 'Not a %{TOOLBOX.DEMO}', 'es')).toBe('Not a %{TOOLBOX.DEMO}');
    expect(libraryI18n.getLocalizedDisplayName(library, 'es')).toBe('Biblioteca de demostración');
  });

  test('translates the toolbox, but not the hidden keys', async () => {
    const library = await makeLocalizedLibrary();
    const libraryToolbox = getLibraryToolbox([library], new Set(), 'es');
    const libraryCategory = libraryToolbox.categories[0] as any;
    expect(libraryCategory.name).toBe('Biblioteca de demostración');
    const demo = libraryCategory.contents[0];
    expect(demo.name).toBe('Demostración');
    expect(demo.contents[0].text).toBe('Label');
    // Tooltips are saved in blocks, so they are qualified with the library name instead.
    expect(demo.contents[1].extraState.tooltip).toBe('%{demo:TOOLBOX.TOOLTIP}');
    expect(demo.contents[2].name).toBe('Literal');
    expect(libraryToolbox.components[0].displayName).toBe('Biblioteca de demostración');
    expect(libraryToolbox.components[0].componentClasses[0].instanceMethods[0].tooltip).toBe('%{demo:COMPONENT.GET}');

    const demoKey = blocksLib.getToolboxKey('demo', 'demo.json', ['%{TOOLBOX.DEMO}']);
    expect(buildLibraryTree([library]).nodes.has(demoKey)).toBe(true);
    expect(getLibraryToolbox([library], new Set([demoKey]), 'es').categories).toEqual([]);
    // The original library is not modified.
    expect(library.toolboxes['demo.json']).toEqual(LOCALIZED_ENTRIES['toolboxes/demo.json']);
  });

  test('translates qualified references from installed libraries', async () => {
    const library = await makeLocalizedLibrary();
    const language = libraryI18n.getCurrentLanguage();
    const expected = libraryI18n.localizeLibraryText(library, '%{COMPONENT.GET}', language);
    setInstalledLibraries([library]);
    try {
      expect(libraryI18n.localizeInstalledLibraryText('%{demo:COMPONENT.GET}')).toBe(expected);
      expect(libraryI18n.localizeInstalledLibraryText('%{other:COMPONENT.GET}')).toBe('COMPONENT.GET');
      expect(libraryI18n.localizeInstalledLibraryText('%{COMPONENT.GET}')).toBe('%{COMPONENT.GET}');
      expect(libraryI18n.localizeInstalledLibraryText('Plain tooltip')).toBe('Plain tooltip');
    } finally {
      setInstalledLibraries([]);
    }
  });
});
