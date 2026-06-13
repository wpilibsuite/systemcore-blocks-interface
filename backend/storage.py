# Standard library imports
from typing import Dict, List

# Third-party imports
from flask import Response, jsonify, request
from flask.views import MethodView

# Our imports
from extensions import db

# Storage models for key-value pairs and files
class StorageEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entry_key = db.Column(db.String(255), nullable=False, unique=True)
    entry_value = db.Column(db.Text, nullable=False)

    def to_dict(self) -> Dict[str, str]:
        return {
            'key': self.entry_key,
            'value': self.entry_value
        }

class StorageFile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    file_path = db.Column(db.String(500), nullable=False, unique=True)
    file_content = db.Column(db.Text, nullable=False)

    def to_dict(self) -> Dict[str, str]:
        return {
            'path': self.file_path,
            'content': self.file_content
        }

# Storage Resources for key-value and file operations
class StorageEntryResource(MethodView):
    def get(self, entry_key: str) -> Response:
        entry = StorageEntry.query.filter_by(entry_key=entry_key).first()
        if entry:
            return jsonify({'value': entry.entry_value})
        default_value = request.args.get('default', '')
        return jsonify({'value': default_value})

    def post(self, entry_key: str) -> Response:
        data = request.get_json()
        if not data or 'value' not in data:
            return jsonify({'error': 'Entry value is required'}), 400

        entry = StorageEntry.query.filter_by(entry_key=entry_key).first()
        if entry:
            entry.entry_value = data['value']
        else:
            entry = StorageEntry(entry_key=entry_key, entry_value=data['value'])
            db.session.add(entry)

        try:
            db.session.commit()
            return jsonify({'message': 'Entry saved successfully'})
        except Exception:
            db.session.rollback()
            return jsonify({'error': 'Failed to save entry'}), 500

class StorageResource(MethodView):
    def get(self, path: str) -> Response:
        if not path:
            path = ""

        if path.endswith('/') or path == "":
            if path == "":
                files = StorageFile.query.all()
                children = set()
                for file in files:
                    if '/' in file.file_path:
                        children.add(file.file_path.split('/')[0] + '/')
                    else:
                        children.add(file.file_path)
            else:
                files = StorageFile.query.filter(StorageFile.file_path.like(f'{path}%')).all()
                children = set()
                for file in files:
                    relative_path = file.file_path[len(path):]
                    if '/' in relative_path:
                        children.add(relative_path.split('/')[0] + '/')
                    else:
                        children.add(relative_path)

            return jsonify({'files': sorted(list(children))})
        else:
            file_obj = StorageFile.query.filter_by(file_path=path).first()
            if file_obj:
                return jsonify({'content': file_obj.file_content})
            return jsonify({'error': 'File not found'}), 404

    def post(self, path: str) -> Response:
        if path.endswith('/'):
            return jsonify({'error': 'Cannot save content to a directory path'}), 400

        data = request.get_json()
        if not data or 'content' not in data:
            return jsonify({'error': 'File content is required'}), 400

        file_obj = StorageFile.query.filter_by(file_path=path).first()
        if file_obj:
            file_obj.file_content = data['content']
        else:
            file_obj = StorageFile(file_path=path, file_content=data['content'])
            db.session.add(file_obj)

        try:
            db.session.commit()
            return jsonify({'message': 'File saved successfully'})
        except Exception:
            db.session.rollback()
            return jsonify({'error': 'Failed to save file'}), 500

    def delete(self, path: str) -> Response:
        if path.endswith('/'):
            files = StorageFile.query.filter(StorageFile.file_path.like(f'{path}%')).all()
            for file_obj in files:
                db.session.delete(file_obj)
        else:
            file_obj = StorageFile.query.filter_by(file_path=path).first()
            if not file_obj:
                return jsonify({'error': 'File not found'}), 404
            db.session.delete(file_obj)

        try:
            db.session.commit()
            return jsonify({'message': 'Deleted successfully'})
        except Exception:
            db.session.rollback()
            return jsonify({'error': 'Failed to delete'}), 500

class StorageFileRenameResource(MethodView):
    def post(self) -> Response:
        data = request.get_json()
        if not data or 'old_path' not in data or 'new_path' not in data:
            return jsonify({'error': 'Both old_path and new_path are required'}), 400

        old_path = data['old_path']
        new_path = data['new_path']

        if old_path.endswith('/'):
            files = StorageFile.query.filter(StorageFile.file_path.like(f'{old_path}%')).all()
            for file_obj in files:
                file_obj.file_path = file_obj.file_path.replace(old_path, new_path, 1)
        else:
            file_obj = StorageFile.query.filter_by(file_path=old_path).first()
            if not file_obj:
                return jsonify({'error': 'File not found'}), 404
            file_obj.file_path = new_path

        try:
            db.session.commit()
            return jsonify({'message': 'Renamed successfully'})
        except Exception:
            db.session.rollback()
            return jsonify({'error': 'Failed to rename'}), 500

class StorageRootResource(MethodView):
    def get(self) -> Response:
        files = StorageFile.query.all()
        children = set()
        for file in files:
            if '/' in file.file_path:
                children.add(file.file_path.split('/')[0] + '/')
            else:
                children.add(file.file_path)
        return jsonify({'files': sorted(list(children))})
