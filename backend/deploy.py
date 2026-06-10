# Standard library imports
import os
import shutil
import zipfile
import subprocess

from typing import Dict, List, Tuple, Union

# Third-party imports
from flask import request
from flask_restful import Resource

BASE_DIR = "/home/systemcore"
DEPLOY_DIR = BASE_DIR + "/pyFromBlocks"

STOP_ROBOT_CMD = ["sudo", "systemctl", "stop", "robot"]
START_ROBOT_CMD = ["sudo", "systemctl", "start", "robot"]

class DeployResource(Resource):
    def post(self) -> Union[Dict[str, Union[str, int, List[str]]], Tuple[Dict[str, str], int]]:
        """Upload and extract a zip file to the deploy directory"""
        if 'file' not in request.files:
            return {'error': 'No file provided'}, 400
        
        file = request.files['file']
        
        if file.filename == '':
            return {'error': 'No file selected'}, 400
        
        if not file.filename.endswith('.zip'):
            return {'error': 'Only zip files are allowed'}, 400
        
        try:            
            deploy_dir = DEPLOY_DIR
            
            # Stop the robot
            result = subprocess.run(STOP_ROBOT_CMD, 
                capture_output=True, 
                text=True, 
                check=True,
                timeout=10  # Best practice: always set a timeout to prevent hanging
            )
            
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

            # Make a robot command file
            robot_command_path = os.path.join(BASE_DIR, 'robotCommand')
            with open(robot_command_path, "w", encoding="utf-8") as robotCommandFile:
                robotCommandFile.write(BASE_DIR + "/venv/bin/python3 -u -O -m robotpy --main " + BASE_DIR + "/pyFromBlocks/robot.py run")

            os.chmod(robot_command_path, 0o755)
            # start the robot back
            result = subprocess.run(START_ROBOT_CMD, 
                capture_output=True, 
                text=True, 
                check=True,
                timeout=10  # Best practice: always set a timeout to prevent hanging
            )

            
            # List extracted files
            extracted_files = []
            for root, dirs, files in os.walk(deploy_dir):
                for filename in files:
                    rel_path = os.path.relpath(os.path.join(root, filename), deploy_dir)
                    extracted_files.append(rel_path)
            
            return {
                'message': 'Deployment successful',
                'deploy_directory': deploy_dir,
                'files_extracted': len(extracted_files),
                'files': extracted_files[:20]  # Show first 20 files
            }
        except zipfile.BadZipFile:
            return {'error': 'Invalid zip file'}, 400
        except Exception as e:
            return {'error': f'Deployment failed: {str(e)}'}, 500