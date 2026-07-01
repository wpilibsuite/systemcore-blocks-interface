#!/bin/bash

source ../venv/bin/activate

# Note - this MUST match the port given in packaging/control/control
gunicorn --timeout 60 -b 0.0.0.0:9001 main:app
