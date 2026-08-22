# Standard library imports
import glob
import os
import re
import shutil
import zipfile
import subprocess


# Third-party imports
from flask import Response, jsonify, request
from flask.views import MethodView

BASE_DIR = "/home/systemcore"
DEPLOY_DIR = BASE_DIR + "/blocks/deployedPython"
PIP_CACHE_DIR = "/opt/blocks/cache/pip_cache"


def getWpilibBlocksRequirement() -> str:
    """Returns the wpilib_blocks requirement, pinned to whatever version's wheel is
    present in the local pip cache. Pinning to the exact version already on disk
    (rather than leaving it unpinned) is what makes the installer notice and
    reinstall wpilib_blocks when a new version has been packaged; an unpinned
    requirement is treated as satisfied by any installed version and never
    triggers a reinstall."""
    matches = glob.glob(os.path.join(PIP_CACHE_DIR, 'wpilib_blocks-*.whl'))
    if not matches:
        return "wpilib_blocks"
    m = re.match(r'wpilib_blocks-([^-]+)-', os.path.basename(matches[0]))
    if not m:
        return "wpilib_blocks"
    return f"wpilib_blocks=={m.group(1)}"


class DeployResource(MethodView):
    def post(self) -> Response:
        """Upload and extract a zip file to the deploy directory"""
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400

        if not file.filename.endswith('.zip'):
            return jsonify({'error': 'Only zip files are allowed'}), 400

        try:
            deploy_dir = DEPLOY_DIR

            # Clear existing deploy directory
            if os.path.exists(deploy_dir):
                shutil.rmtree(deploy_dir)
            # Create deploy directory if it doesn't exist
            os.makedirs(deploy_dir)

            # Save the zip file temporarily
            temp_zip_path = os.path.join(BASE_DIR, 'temp_deploy.zip')
            file.save(temp_zip_path)

            # Extract the zip file
            with zipfile.ZipFile(temp_zip_path, 'r') as zip_ref:
                zip_ref.extractall(deploy_dir)

            # Remove the temporary zip file
            os.remove(temp_zip_path)

            # Write pyproject.toml
            pyproject_path = os.path.join(deploy_dir, 'pyproject.toml')
            with open(pyproject_path, "w", encoding="utf-8") as f:
                toml_content = (
f"""[tool.robotpy]
robotpy_version = "2027.0.0.a6.post1"

components = []

requires = [ "{getWpilibBlocksRequirement()}", "robotpy-rev"]
"""
                )
                f.write(toml_content);
            # Deploy robot code
            subprocess.run(
                # --yes means answer yes to all questions asked without prompting user
                # this makes for a silent deploy
                ["robotpy", "installer", "local-deploy", "--yes"],
                capture_output=True,
                text=True,
                check=True,
                timeout=60,
                cwd=deploy_dir
            )

            return jsonify({
                'message': 'Deployment successful',
                'deploy_directory': deploy_dir
            })
        except zipfile.BadZipFile:
            return jsonify({'error': 'Invalid zip file'}), 400
        except Exception as e:
            return jsonify({'error': f'Deployment failed: {str(e)}'}), 500
