# Blocks demo library

An example third party library. See `docs/blocks_lib_format.md` for the file format.

- `metadata.json` describes the library.
- `python/` is the `blocks_demo` Python package, with `blocks_demo.math_helpers` and
  `blocks_demo.text_helpers`.
- `toolboxes/math_helpers.json` is the **Demo Math** category, with a **Joystick Helpers**
  subcategory. It shows up in the toolbox under **Blocks Demo Library**.
- `toolboxes/text_helpers.json` is the **Demo Text** category, also under **Blocks Demo Library**.
- `components/limit_switch.json` and `components/gripper.json` add the `LimitSwitch` and `Gripper`
  components from `blocks_demo.components` to **Components > + Component > Blocks Demo Library**.
- `samples/GripperBot/` is a sample project, listed in **Samples...**, with a Gripper and a
  LimitSwitch in the Robot and a Teleop OpMode that uses them and the Demo Text blocks.

## Building

From `examples/`:

```bash
./build.sh blocks_lib_demo
```

This builds the wheel and creates `blocks_lib_demo/build/blocks_demo.blocks_lib`. Upload it from
**Manage > Libraries...** in Blocks.
