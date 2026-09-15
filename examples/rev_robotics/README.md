# REV Robotics library

The REV Robotics hardware support that used to be built in to Blocks, as a third party library. See
`docs/blocks_lib_format.md` for the file format.

- `metadata.json` describes the library.
- `requirements.txt` lists the wheels, `robotpy-rev`, that `build.sh` downloads for the robot with
  `robotpy installer download`. There is no `python/` package, because the Python code is
  `robotpy-rev` itself.
- `components/a301.json` and `components/color_sensor_v3.json` add the `A301` and `ColorSensorV3`
  components to **Components > + Component > REV Robotics**.
- `python_data/rev.json` is the rest of the `rev` module: its enums, the classes that the
  components' methods use, and the other classes.
- `python_toolbox.json` lists the modules and classes that get categories in the toolbox under
  **REV Robotics**: `A301`, `CIEColor`, `ColorMatch`, and `ColorSensorV3` (with `RawColor`).
  `build.sh` generates `toolboxes/` from it with `generate_python_toolboxes.mjs`, and adds the
  "More..." label to `locales/` in each language that Blocks has. Add a full module or class name,
  like `rev.ServoHub`, to give it a category.
- `samples/DifferentialDrive301/` and `samples/MecanumRobot301/` are drivetrain samples that use
  A301 motors.

`components/` and `python_data/` are generated. Don't edit them; regenerate them with
`python_tools/generate_json.py` (see `python_tools/README.md`).

## Building

From `examples/`:

```bash
./build.sh rev_robotics
```

This downloads the wheel, which needs an internet connection, generates the toolboxes, which needs
`npm install` to have been run, and creates
`rev_robotics/build/rev_robotics.blocks_lib`. Upload it from **Manage > Libraries...** in Blocks.
