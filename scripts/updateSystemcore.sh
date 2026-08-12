#!/bin/sh

cd "$(dirname "$0")/.."

# Update the backend (but without the venv)
rsync -avz --exclude 'venv' backend systemcore@robot.local:/opt/blocks

# Make sure dist is up to date
npm run build

# Now send the dist folder
rsync -avz dist systemcore@robot.local:/opt/blocks

# Now send the base class blocks folder
rsync -avz --exclude '__pycache__' --exclude 'wpilib_blocks.egg-info' runtime_python/wpilib_blocks systemcore@robot.local:/opt/blocks/
