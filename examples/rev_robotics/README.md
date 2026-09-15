# REV Robotics library

The REV Robotics hardware support that used to be built in to Blocks, as a third party library. See
`docs/blocks_lib_format.md` for the file format.

- `metadata.json` describes the library.
- `requirements.txt` lists the wheels, `robotpy-rev`, that `build.sh` downloads for the robot with
  `robotpy installer download`. There is no `python/` package, because the Python code is
  `robotpy-rev` itself.
- `components/a301.json` and `components/color_sensor_v3.json` add the `A301` and `ColorSensorV3`
  components to **Components > + Component > REV Robotics**.
- `python_data/rev.json` has the rest of the `rev` module that the library uses: the classes and
  enums that the components and the toolbox categories refer to, like `REVLibError`, and the
  classes that have toolbox categories.
- `python_toolbox.json` lists the modules and classes that get categories in the toolbox under
  **REV Robotics**: `A301`, `CIEColor`, `ColorMatch`, and `ColorSensorV3` (with `RawColor`).
  `build.sh` generates `toolboxes/` from it with `generate_python_toolboxes.mjs`, and adds the
  "More..." label to `locales/` in each language that Blocks has. Add a full module or class name,
  like `rev.ServoHub`, to `shownCategories` to give it a category, remove it from `ignore`, and
  regenerate. `ignore` lists the classes and enums that the library doesn't use, so that
  `generate_python_data.py` doesn't warn that they weren't generated.
- `samples/DifferentialDrive301/` and `samples/MecanumRobot301/` are drivetrain samples that use
  A301 motors.

`components/` and `python_data/` are generated. Don't edit them; regenerate them with
`generate_python_data.py`, which has the component definitions for `A301` and `ColorSensorV3` and
uses the generator in `python_tools/`. Run it with the `python_tools` venv (see
`python_tools/README.md`), with `robotpy-rev` installed from `requirements.txt`:

```bash
cd examples/rev_robotics
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

From `examples/`:

```bash
./build.sh rev_robotics
```

This downloads the wheel, which needs an internet connection, generates the toolboxes, which needs
`npm install` to have been run, and creates
`rev_robotics/build/rev_robotics.blocks_lib`. Upload it from **Manage > Libraries...** in Blocks.
