#!/bin/bash

# Note - this MUST match the port given in packaging/control/control
gunicorn -b 0.0.0.0:9001 main:app
