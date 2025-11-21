from flask import Flask, request, jsonify, send_from_directory
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
import json
import os
import argparse
import zipfile
import shutil
from werkzeug.utils import secure_filename

app = Flask(__name__, static_folder='../dist', static_url_path='')
app.url_map.merge_slashes = False  # Don't merge consecutive slashes
api = Api(app)

# Add CORS headers
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.before_request
def handle_preflight():
    if request.method == "OPTIONS":
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        return response

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "projects.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Storage models for key-value pairs and files
class StorageEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entry_key = db.Column(db.String(255), nullable=False, unique=True)
    entry_value = db.Column(db.Text, nullable=False)
    
    def to_dict(self):
        return {
            'key': self.entry_key,
            'value': self.entry_value
        }

class StorageFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String(500), nullable=False, unique=True)
    file_content = db.Column(db.Text, nullable=False)
    
    def to_dict(self):
        return {
            'path': self.file_path,
            'content': self.file_content
        }

# Storage Resources for key-value and file operations
class StorageEntryResource(Resource):
    def get(self, entry_key):
        """Fetch entry value by key"""
        entry = StorageEntry.query.filter_by(entry_key=entry_key).first()
        if entry:
            return {'value': entry.entry_value}
        else:
            # Return default value if provided in query params
            default_value = request.args.get('default', '')
            return {'value': default_value}
    
    def post(self, entry_key):
        """Save entry value"""
        data = request.get_json()
        if not data or 'value' not in data:
            return {'error': 'Entry value is required'}, 400
        
        entry = StorageEntry.query.filter_by(entry_key=entry_key).first()
        if entry:
            entry.entry_value = data['value']
        else:
            entry = StorageEntry(entry_key=entry_key, entry_value=data['value'])
            db.session.add(entry)
        
        try:
            db.session.commit()
            return {'message': 'Entry saved successfully'}
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to save entry'}, 500

class StorageResource(Resource):
    def get(self, path):
        """Get file content or list directory based on path"""
        # Handle empty path as root directory
        if not path:
            path = ""
        
        if path.endswith('/') or path == "":
            # List directory
            # For root directory, find all files
            if path == "":
                files = StorageFile.query.all()
                # Extract top-level files and directories
                children = set()
                for file in files:
                    if '/' in file.file_path:
                        # It's in a subdirectory, add the directory name
                        dir_name = file.file_path.split('/')[0] + '/'
                        children.add(dir_name)
                    else:
                        # It's a top-level file
                        children.add(file.file_path)
            else:
                # Find all files that start with this path
                files = StorageFile.query.filter(StorageFile.file_path.like(f'{path}%')).all()
                
                # Extract immediate children (not nested)
                children = set()
                for file in files:
                    relative_path = file.file_path[len(path):]
                    if '/' in relative_path:
                        # It's in a subdirectory, add the directory name
                        dir_name = relative_path.split('/')[0] + '/'
                        children.add(dir_name)
                    else:
                        # It's a direct child file
                        children.add(relative_path)
            
            return {'files': sorted(list(children))}
        else:
            # Get file content
            file_obj = StorageFile.query.filter_by(file_path=path).first()
            if file_obj:
                return {'content': file_obj.file_content}
            else:
                return {'error': 'File not found'}, 404
    
    def post(self, path):
        """Save file content (only for files, not directories)"""
        if path.endswith('/'):
            return {'error': 'Cannot save content to a directory path'}, 400
        
        data = request.get_json()
        if not data or 'content' not in data:
            return {'error': 'File content is required'}, 400
        
        file_obj = StorageFile.query.filter_by(file_path=path).first()
        if file_obj:
            file_obj.file_content = data['content']
        else:
            file_obj = StorageFile(file_path=path, file_content=data['content'])
            db.session.add(file_obj)
        
        try:
            db.session.commit()
            return {'message': 'File saved successfully'}
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to save file'}, 500
    
    def delete(self, path):
        """Delete file or directory"""
        if path.endswith('/'):
            # Delete directory (all files starting with this path)
            files = StorageFile.query.filter(StorageFile.file_path.like(f'{path}%')).all()
            for file_obj in files:
                db.session.delete(file_obj)
        else:
            # Delete specific file
            file_obj = StorageFile.query.filter_by(file_path=path).first()
            if not file_obj:
                return {'error': 'File not found'}, 404
            db.session.delete(file_obj)
        
        try:
            db.session.commit()
            return {'message': 'Deleted successfully'}
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to delete'}, 500

