#!/bin/bash

# Note - this MUST match the port given in packaging/control/control
# TODO - after getting the build that has gunicorn in it, this won't use the venv anymore
/opt/blocks/venv/bin/gunicorn -b 0.0.0.0:9001 main:app
