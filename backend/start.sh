#!/bin/bash

source ../venv/bin/activate

# Note - this MUST match the port given in packaging/control/control
# --threads lets requests such as the /statusz heartbeat and saves be handled while a deploy runs.
gunicorn --threads 4 --timeout 60 -b 0.0.0.0:9001 main:app
