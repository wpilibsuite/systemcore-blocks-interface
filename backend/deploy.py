# Standard library imports
import os
import shutil
import zipfile

# Third-party imports
from flask import request
from flask_restful import Resource

# Our imports
from main import basedir

class DeployResource(Resource):
    def post(self):
        """Upload and extract a zip file to the deploy directory"""
        if 'file' not in request.files:
            return {'error': 'No file provided'}, 400
        
        file = request.files['file']
        
        if file.filename == '':
            return {'error': 'No file selected'}, 400
        
        if not file.filename.endswith('.zip'):
            return {'error': 'Only zip files are allowed'}, 400
        
        try:
            # Create deploy directory if it doesn't exist
            deploy_dir = os.path.join(basedir, 'deploy')
            
            # Clear existing deploy directory
            if os.path.exists(deploy_dir):
                shutil.rmtree(deploy_dir)
            os.makedirs(deploy_dir)
            
            # Save the zip file temporarily
            temp_zip_path = os.path.join(basedir, 'temp_deploy.zip')
            file.save(temp_zip_path)
            
            # Extract the zip file
            with zipfile.ZipFile(temp_zip_path, 'r') as zip_ref:
                zip_ref.extractall(deploy_dir)
            
            # Remove the temporary zip file
            os.remove(temp_zip_path)
            
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