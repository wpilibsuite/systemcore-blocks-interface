# Python Tools

## To generate JSON for the robotpy modules and classes:

The following instructions work on macOS Sonoma 14.6.1.

### Setup
    1. cd <your repo>/python_tools
    1. python3.12 -m venv ./venv
    1. source venv/bin/activate
    1. python3.12 -m pip install -r requirements.txt
    1. deactivate

### To Regenerate robotpy_data.json
    1. cd <your repo>/python_tools
    1. source venv/bin/activate
    1. python3.12 generate_json.py --output_directory=../frontend/blocks/utils
    1. deactivate

### Generating third party libraries

`JsonGenerator.writeBlocksLibFiles` in json_util.py writes the `components/` and `python_data/` of
a third party library from Python modules. The REV Robotics example library uses it, in
example_libraries/rev_robotics/generate_python_data.py; see example_libraries/rev_robotics/README.md.

### To run tests
    1. cd <your repo>/python_tools
    1. source venv/bin/activate
    1. pytest ../runtime_python/
    1. deactivate
