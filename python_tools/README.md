# Python Tools

## To generate JSON for the robotpy modules and classes:

The following instructions work on macOS Sonoma 14.6.1.

### Setup
    1. cd <your repo>/python_tools
    1. python3.12 -m venv ./venv
    1. source ./venv/bin/activate
    1. python3.12 -m pip install -r requirements.txt
    1. deactivate

### To Regenerate robotpy_data.json
    1. cd <your repo>/python_tools
    1. python3.12 -m venv ./venv
    1. source ./venv/bin/activate
    1. python3.12 generate_json.py --output_directory=../src/blocks/utils
    1. deactivate
