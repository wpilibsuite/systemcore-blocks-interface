# REV Robotics library

The REV Robotics hardware support that used to be built in to Blocks, as a third party library. See
`docs/blocks_lib_format.md` for the file format.

- `metadata.json` describes the library.
- `requirements.txt` lists the wheels, `robotpy-rev`, that `build.sh` downloads for the robot with
  `robotpy installer download`.
- `python/` is the `rev_blocks` package, which `build.sh` builds into a wheel. Its `SparkMax` is a
  `rev.SparkMax` that can be set up one setting at a time, with methods like `set_idle_mode`,
  `set_current_limit`, and `set_pid`, because the `rev.SparkMaxConfig` that `rev.SparkMax` is set
  up with is hard to use with blocks. Its constructor resets the Spark Max to its default settings
  and the settings aren't saved on the Spark Max, so the settings always come from the robot code.
  Its methods are named like the A301's, and its encoder methods return numbers rather than
  `Signal_double`. `copy_settings_from` gives a Spark Max all of the settings that another one has
  been given, so that a group of motors can be set up by setting up one of them.
- `components/a301.json`, `components/color_sensor_v3.json`, and `components/spark_max.json` add
  the `A301`, `ColorSensorV3`, and `SparkMax` (`rev_blocks.SparkMax`) components to **Components >
  + Component > REV Robotics**. A Spark Max can't be on a MotionCore CAN bus, so its port only
  offers the Systemcore's own CAN buses.
- `python_data/rev_rev_blocks.json` has the rest of the `rev` and `rev_blocks` modules that the
  library uses: the classes and enums that the components and the toolbox categories refer to,
  like `REVLibError`, and the classes that have toolbox categories.
- `python_toolbox.json` lists the modules and classes that get categories in the toolbox under
  **REV Robotics**: `A301`, `CIEColor`, `ColorMatch`, `ColorSensorV3` (with `RawColor`), and
  `SparkMax`.
  `build.sh` generates `toolboxes/` from it with `generate_python_toolboxes.mjs`, and adds the
  "More..." label to `locales/` in each language that Blocks has. Add a full module or class name,
  like `rev.ServoHub`, to `shownCategories` to give it a category, remove it from `ignore`, and
  regenerate. `ignore` lists the classes and enums that the library doesn't use, so that
  `generate_python_data.py` doesn't warn that they weren't generated. An enum in a class is only
  generated with its class, so a class can't be in `ignore` if something the library uses refers
  to one of its enums: `rev.SparkLowLevel` and `rev.SparkBaseConfig` aren't, for the `SparkMax`
  motor type and idle mode.
- `samples/DifferentialDrive301/` and `samples/MecanumRobot301/` are drivetrain samples that use
  A301 motors.

`components/` and `python_data/` are generated. Don't edit them; regenerate them with
`generate_python_data.py`, which has the component definitions for `A301`, `ColorSensorV3`, and
`SparkMax` and uses the generator in `python_tools/`. Run it with the `python_tools` venv (see
`python_tools/README.md`), with `robotpy-rev` installed from `requirements.txt`. It imports
`rev_blocks` from `python/`, so that doesn't need to be installed:

```bash
cd example_libraries/rev_robotics
source ../../python_tools/venv/bin/activate
pip install -r requirements.txt
python generate_python_data.py
```

Only the classes and enums that the library uses are written: the components, the modules and
classes in `shownCategories` in `python_toolbox.json`, and the classes and enums that those refer to
in their arguments, return types, and variables. The rest are listed in a warning, unless they are
in `ignore`. `--add_unused_to_ignore` adds all of them to `ignore` instead of warning.

`requirements.txt` is the only place with the version of `robotpy-rev`. `build.sh` downloads that
version's wheel for the robot, and it is the version the components and python data are generated
from.

## Building

From `example_libraries/`:

```bash
./build.sh rev_robotics
```

This builds the `rev_blocks` wheel, downloads the `robotpy-rev` wheel, which needs an internet connection, generates the toolboxes, which needs
`npm install` to have been run, and creates
`../build/rev_robotics.blocks_lib`. Upload it from **Manage > Libraries...** in Blocks.
