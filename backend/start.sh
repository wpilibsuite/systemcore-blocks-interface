#!/bin/bash

# Note - this MUST match the port given in packaging/control/control
source ../venv/bin/activate
which robotpy
gunicorn -b 0.0.0.0:9001 main:app
