# Standard library imports
import argparse
import os

# Third-party imports
from flask import Flask, jsonify, request, send_from_directory
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy

# Our imports
from deploy import DeployResource
from storage import StorageEntryResource, StorageFileRenameResource, StorageRootResource, StorageResource

app = Flask(__name__, static_folder='../dist', static_url_path='')
app.url_map.merge_slashes = False  # Don't merge consecutive slashes
api = Api(app)
db = SQLAlchemy(app)

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

# Register API routes
# Storage API routes (more specific routes first)
api.add_resource(StorageEntryResource, '/entries/<path:entry_key>')
api.add_resource(StorageFileRenameResource, '/storage/rename')
api.add_resource(StorageRootResource, '/storage/')
api.add_resource(StorageResource, '/storage/<path:path>')
api.add_resource(DeployResource, '/deploy')

# API health check endpoint to distinguish from static file serving
@app.route('/api/status')
def api_status():
    """Health check endpoint to identify backend server"""
    return jsonify({
        'status': 'ok',
        'server': 'python-backend',
        'version': '1.0'
    })

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