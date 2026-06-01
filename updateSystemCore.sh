#!/bin/sh

# Update the backend (but without the venv)
rsync -avz --exclude 'venv' backend systemcore@robot.local:/opt/blocks

# Make sure dist is up to date
npm run build

# Now send the dist folder
rsync -avz dist systemcore@robot.local:/opt/blocks