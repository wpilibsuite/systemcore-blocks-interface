#!/usr/bin/env python3
"""
Unit tests for blocks_lib.py. These don't need the server to be running:
    python3 -m unittest test_blocks_lib
"""

import io
import json
import os
import tempfile
import unittest
import zipfile

import blocks_lib


def make_wheel(files):
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, 'w') as wheel:
        for name in files:
            wheel.writestr(name, '')
    return buffer.getvalue()


VALID_METADATA = {
    'formatVersion': 1,
    'name': 'demo',
    'version': '1.0.0',
    'author': 'Someone',
    'summary': 'A summary',
    'details': 'Some details',
    'blocksVersion': '>=0.4.0',
    'color': '#1E88E5',
}

VALID_TOOLBOX = {'kind': 'category', 'name': 'Demo', 'contents': []}

VALID_FLYOUT_TOOLBOX = {
    'kind': 'flyoutToolbox',
    'contents': [{'kind': 'label', 'text': 'Demo'}, {'kind': 'block', 'type': 'text'}],
}

VALID_COMPONENT = {
    'className': 'demo_pkg.Sensor',
    'moduleName': 'demo_pkg',
    'constructors': [{
        'args': [{'name': 'channel', 'type': 'int'}],
        'componentArgs': [{'name': 'smart_io_port', 'type': 'SYSTEMCORE_SMART_IO_PORT'}],
        'isComponent': True,
    }],
    'instanceMethods': [],
}

VALID_PYTHON_DATA = {
    'modules': [{'moduleName': 'demo_pkg', 'enums': [], 'functions': [], 'moduleVariables': []}],
    'classes': [{'className': 'demo_pkg.Reading', 'moduleName': 'demo_pkg', 'instanceMethods': []}],
    'aliases': {'demo_pkg.meters': 'float'},
    'subclasses': {'wpilib.MotorController': ['demo_pkg.Motor']},
}

VALID_SAMPLE = {
    'samples/DemoBot/project.info.json': {'version': '0.3.0'},
    'samples/DemoBot/description.json': {'description': 'A demo', 'tags': ['demo']},
    'samples/DemoBot/Robot.robot.json': {'moduleType': 'robot'},
    'samples/DemoBot/Teleop.opmode.json': {'moduleType': 'opmode'},
}

LOCALIZED_ENTRIES = {
    'toolboxes/demo.json': {'kind': 'category', 'name': '%{TOOLBOX.DEMO}', 'contents': [
        {'kind': 'label', 'text': '%{TOOLBOX.LABEL}'},
        {'kind': 'block', 'type': 'text', 'extraState': {'tooltip': '%{TOOLBOX.TOOLTIP}'}},
    ]},
    'locales/en.json': {'TOOLBOX': {'DEMO': 'Demo', 'LABEL': 'Label', 'TOOLTIP': 'Tooltip'}},
    'locales/es.json': {'TOOLBOX': {'DEMO': 'Demostración'}},
}

VALID_WHEEL = make_wheel([
    'demo_pkg/__init__.py',
    'demo_pkg/helpers.py',
    'demo_module.py',
    'demo_pkg-1.0.0.dist-info/METADATA',
])


