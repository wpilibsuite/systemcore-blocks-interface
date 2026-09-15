# Example libraries

Example third party `.blocks_lib` libraries. See `docs/blocks_lib_format.md` for the file format.

| Directory          | Library             | Toolbox categories                               | Components                             |
|--------------------|---------------------|--------------------------------------------------|----------------------------------------|
| `blocks_lib_demo/` | Blocks Demo Library | Demo Math (with Joystick Helpers), Demo Text     | LimitSwitch, Gripper                   |
| `field_sensors/`   | Field Sensors       |                                                  | BeamBreak, Bumper, UltrasonicSensor    |
| `led_effects/`     | LED Effects         | None: its blocks are directly under LED Effects  |                                        |
| `pid_tools/`       | PID Tools           | PID Tuning                                       | SimplePID                              |

Each example has a `metadata.json`, a Python package in `python/`, and `toolboxes/` and/or
`components/` directories. All of them except PID Tools set a `color`, so you can see how library
colors look in the toolbox, and that `color` is optional.

## Building

```bash
./build.sh                  # builds all of the examples
./build.sh pid_tools        # builds one example
```

Each library is written to `<example>/build/<name>.blocks_lib`. Upload them from
**Manage > Libraries...** in Blocks.
