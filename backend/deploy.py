# Standard library imports
import os
import shutil
import zipfile
import subprocess

from typing import List

# Third-party imports
from flask import Response, jsonify, request
from flask.views import MethodView

BASE_DIR = "/home/systemcore"
DEPLOY_DIR = BASE_DIR + "/pyFromBlocks"

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
                f.write('[tool.robotpy]\n')
                f.write('robotpy_version = "2027.0.0a6.post1"\n')
                f.write('\n')
                f.write('components = []\n')
                f.write('\n')
                f.write('requires = [ "blocks_base_classes", "robotpy-rev" ]\n')

            # Deploy robot code
            subprocess.run(
                ["robotpy", "installer", "local-deploy", "--force-install"],
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
