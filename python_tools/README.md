# Python Tools

## To generate JSON for the robotpy modules and classes:

The following instructions work on macOS Sonoma 14.6.1.

### Setup
    1. cd <your repo>/python_tools
    1. python3.12 -m venv ./venv
    1. source venv/bin/activate
    1. python3.12 -m pip install -r requirements.txt
    1. deactivate

### To Regenerate robotpy_data.json and the REV Robotics example library
    1. cd <your repo>/python_tools
    1. source venv/bin/activate
    1. python3.12 generate_json.py --output_directory=../frontend/blocks/utils --rev_library_directory=../examples/rev_robotics
    1. deactivate

The rev module isn't built in. Its component classes are written to
examples/rev_robotics/components/ and the rest of the module is written to
examples/rev_robotics/python_data/rev.json. Leave out --rev_library_directory to only regenerate
the built in json.

### To run tests
    1. cd <your repo>/python_tools
    1. source venv/bin/activate
    1. pytest ../runtime_python/
    1. deactivate
