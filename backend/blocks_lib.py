"""
Support for third party .blocks_lib libraries.

A .blocks_lib file is a zip file containing:
    metadata.json   - information about the library (see REQUIRED_METADATA_FIELDS)
    wheels/*.whl    - python wheels that are installed on the robot when a project uses the library
    toolboxes/*.json - blockly toolbox categories, or flyout toolboxes whose blocks go directly in
                       the library's category, that are added to the toolbox
    components/*.json - optional component classes that are added to the components toolbox
    samples/<SampleName>/*.json - optional sample projects that are shown with the built in samples

Installed libraries are extracted to <libraries_dir>/<name>/.

This module only uses the standard library so that it can be unit tested without flask.
"""

# Standard library imports
import json
import os
import re
import shutil
import tempfile
import zipfile
from typing import Any, Dict, List, Optional, Set

METADATA_FILE = 'metadata.json'
WHEELS_DIR = 'wheels'
TOOLBOXES_DIR = 'toolboxes'
COMPONENTS_DIR = 'components'
SAMPLES_DIR = 'samples'

# The files in a sample are the files of a project, plus an optional description.json.
SAMPLE_PROJECT_INFO_FILE = 'project.info.json'
SAMPLE_DESCRIPTION_FILE = 'description.json'
SAMPLE_ROBOT_FILE = 'Robot.robot.json'

SUPPORTED_FORMAT_VERSIONS = [1]

# Maps each required metadata field to its python type.
REQUIRED_METADATA_FIELDS = {
    'formatVersion': int,
    'name': str,
    'version': str,
    'author': str,
    'summary': str,
    'details': str,
    'blocksVersion': str,
}

# Library names are used as directory names, so keep them simple.
LIBRARY_NAME_PATTERN = re.compile(r'^[A-Za-z0-9][A-Za-z0-9_.-]{0,99}$')

# See https://packaging.python.org/en/latest/specifications/binary-distribution-format/
WHEEL_FILENAME_PATTERN = re.compile(
    r'^(?P<name>[A-Za-z0-9_.]+)-(?P<version>[^-]+)(-\d[^-]*)?-[^-]+-[^-]+-[^-]+\.whl$')

JSON_FILENAME_PATTERN = re.compile(r'^[A-Za-z0-9_.-]+\.json$')

# Sample names are used as project names, and sample files as project files. See
# frontend/storage/names.ts.
SAMPLE_NAME_PATTERN = re.compile(r'^[A-Z][A-Za-z0-9_]*$')
SAMPLE_MODULE_FILENAME_PATTERN = re.compile(r'^[A-Z][A-Za-z0-9_]*\.(robot|mechanism|opmode)\.json$')

COLOR_PATTERN = re.compile(r'^#[0-9A-Fa-f]{6}$')

IMPORT_PATTERN = re.compile(r'^\s*(?:from|import)\s+([A-Za-z_][A-Za-z0-9_]*)', re.MULTILINE)


class BlocksLibError(Exception):
    """Raised when a .blocks_lib file or installed library is not valid."""


def _find_root_prefix(names: List[str]) -> str:
    """Returns the prefix of the directory in the zip that contains metadata.json.

    Most files will have metadata.json at the top level, but zipping a folder (for example with
    Finder or Explorer) puts everything inside a single top level directory, so allow that too.
    """
    if METADATA_FILE in names:
        return ''
    candidates = [n for n in names
                  if n.endswith('/' + METADATA_FILE) and n.count('/') == 1
                  and not n.startswith('__MACOSX/')]
    if len(candidates) == 1:
        return candidates[0][:-len(METADATA_FILE)]
    raise BlocksLibError(f'{METADATA_FILE} was not found in the library')


def validate_metadata(metadata: Any) -> Dict[str, Any]:
    """Checks that the metadata has the required fields and returns it."""
    if not isinstance(metadata, dict):
        raise BlocksLibError(f'{METADATA_FILE} must contain a JSON object')
    for field, field_type in REQUIRED_METADATA_FIELDS.items():
        value = metadata.get(field)
        # bool is a subclass of int, so exclude it explicitly.
        if not isinstance(value, field_type) or isinstance(value, bool):
            raise BlocksLibError(
                f'{METADATA_FILE} is missing "{field}" or it is not a {field_type.__name__}')
    if metadata['formatVersion'] not in SUPPORTED_FORMAT_VERSIONS:
        raise BlocksLibError(f'Unsupported formatVersion {metadata["formatVersion"]}')
    if not LIBRARY_NAME_PATTERN.match(metadata['name']):
        raise BlocksLibError(f'Invalid library name "{metadata["name"]}"')
    if 'displayName' in metadata and not isinstance(metadata['displayName'], str):
        raise BlocksLibError(f'"displayName" in {METADATA_FILE} must be a str')
    if 'color' in metadata and (
            not isinstance(metadata['color'], str) or not COLOR_PATTERN.match(metadata['color'])):
        raise BlocksLibError(f'"color" in {METADATA_FILE} must be a color like "#1E88E5"')
    return metadata