class StorageFileRenameResource(Resource):
    def post(self):
        """Rename file or directory"""
        data = request.get_json()
        if not data or 'old_path' not in data or 'new_path' not in data:
            return {'error': 'Both old_path and new_path are required'}, 400
        
        old_path = data['old_path']
        new_path = data['new_path']
        
        if old_path.endswith('/'):
            # Rename directory (all files starting with old_path)
            files = StorageFile.query.filter(StorageFile.file_path.like(f'{old_path}%')).all()
            for file_obj in files:
                new_file_path = file_obj.file_path.replace(old_path, new_path, 1)
                file_obj.file_path = new_file_path
        else:
            # Rename specific file
            file_obj = StorageFile.query.filter_by(file_path=old_path).first()
            if not file_obj:
                return {'error': 'File not found'}, 404
            file_obj.file_path = new_path
        
        try:
            db.session.commit()
            return {'message': 'Renamed successfully'}
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to rename'}, 500

class StorageRootResource(Resource):
    def get(self):
        """List all top-level files and directories"""
        files = StorageFile.query.all()
        # Extract top-level files and directories
        children = set()
        for file in files:
            if '/' in file.file_path:
                # It's in a subdirectory, add the directory name
                dir_name = file.file_path.split('/')[0] + '/'
                children.add(dir_name)
            else:
                # It's a top-level file
                children.add(file.file_path)
        
        return {'files': sorted(list(children))}

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

# Register API routes
# Storage API routes (more specific routes first)
api.add_resource(StorageEntryResource, '/entries/<path:entry_key>')
api.add_resource(StorageFileRenameResource, '/storage/rename')
api.add_resource(StorageRootResource, '/storage/')
api.add_resource(StorageResource, '/storage/<path:path>')
api.add_resource(DeployResource, '/deploy')

# Handle the base path for the frontend
@app.route('/blocks/', defaults={'path': ''})
@app.route('/blocks/<path:path>')
@app.route('/blocks//<path:path>')  # Handle double slash
def serve_frontend(path):
    """Serve static assets from dist/ directory with base path"""
    # Normalize path - remove leading slashes and clean up double slashes
    path = path.lstrip('/')
    
    # Debug logging
    print(f"Requested path: '{path}'")
    
    # If path is empty, serve index.html
    if path == '':
        try:
            return send_from_directory(app.static_folder, 'index.html')
        except Exception as e:
            print(f"Error serving index.html: {e}")
            return jsonify({
                'error': 'Frontend not built',
                'message': 'Please build the frontend first with "npm run build"'
            }), 404
    
    # Try to serve the requested file
    try:
        print(f"Attempting to serve: {app.static_folder}/{path}")
        return send_from_directory(app.static_folder, path)
    except Exception as e:
        print(f"Error serving file: {e}")
        # If file not found and not an asset, serve index.html for client-side routing
        # But if it's an asset or known file type, return 404
        if path.startswith('assets/') or '.' in path.split('/')[-1]:
            return jsonify({'error': f'File not found: {path}'}), 404
        try:
            return send_from_directory(app.static_folder, 'index.html')
        except:
            return jsonify({'error': 'File not found'}), 404

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_static(path):
    """Serve static assets from dist/ directory"""
    # If path is empty, serve index.html
    if path == '':
        try:
            return send_from_directory(app.static_folder, 'index.html')
        except Exception as e:
            return jsonify({
                'error': 'Frontend not built',
                'message': 'Please build the frontend first with "npm run build"',
                'api_info': {
                    'endpoints': {
                        'entries': '/entries/<entry_key>',
                        'storage': '/storage/<path>',
                        'storage_rename': '/storage/rename'
                    }
                }
            }), 404
    
    # Try to serve the requested file
    try:
        return send_from_directory(app.static_folder, path)
    except Exception as e:
        # If file not found, serve index.html for client-side routing
        try:
            return send_from_directory(app.static_folder, 'index.html')
        except:
            return jsonify({'error': 'File not found'}), 404

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run the Storage API backend server')
    parser.add_argument('-p', '--port', type=int, default=5001, 
                        help='Port to run the server on (default: 5001)')
    args = parser.parse_args()
    
    with app.app_context():
        db.create_all()
    
    print(f"Starting server on port {args.port}...")
    app.run(debug=True, port=args.port)