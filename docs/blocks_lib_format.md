# Third party libraries (`.blocks_lib`)

A third party can add blocks and components to the toolbox, backed by their own Python code, and
sample projects that use them, by publishing a `.blocks_lib` file. Users install it from **Manage > Libraries...**, where they can also
remove libraries and choose which libraries, categories, and components are shown in the toolbox.

See `example_libraries/` for complete, buildable examples (`example_libraries/build.sh` builds them).

## File layout

A `.blocks_lib` file is a zip file:

```
metadata.json
wheels/
    my_library-1.0.0-py3-none-any.whl
toolboxes/
    my_category.json
    another_category.json
components/
    my_sensor.json
python_data/
    my_library.json
samples/
    MySampleRobot/
        description.json
        project.info.json
        Robot.robot.json
        Teleop.opmode.json
locales/
    en.json
    es.json
```

A library needs at least one file in `toolboxes/`, `components/`, or `samples/`. `python_data/`
doesn't count, because it only describes Python code that the other files use.

It's fine for everything to be inside a single top level folder (which is what you get when you
zip a folder with Finder or Explorer). Other files are ignored.

## `metadata.json`

| Field           | Type    | Required | Description |
|-----------------|---------|----------|-------------|
| `formatVersion` | integer | yes      | Version of the `.blocks_lib` format. Currently `1`. |
| `name`          | string  | yes      | Unique name. Letters, digits, `_`, `.` and `-`. Installing a library with the same name replaces the installed one. |
| `displayName`   | string  | no       | Name shown to users. Defaults to `name`. |
| `color`         | string  | no       | Brand color for the library, as `#RRGGBB` (for example `"#1E88E5"`). The library's category in the toolbox and its category under **+ Component** use this color. |
| `version`       | string  | yes      | Version of the library. |
| `author`        | string  | yes      | |
| `summary`       | string  | yes      | One line description. |
| `details`       | string  | yes      | Longer description. Newlines are preserved. |
| `blocksVersion` | string  | yes      | [semver range](https://github.com/npm/node-semver#ranges) of Blocks versions the library works with, for example `">=0.4.0 <1.0.0"`. |

A library whose `blocksVersion` doesn't match can't be installed. If Blocks is later upgraded to a
version that doesn't match, the library is marked incompatible and its blocks are left out of the
toolbox.

## `wheels/`

Python wheels that are installed on the robot. Because the robot installs packages without internet
access, include every dependency that isn't already on the robot. Wheels must be built for the
robot (pure Python `py3-none-any` wheels always work). Wheels with compiled code have to be built
for SystemCore; `robotpy installer download --no-deps <package>` downloads them, which is what the
REV Robotics example does.

When a project is deployed, the backend looks at the `import` statements in the generated code. For
each library that provides an imported top level package, every wheel in the library is copied into
the robot's pip cache and added to `requires` in `pyproject.toml`, pinned to the wheel's version
(for example `"my_library==1.0.0"`).

## `toolboxes/`

In the toolbox, everything from a library is put under a category named after the library (its
`displayName`). Each `*.json` file contains one of these:

- A [Blockly toolbox category](https://developers.google.com/blockly/guides/configure/web/toolboxes/category)
  (`"kind": "category"` with a `name`), which becomes a subcategory under the library's name.
  Categories can contain blocks and nested categories. Each category shows up in the Libraries
  dialog so users can hide it.
- A [flyout toolbox](https://developers.google.com/blockly/guides/configure/web/toolboxes/flyout)
  (`"kind": "flyoutToolbox"`), for libraries that don't want subcategories. Its blocks go directly
  under the library's name. It can't contain categories, but it can use labels to group blocks:

  ```json
  {
    "kind": "flyoutToolbox",
    "contents": [
      {"kind": "label", "text": "Rainbow"},
      {"kind": "block", "type": "..."}
    ]
  }
  ```

  These blocks don't have their own check box in the Libraries dialog; they are hidden with the
  library.

A library can have both kinds of files. The blocks from flyout toolboxes are listed before the
library's categories.

Any block type that Blocks knows about can be used. To call a function in your wheel, use
`mrc_call_python_function` with `functionKind` `module`:

```json
{
  "kind": "block",
  "type": "mrc_call_python_function",
  "extraState": {
    "functionKind": "module",
    "returnType": "float",
    "args": [
      {"name": "value", "type": "float"},
      {"name": "low", "type": "float"},
      {"name": "high", "type": "float"}
    ],
    "tooltip": "Limits value so that it is between low and high.",
    "importModule": "my_library.math_helpers",
    "moduleOrClassName": "my_library.math_helpers"
  },
  "fields": {
    "MODULE_OR_CLASS": "my_library.math_helpers",
    "FUNC": "clamp"
  },
  "inputs": {
    "ARG0": {"shadow": {"type": "math_number", "fields": {"NUM": 0}}},
    "ARG1": {"shadow": {"type": "math_number", "fields": {"NUM": -1}}},
    "ARG2": {"shadow": {"type": "math_number", "fields": {"NUM": 1}}}
  }
}
```

This generates `import my_library.math_helpers` and `my_library.math_helpers.clamp(0, -1, 1)`.

- `returnType` is a Python type (`int`, `float`, `str`, `bool`, ...) or `None` for a function that
  doesn't return a value, which makes a statement block instead of a value block.
- `args` must list every argument in order. `inputs` provides the default blocks plugged into
  them, as `ARG0`, `ARG1`, and so on.
- `importModule` and `moduleOrClassName` must be the same full module name.

## `components/`

Each `*.json` file describes one component class. Library components show up in the robot and in
mechanisms under **Components > + Component**, in a subcategory named after the library (its
`displayName`), and their methods show up under each component that the user adds. Users can hide all of a library's
components, or individual ones, in the Libraries dialog. Hiding a component only removes it from
**+ Component**; components that were already added keep working.

The format is the same as the classes in `frontend/blocks/utils/generated/robotpy_data.json`:

```json
{
  "className": "my_library.components.LimitSwitch",
  "moduleName": "my_library.components",
  "constructors": [
    {
      "functionName": "__init__",
      "tooltip": "A limit switch plugged into a Smart IO port.",
      "args": [
        {"name": "channel", "type": "int"},
        {"name": "pressed_is_high", "type": "bool", "defaultValue": "True"}
      ],
      "isComponent": true,
      "componentArgs": [
        {"name": "smart_io_port", "type": "SYSTEMCORE_SMART_IO_PORT"},
        {"name": "pressed_is_high", "type": "bool", "defaultValue": "True"}
      ]
    }
  ],
  "instanceMethods": [
    {
      "functionName": "is_pressed",
      "tooltip": "Returns True if the limit switch is pressed.",
      "args": [{"name": "self", "type": "my_library.components.LimitSwitch"}],
      "returnType": "bool",
      "isCommon": true
    }
  ]
}
```

This generates `import my_library.components` and, in the robot:

```python
self.my_limit_switch = my_library.components.LimitSwitch(
  0, # smart i/o
  True, # pressed_is_high
)
```

- `className` must be the full name of the class, starting with `moduleName`.
- At least one constructor needs `"isComponent": true` and `componentArgs`. `componentArgs` are
  what the user fills in on the component block, in the order they are passed to the constructor.
  Their `type` is either a Python type (`int`, `float`, `str`, `bool`, ...) or a port type from
  `PortType` in `frontend/blocks/utils/python_json_types.ts`. Port types can be combined with `__`;
  each port type in the combination is passed as a separate argument. For example
  `SYSTEMCORE_USB_PORT__EXPANSION_HUB_SERVO_PORT` passes the USB port and then the servo channel.
- The first arg of each instance method is `self`. `returnType` defaults to `None`.
- `isCommon` methods are listed first in the toolbox.
- `staticMethods`, `instanceVariables`, `classVariables`, and `enums` are optional and use the same
  format as the generated data.

## `python_data/`

Blocks has to know about the Python modules and classes that blocks use, not just the component
classes. For example, a component method might return an object whose fields can be read, take an
enum as an argument, or return a subclass of a built in class. Each `*.json` file in
`python_data/` describes Python modules and classes in the same format as
`frontend/blocks/utils/generated/robotpy_data.json`. Every field is optional:

```json
{
  "modules": [
    {
      "moduleName": "my_library",
      "enums": [
        {
          "enumClassName": "my_library.Mode",
          "moduleName": "my_library",
          "enumValues": ["FAST", "SLOW"],
          "tooltip": ""
        }
      ],
      "functions": [],
      "moduleVariables": []
    }
  ],
  "classes": [
    {
      "className": "my_library.Reading",
      "moduleName": "my_library",
      "instanceVariables": [
        {"name": "value", "type": "float", "writable": false, "tooltip": ""}
      ]
    }
  ],
  "aliases": {
    "my_library.meters": "float"
  },
  "subclasses": {
    "wpilib.MotorController": ["my_library.MyMotor"]
  }
}
```

- `modules` and `classes` use the same format as the generated data, and the classes use the same
  format as `components/`. Classes in `python_data/` aren't components; put component classes in
  `components/`.
- `aliases` maps type names to the types they are aliases for.
- `subclasses` maps a class name to the names of its subclasses. Blocks that take the class also
  accept the subclasses, and a library can add subclasses to a built in class.

Python data doesn't add anything to the toolbox by itself, and it isn't shown with the built in
RobotPy modules in the toolbox settings. To give users blocks for its classes, add them to
`toolboxes/`. The REV Robotics example generates those toolbox files when it is built: its
`python_toolbox.json` lists the modules and classes to make categories for, like the ones that can
be chosen in the toolbox settings, and `example_libraries/generate_python_toolboxes.mjs` makes a category
for each of them, with the same blocks as the built in RobotPy categories.

`JsonGenerator.writeBlocksLibFiles` in `python_tools/json_util.py` generates this data from Python
modules. The REV Robotics example (`example_libraries/rev_robotics/`) is generated this way from
`robotpy-rev` by its `generate_python_data.py`, which writes the component classes to `components/`, and the classes
and enums that the components and `shownCategories` refer to, to `python_data/`. Classes and enums
that nothing uses aren't written, to keep the library small; they are listed in `ignore` in
`python_toolbox.json`.

## `samples/`

Each directory in `samples/` is a sample project. The samples of installed libraries are listed in
**Samples...** after the built in samples, with a tag showing the library they came from. Users can
preview them and create a new project from them, just like the built in samples. When the library
is removed, its samples are no longer listed; projects that were already created from them are
kept.

The directory name is the sample's name, which is also the default name of a project created from
it, so it must be a valid project name (it starts with an uppercase letter and only has letters,
digits, and `_`). The files are the same as the built in samples in `frontend/samples/`:

- `project.info.json` and `Robot.robot.json` are required.
- `*.mechanism.json` and `*.opmode.json` files are the project's mechanisms and OpModes.
- `description.json` is optional:

  ```json
  {
    "description": "An arm that is moved to a position by a PID controller.",
    "tags": ["arm", "PID"]
  }
  ```

Other files are ignored. The easiest way to make a sample is to install your library, build the
project in Blocks, and use **Download Current Project** in **Manage > Projects...**. The downloaded
file is a zip of the project's files: unzip it into `samples/<SampleName>/` and add a
`description.json`.

## `locales/`

Libraries can be translated into the languages that Blocks is shown in (`en`, `es`, `fr`, and
`he`). Each `locales/<language>.json` file has the library's messages in that language, as JSON
objects that can be nested, like Blocks' own locale files:

```json
{
  "NAME": "My Library",
  "TOOLBOX": {
    "MATH": "My Math"
  },
  "TOOLTIPS": {
    "CLAMP": "Limits value so that it is between low and high."
  }
}
```

To translate a string, replace it with a reference to a message, `%{KEY}`, where `KEY` is the
dotted path to the message, for example `"name": "%{TOOLBOX.MATH}"`. The whole string has to be the
reference; any other string is shown as it is, so a library doesn't have to translate everything.
These strings can be references:

| File                               | Strings                                                    |
|------------------------------------|------------------------------------------------------------|
| `metadata.json`                    | `displayName`, `summary`, `details`                        |
| `toolboxes/*.json`                 | the `name` of each category, the `text` of each label, every `tooltip` |
| `components/*.json`                | every `tooltip`                                            |
| `samples/<SampleName>/description.json` | `description`, each of the `tags`                     |

Names that are used in the generated code, like class, function, and argument names, and the
sample's name, can't be translated. Neither can anything in `python_data/`.

- A library that has references needs `locales/en.json`, and it has to have every message that is
  referred to. Other languages can leave messages out.
- A message is shown in the user's language. If it isn't translated into that language, the English
  message is shown.
- Tooltips are saved in the blocks in users' projects as references that include the library name,
  like `%{my_library:TOOLTIPS.CLAMP}`, and are translated when they are shown. If you make a sample
  with blocks that have translated tooltips, its module files will have these references.
- Text in a sample's module files, like an OpMode's description, becomes part of the user's project
  when they create a project from the sample, so it can't be translated. A library can have a
  separate sample for each language instead.
- Changing a category name to a reference changes how Blocks remembers whether the user hid that
  category, so the category is shown again once.

## Testing

Blocks can't check that the functions and classes in your wheel match the blocks and components
in your library, so test the generated code on a robot.