class BlocksLibTest(unittest.TestCase):

    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.libraries_dir = os.path.join(self.temp_dir.name, 'libraries')

    def tearDown(self):
        self.temp_dir.cleanup()

    def make_lib(self, entries, filename='demo.blocks_lib'):
        path = os.path.join(self.temp_dir.name, filename)
        with zipfile.ZipFile(path, 'w') as zf:
            for name, content in entries.items():
                if isinstance(content, (dict, list)):
                    content = json.dumps(content)
                zf.writestr(name, content)
        return path

    def valid_entries(self, prefix='', **metadata_overrides):
        metadata = dict(VALID_METADATA, **metadata_overrides)
        return {
            prefix + 'metadata.json': metadata,
            prefix + 'toolboxes/demo.json': VALID_TOOLBOX,
            prefix + 'components/sensor.json': VALID_COMPONENT,
            prefix + 'wheels/demo_pkg-1.0.0-py3-none-any.whl': VALID_WHEEL,
        }

    def test_install_and_list(self):
        library = blocks_lib.install_blocks_lib(
            self.make_lib(self.valid_entries()), self.libraries_dir)
        self.assertEqual(library['metadata']['name'], 'demo')
        self.assertEqual(library['toolboxes'], {'demo.json': VALID_TOOLBOX})
        self.assertEqual(library['components'], {'sensor.json': VALID_COMPONENT})
        self.assertEqual(library['wheels'], ['demo_pkg-1.0.0-py3-none-any.whl'])
        self.assertEqual(library['pythonModules'], ['demo_module', 'demo_pkg'])
        self.assertEqual(blocks_lib.list_libraries(self.libraries_dir), [library])

    def test_install_from_zipped_folder(self):
        library = blocks_lib.install_blocks_lib(
            self.make_lib(self.valid_entries(prefix='demo_folder/')), self.libraries_dir)
        self.assertEqual(library['metadata']['name'], 'demo')
        self.assertEqual(list(library['toolboxes']), ['demo.json'])

    def test_install_components_only(self):
        entries = self.valid_entries()
        del entries['toolboxes/demo.json']
        library = blocks_lib.install_blocks_lib(self.make_lib(entries), self.libraries_dir)
        self.assertEqual(library['toolboxes'], {})
        self.assertEqual(list(library['components']), ['sensor.json'])

    def test_install_flyout_toolbox(self):
        entries = dict(self.valid_entries(), **{'toolboxes/blocks.json': VALID_FLYOUT_TOOLBOX})
        library = blocks_lib.install_blocks_lib(self.make_lib(entries), self.libraries_dir)
        self.assertEqual(library['toolboxes']['blocks.json'], VALID_FLYOUT_TOOLBOX)

    def test_install_python_data(self):
        entries = {**self.valid_entries(), 'python_data/demo_pkg.json': VALID_PYTHON_DATA}
        library = blocks_lib.install_blocks_lib(self.make_lib(entries), self.libraries_dir)
        self.assertEqual(library['pythonData'], {'demo_pkg.json': VALID_PYTHON_DATA})
        self.assertEqual(blocks_lib.list_libraries(self.libraries_dir), [library])

    def test_install_without_python_data(self):
        library = blocks_lib.install_blocks_lib(
            self.make_lib(self.valid_entries()), self.libraries_dir)
        self.assertEqual(library['pythonData'], {})

    def test_install_samples(self):
        entries = dict(self.valid_entries(), **VALID_SAMPLE)
        library = blocks_lib.install_blocks_lib(self.make_lib(entries), self.libraries_dir)
        self.assertEqual(library['samples'], {'DemoBot': {
            'Robot.robot.json': {'moduleType': 'robot'},
            'Teleop.opmode.json': {'moduleType': 'opmode'},
            'description.json': {'description': 'A demo', 'tags': ['demo']},
            'project.info.json': {'version': '0.3.0'},
        }})
        self.assertEqual(blocks_lib.list_libraries(self.libraries_dir), [library])

    def test_install_samples_only(self):
        entries = dict(self.valid_entries(), **VALID_SAMPLE)
        del entries['toolboxes/demo.json']
        del entries['components/sensor.json']
        library = blocks_lib.install_blocks_lib(self.make_lib(entries), self.libraries_dir)
        self.assertEqual(list(library['samples']), ['DemoBot'])

    def test_install_locales(self):
        entries = dict(self.valid_entries(summary='%{SUMMARY}'), **LOCALIZED_ENTRIES)
        entries['locales/en.json'] = dict(entries['locales/en.json'], SUMMARY='A summary')
        entries['locales/not_a_locale.json'] = {'SUMMARY': 'ignored'}
        library = blocks_lib.install_blocks_lib(self.make_lib(entries), self.libraries_dir)
        self.assertEqual(library['locales'], {
            'en': entries['locales/en.json'],
            'es': {'TOOLBOX': {'DEMO': 'Demostración'}},
        })
        self.assertEqual(blocks_lib.list_libraries(self.libraries_dir), [library])

    def test_referenced_keys(self):
        keys = blocks_lib.get_referenced_keys(
            dict(VALID_METADATA, displayName='%{NAME}', details='Not a %{REFERENCE}'),
            {'demo.json': LOCALIZED_ENTRIES['toolboxes/demo.json']},
            {'sensor.json': dict(VALID_COMPONENT, constructors=[
                dict(VALID_COMPONENT['constructors'][0], tooltip='%{COMPONENT.TOOLTIP}')])},
            {'DemoBot': {'description.json': {'description': '%{SAMPLE.DESCRIPTION}',
                                              'tags': ['%{SAMPLE.TAG}', 'literal']}}})
        self.assertEqual(keys, {'NAME', 'TOOLBOX.DEMO', 'TOOLBOX.LABEL', 'TOOLBOX.TOOLTIP',
                                'COMPONENT.TOOLTIP', 'SAMPLE.DESCRIPTION', 'SAMPLE.TAG'})

    def test_install_replaces_existing(self):
        blocks_lib.install_blocks_lib(self.make_lib(self.valid_entries()), self.libraries_dir)
        blocks_lib.install_blocks_lib(
            self.make_lib(self.valid_entries(version='2.0.0')), self.libraries_dir)
        libraries = blocks_lib.list_libraries(self.libraries_dir)
        self.assertEqual(len(libraries), 1)
        self.assertEqual(libraries[0]['metadata']['version'], '2.0.0')

    def test_invalid_libraries_are_rejected(self):
        without_json_files = self.valid_entries()
        del without_json_files['toolboxes/demo.json']
        del without_json_files['components/sensor.json']
        without_metadata = self.valid_entries()
        del without_metadata['metadata.json']
        missing_author = self.valid_entries()
        del missing_author['metadata.json']['author']
        cases = {
            'missing metadata': without_metadata,
            'missing author': missing_author,
            'bad format version': self.valid_entries(formatVersion=99),
            'format version not int': self.valid_entries(formatVersion='1'),
            'bad name': self.valid_entries(name='../evil'),
            'color not hex': self.valid_entries(color='blue'),
            'color too short': self.valid_entries(color='#FFF'),
            'no toolboxes or components': without_json_files,
            'component class not in module': dict(self.valid_entries(), **{
                'components/sensor.json': dict(VALID_COMPONENT, className='other.Sensor')}),
            'component without component constructor': dict(self.valid_entries(), **{
                'components/sensor.json': dict(VALID_COMPONENT, constructors=[{'args': []}])}),
            'component methods not a list': dict(self.valid_entries(), **{
                'components/sensor.json': dict(VALID_COMPONENT, instanceMethods={})}),
            'toolbox not category': dict(self.valid_entries(), **{
                'toolboxes/demo.json': {'kind': 'flyoutToolbox'}}),
            'toolbox not json': dict(self.valid_entries(), **{'toolboxes/demo.json': '{'}),
            'flyout toolbox with a category': dict(self.valid_entries(), **{
                'toolboxes/demo.json': {'kind': 'flyoutToolbox', 'contents': [VALID_TOOLBOX]}}),
            'flyout toolbox without contents': dict(self.valid_entries(), **{
                'toolboxes/demo.json': {'kind': 'flyoutToolbox'}}),
            'only python data': {
                'metadata.json': VALID_METADATA, 'python_data/demo_pkg.json': VALID_PYTHON_DATA},
            'python data not an object': {**self.valid_entries(), 'python_data/demo_pkg.json': []},
            'python data not json': {**self.valid_entries(), 'python_data/demo_pkg.json': '{'},
            'python data classes not a list': {
                **self.valid_entries(),
                'python_data/demo_pkg.json': {**VALID_PYTHON_DATA, 'classes': {}}},
            'python data class without module name': {
                **self.valid_entries(),
                'python_data/demo_pkg.json': {**VALID_PYTHON_DATA, 'classes': [{'className': 'Reading'}]}},
            'python data module without name': {
                **self.valid_entries(),
                'python_data/demo_pkg.json': {**VALID_PYTHON_DATA, 'modules': [{'enums': []}]}},
            'python data alias not a string': {
                **self.valid_entries(),
                'python_data/demo_pkg.json': {**VALID_PYTHON_DATA, 'aliases': {'a': 1}}},
            'python data subclasses not a list': {
                **self.valid_entries(),
                'python_data/demo_pkg.json': {**VALID_PYTHON_DATA, 'subclasses': {'a': 'b'}}},
            'bad wheel name': dict(self.valid_entries(), **{'wheels/not-a-wheel.whl': b''}),
            'sample without robot': {
                k: v for k, v in dict(self.valid_entries(), **VALID_SAMPLE).items()
                if k != 'samples/DemoBot/Robot.robot.json'},
            'sample without project info': {
                k: v for k, v in dict(self.valid_entries(), **VALID_SAMPLE).items()
                if k != 'samples/DemoBot/project.info.json'},
            'sample file not json': {**self.valid_entries(), **VALID_SAMPLE,
                                     'samples/DemoBot/Teleop.opmode.json': '{'},
            'locale not an object': {**self.valid_entries(), 'locales/en.json': []},
            'locale value not a string': {**self.valid_entries(), 'locales/en.json': {'A': 1}},
            'reference without default locale': {
                k: v for k, v in dict(self.valid_entries(), **LOCALIZED_ENTRIES).items()
                if k != 'locales/en.json'},
            'reference missing from default locale': {
                **self.valid_entries(), **LOCALIZED_ENTRIES,
                'locales/en.json': {'TOOLBOX': {'DEMO': 'Demo', 'LABEL': 'Label'}}},
            'sample file not an object': {**self.valid_entries(), **VALID_SAMPLE,
                                          'samples/DemoBot/Teleop.opmode.json': []},
        }
        for description, entries in cases.items():
            with self.subTest(description):
                with self.assertRaises(blocks_lib.BlocksLibError):
                    blocks_lib.install_blocks_lib(self.make_lib(entries), self.libraries_dir)
                self.assertEqual(blocks_lib.list_libraries(self.libraries_dir), [])

    def test_not_a_zip_is_rejected(self):
        path = os.path.join(self.temp_dir.name, 'bad.blocks_lib')
        with open(path, 'w') as f:
            f.write('not a zip')
        with self.assertRaises(blocks_lib.BlocksLibError):
            blocks_lib.install_blocks_lib(path, self.libraries_dir)

    def test_unexpected_entries_are_not_extracted(self):
        entries = dict(self.valid_entries(), **{
            '../evil.json': VALID_TOOLBOX,
            'toolboxes/../../evil.json': VALID_TOOLBOX,
            'toolboxes/nested/deeper.json': VALID_TOOLBOX,
            'python_data/nested/deeper.json': VALID_PYTHON_DATA,
            'README.md': 'readme',
            'samples/DemoBot/project.info.json': {},
            'samples/DemoBot/Robot.robot.json': {},
            'samples/DemoBot/notes.json': {},
            'samples/DemoBot/nested/Robot.robot.json': {},
            'samples/../Robot.robot.json': {},
            'samples/lowercase/Robot.robot.json': {},
        })
        blocks_lib.install_blocks_lib(self.make_lib(entries), self.libraries_dir)
        extracted = []
        for root, _, files in os.walk(self.temp_dir.name):
            extracted.extend(os.path.relpath(os.path.join(root, f), self.temp_dir.name)
                             for f in files)
        self.assertEqual(sorted(extracted), [
            'demo.blocks_lib',
            os.path.join('libraries', 'demo', 'components', 'sensor.json'),
            os.path.join('libraries', 'demo', 'metadata.json'),
            os.path.join('libraries', 'demo', 'samples', 'DemoBot', 'Robot.robot.json'),
            os.path.join('libraries', 'demo', 'samples', 'DemoBot', 'project.info.json'),
            os.path.join('libraries', 'demo', 'toolboxes', 'demo.json'),
            os.path.join('libraries', 'demo', 'wheels', 'demo_pkg-1.0.0-py3-none-any.whl'),
        ])

    def test_remove(self):
        blocks_lib.install_blocks_lib(self.make_lib(self.valid_entries()), self.libraries_dir)
        self.assertFalse(blocks_lib.remove_library('missing', self.libraries_dir))
        self.assertFalse(blocks_lib.remove_library('..', self.libraries_dir))
        self.assertTrue(blocks_lib.remove_library('demo', self.libraries_dir))
        self.assertEqual(blocks_lib.list_libraries(self.libraries_dir), [])

    def test_requirements_for_deploy(self):
        blocks_lib.install_blocks_lib(self.make_lib(self.valid_entries()), self.libraries_dir)
        python_dir = os.path.join(self.temp_dir.name, 'deploy')
        pip_cache_dir = os.path.join(self.temp_dir.name, 'pip_cache')
        os.makedirs(python_dir)

        with open(os.path.join(python_dir, 'robot.py'), 'w') as f:
            f.write('import wpilib\n')
        self.assertEqual(
            blocks_lib.get_requirements_for_deploy(python_dir, self.libraries_dir, pip_cache_dir),
            [])
        self.assertFalse(os.path.exists(pip_cache_dir))

        with open(os.path.join(python_dir, 'teleop.py'), 'w') as f:
            f.write('import wpilib\nimport demo_pkg.helpers\n')
        self.assertEqual(
            blocks_lib.get_requirements_for_deploy(python_dir, self.libraries_dir, pip_cache_dir),
            ['demo_pkg==1.0.0'])
        self.assertTrue(os.path.exists(
            os.path.join(pip_cache_dir, 'demo_pkg-1.0.0-py3-none-any.whl')))


if __name__ == '__main__':
    unittest.main()