def validate_toolbox(toolbox: Any, filename: str) -> None:
    """Checks that the toolbox is a blockly category or a flyout toolbox without categories."""
    if isinstance(toolbox, dict) and toolbox.get('kind') == 'flyoutToolbox':
        contents = toolbox.get('contents')
        if not isinstance(contents, list) or any(
                not isinstance(item, dict) or item.get('kind') == 'category' for item in contents):
            raise BlocksLibError(f'{filename} must have "contents" without any categories')
        return
    if not isinstance(toolbox, dict) or toolbox.get('kind') != 'category':
        raise BlocksLibError(
            f'{filename} must contain a JSON object with "kind": "category" or "kind": "flyoutToolbox"')
    if not isinstance(toolbox.get('name'), str) or not toolbox['name']:
        raise BlocksLibError(f'{filename} must have a "name"')


def validate_component(component: Any, filename: str) -> None:
    """Checks that the component is a class in the format of the generated python data."""
    if not isinstance(component, dict):
        raise BlocksLibError(f'{filename} must contain a JSON object')
    module_name = component.get('moduleName')
    class_name = component.get('className')
    if (not isinstance(module_name, str) or not module_name or not isinstance(class_name, str)
            or not class_name.startswith(module_name + '.')):
        raise BlocksLibError(
            f'{filename} must have a "moduleName" and a "className" that starts with the moduleName')
    constructors = component.get('constructors')
    if not isinstance(constructors, list) or not any(
            isinstance(c, dict) and c.get('isComponent') is True
            and isinstance(c.get('componentArgs'), list) for c in constructors):
        raise BlocksLibError(
            f'{filename} must have a constructor with "isComponent": true and "componentArgs"')
    for field in ['instanceMethods', 'staticMethods', 'instanceVariables', 'classVariables', 'enums']:
        if field in component and not isinstance(component[field], list):
            raise BlocksLibError(f'"{field}" in {filename} must be an array')


def is_sample_filename(filename: str) -> bool:
    """Returns True if the file is one of the files that is used in a sample."""
    return (filename in (SAMPLE_PROJECT_INFO_FILE, SAMPLE_DESCRIPTION_FILE)
            or SAMPLE_MODULE_FILENAME_PATTERN.match(filename) is not None)


def validate_samples(samples: Dict[str, Dict[str, Any]]) -> None:
    """Checks that each sample has the files that every project has."""
    for sample_name, files in samples.items():
        for filename in (SAMPLE_PROJECT_INFO_FILE, SAMPLE_ROBOT_FILE):
            if filename not in files:
                raise BlocksLibError(f'{SAMPLES_DIR}/{sample_name} must have a {filename} file')
        for filename, content in files.items():
            if not isinstance(content, dict):
                raise BlocksLibError(
                    f'{SAMPLES_DIR}/{sample_name}/{filename} must contain a JSON object')


def parse_wheel_filename(filename: str) -> Optional[Dict[str, str]]:
    """Returns the distribution name and version of a wheel, or None if it isn't a wheel."""
    m = WHEEL_FILENAME_PATTERN.match(filename)
    if not m:
        return None
    return {'name': m.group('name'), 'version': m.group('version')}


def get_wheel_top_level_modules(wheel_path: str) -> List[str]:
    """Returns the names of the top level python packages and modules in a wheel."""
    modules: Set[str] = set()
    with zipfile.ZipFile(wheel_path, 'r') as wheel:
        for name in wheel.namelist():
            top = name.split('/', 1)[0]
            if top.endswith('.dist-info') or top.endswith('.data'):
                continue
            if '/' not in name:
                if not top.endswith('.py'):
                    continue
                top = top[:-len('.py')]
            if top.isidentifier():
                modules.add(top)
    return sorted(modules)


