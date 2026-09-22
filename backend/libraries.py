# Standard library imports
import os
import tempfile

# Third-party imports
from flask import Response, jsonify, request
from flask.views import MethodView

# Our imports
import blocks_lib
from config import LIBRARIES_DIR

BLOCKS_LIB_EXTENSION = '.blocks_lib'


class LibrariesResource(MethodView):
    def get(self) -> Response:
        """List the installed libraries"""
        return jsonify({'libraries': blocks_lib.list_libraries(LIBRARIES_DIR)})

    def post(self) -> Response:
        """Install a .blocks_lib file, replacing any installed library with the same name"""
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400

        file = request.files['file']
        if not file.filename or not file.filename.endswith(BLOCKS_LIB_EXTENSION):
            return jsonify({'error': f'Only {BLOCKS_LIB_EXTENSION} files are allowed'}), 400

        fd, temp_path = tempfile.mkstemp(suffix=BLOCKS_LIB_EXTENSION)
        os.close(fd)
        try:
            file.save(temp_path)
            library = blocks_lib.install_blocks_lib(temp_path, LIBRARIES_DIR)
            return jsonify({'library': library})
        except blocks_lib.BlocksLibError as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            return jsonify({'error': f'Failed to install library: {str(e)}'}), 500
        finally:
            os.remove(temp_path)


class LibraryResource(MethodView):
    def delete(self, name: str) -> Response:
        """Remove an installed library"""
        if not blocks_lib.remove_library(name, LIBRARIES_DIR):
            return jsonify({'error': 'Library not found'}), 404
        return jsonify({'message': 'Library removed'})