def extract_blocks_lib(zip_path: str, dest_dir: str) -> Dict[str, Any]:
    """Validates the .blocks_lib file at zip_path and extracts it to dest_dir.

    Only metadata.json, wheels/*.whl, toolboxes/*.json, components/*.json, and the project files in
    samples/<SampleName>/ are extracted; anything else in the zip is ignored. Returns the metadata.
    """
    try:
        with zipfile.ZipFile(zip_path, 'r') as zf:
            names = zf.namelist()
            prefix = _find_root_prefix(names)
            try:
                metadata = json.loads(zf.read(prefix + METADATA_FILE).decode('utf-8'))
            except (ValueError, UnicodeDecodeError) as e:
                raise BlocksLibError(f'{METADATA_FILE} is not valid JSON: {e}')
            validate_metadata(metadata)

            os.makedirs(os.path.join(dest_dir, WHEELS_DIR), exist_ok=True)
            os.makedirs(os.path.join(dest_dir, TOOLBOXES_DIR), exist_ok=True)
            os.makedirs(os.path.join(dest_dir, COMPONENTS_DIR), exist_ok=True)
            with open(os.path.join(dest_dir, METADATA_FILE), 'w', encoding='utf-8') as f:
                json.dump(metadata, f, indent=2)

            json_file_count = 0
            samples: Dict[str, Dict[str, Any]] = {}
            for name in names:
                if not name.startswith(prefix):
                    continue
                relative = name[len(prefix):]
                parts = relative.split('/')
                # Because the directory and file names are checked against patterns that don't
                # allow '/' or '..', we never write outside of dest_dir.
                if len(parts) == 3 and parts[0] == SAMPLES_DIR:
                    _, sample_name, filename = parts
                    if not SAMPLE_NAME_PATTERN.match(sample_name) or not is_sample_filename(filename):
                        continue
                    try:
                        content = json.loads(zf.read(name).decode('utf-8'))
                    except (ValueError, UnicodeDecodeError) as e:
                        raise BlocksLibError(f'{relative} is not valid JSON: {e}')
                    samples.setdefault(sample_name, {})[filename] = content
                    continue
                # Other files are only used if they are directly inside wheels/, toolboxes/, or
                # components/.
                if len(parts) != 2:
                    continue
                directory, filename = parts
                if directory == WHEELS_DIR:
                    if not filename.endswith('.whl'):
                        continue
                    if not parse_wheel_filename(filename):
                        raise BlocksLibError(f'Invalid wheel filename "{filename}"')
                    with zf.open(name) as src, open(
                            os.path.join(dest_dir, WHEELS_DIR, filename), 'wb') as dst:
                        shutil.copyfileobj(src, dst)
                elif directory in (TOOLBOXES_DIR, COMPONENTS_DIR):
                    if not JSON_FILENAME_PATTERN.match(filename):
                        continue
                    try:
                        content = json.loads(zf.read(name).decode('utf-8'))
                    except (ValueError, UnicodeDecodeError) as e:
                        raise BlocksLibError(f'{relative} is not valid JSON: {e}')
                    if directory == TOOLBOXES_DIR:
                        validate_toolbox(content, relative)
                    else:
                        validate_component(content, relative)
                    with open(os.path.join(dest_dir, directory, filename), 'w',
                              encoding='utf-8') as f:
                        json.dump(content, f)
                    json_file_count += 1
            if json_file_count == 0 and not samples:
                raise BlocksLibError(
                    f'The library must contain at least one {TOOLBOXES_DIR}/*.json, '
                    f'{COMPONENTS_DIR}/*.json, or {SAMPLES_DIR}/<SampleName>/*.json file')
            validate_samples(samples)
            for sample_name, files in samples.items():
                sample_dir = os.path.join(dest_dir, SAMPLES_DIR, sample_name)
                os.makedirs(sample_dir, exist_ok=True)
                for filename, content in files.items():
                    with open(os.path.join(sample_dir, filename), 'w', encoding='utf-8') as f:
                        json.dump(content, f)
            return metadata
    except zipfile.BadZipFile:
        raise BlocksLibError('The library is not a valid zip file')


def install_blocks_lib(zip_path: str, libraries_dir: str) -> Dict[str, Any]:
    """Validates and installs the .blocks_lib file, replacing any library with the same name."""
    os.makedirs(libraries_dir, exist_ok=True)
    staging_dir = tempfile.mkdtemp(prefix='.staging-', dir=libraries_dir)
    try:
        metadata = extract_blocks_lib(zip_path, staging_dir)
        library_dir = os.path.join(libraries_dir, metadata['name'])
        if os.path.exists(library_dir):
            shutil.rmtree(library_dir)
        os.rename(staging_dir, library_dir)
        return load_library(library_dir)
    except Exception:
        shutil.rmtree(staging_dir, ignore_errors=True)
        raise


def _load_json_files(directory: str) -> Dict[str, Any]:
    """Returns the contents of the .json files in the directory, keyed by filename."""
    contents: Dict[str, Any] = {}
    if os.path.isdir(directory):
        for filename in sorted(os.listdir(directory)):
            if JSON_FILENAME_PATTERN.match(filename):
                with open(os.path.join(directory, filename), 'r', encoding='utf-8') as f:
                    contents[filename] = json.load(f)
    return contents


def load_library(library_dir: str) -> Dict[str, Any]:
    """Returns everything the frontend needs to know about an installed library."""
    with open(os.path.join(library_dir, METADATA_FILE), 'r', encoding='utf-8') as f:
        metadata = validate_metadata(json.load(f))

    toolboxes = _load_json_files(os.path.join(library_dir, TOOLBOXES_DIR))
    components = _load_json_files(os.path.join(library_dir, COMPONENTS_DIR))

    samples: Dict[str, Dict[str, Any]] = {}
    samples_dir = os.path.join(library_dir, SAMPLES_DIR)
    if os.path.isdir(samples_dir):
        for sample_name in sorted(os.listdir(samples_dir)):
            sample_dir = os.path.join(samples_dir, sample_name)
            if SAMPLE_NAME_PATTERN.match(sample_name) and os.path.isdir(sample_dir):
                samples[sample_name] = _load_json_files(sample_dir)

    wheels: List[str] = []
    python_modules: Set[str] = set()
    wheels_dir = os.path.join(library_dir, WHEELS_DIR)
    if os.path.isdir(wheels_dir):
        for filename in sorted(os.listdir(wheels_dir)):
            if parse_wheel_filename(filename):
                wheels.append(filename)
                python_modules.update(
                    get_wheel_top_level_modules(os.path.join(wheels_dir, filename)))

    return {
        'metadata': metadata,
        'toolboxes': toolboxes,
        'components': components,
        'samples': samples,
        'wheels': wheels,
        'pythonModules': sorted(python_modules),
    }


def list_libraries(libraries_dir: str) -> List[Dict[str, Any]]:
    """Returns all of the installed libraries, sorted by name. Broken libraries are skipped."""
    libraries = []
    if not os.path.isdir(libraries_dir):
        return libraries
    for name in sorted(os.listdir(libraries_dir)):
        library_dir = os.path.join(libraries_dir, name)
        if name.startswith('.') or not os.path.isdir(library_dir):
            continue
        try:
            libraries.append(load_library(library_dir))
        except (OSError, ValueError, BlocksLibError):
            continue
    return libraries


def remove_library(name: str, libraries_dir: str) -> bool:
    """Removes the installed library. Returns False if there is no such library."""
    if not LIBRARY_NAME_PATTERN.match(name):
        return False
    library_dir = os.path.join(libraries_dir, name)
    if not os.path.isdir(library_dir):
        return False
    shutil.rmtree(library_dir)
    return True


def find_imported_modules(python_dir: str) -> Set[str]:
    """Returns the top level module names imported by the .py files in python_dir."""
    imported: Set[str] = set()
    for root, _, files in os.walk(python_dir):
        for filename in files:
            if filename.endswith('.py'):
                with open(os.path.join(root, filename), 'r', encoding='utf-8') as f:
                    imported.update(IMPORT_PATTERN.findall(f.read()))
    return imported


def get_requirements_for_deploy(
        python_dir: str, libraries_dir: str, pip_cache_dir: str) -> List[str]:
    """Returns the pinned requirements for the libraries used by the code in python_dir.

    The wheels for those libraries are copied into pip_cache_dir, which is where the robotpy
    installer looks for packages when deploying locally.
    """
    imported = find_imported_modules(python_dir)
    requirements: List[str] = []
    for library in list_libraries(libraries_dir):
        if not imported.intersection(library['pythonModules']):
            continue
        wheels_dir = os.path.join(libraries_dir, library['metadata']['name'], WHEELS_DIR)
        for wheel in library['wheels']:
            os.makedirs(pip_cache_dir, exist_ok=True)
            cached_wheel = os.path.join(pip_cache_dir, wheel)
            if not os.path.exists(cached_wheel):
                shutil.copyfile(os.path.join(wheels_dir, wheel), cached_wheel)
            parsed = parse_wheel_filename(wheel)
            requirement = f'{parsed["name"]}=={parsed["version"]}'
            if requirement not in requirements:
                requirements.append(requirement)
    return requirements
