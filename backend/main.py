from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_sqlalchemy import SQLAlchemy
import json
import os

app = Flask(__name__)
api = Api(app)

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "projects.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text)
    modules = db.relationship('Module', backref='project', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'module_count': len(self.modules)
        }

class Module(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    json_content = db.Column(db.Text, nullable=False)
    
    __table_args__ = (db.UniqueConstraint('name', 'project_id', name='_module_project_uc'),)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'project_id': self.project_id,
            'json_content': json.loads(self.json_content) if self.json_content else {}
        }

# Resources
class ProjectListResource(Resource):
    def get(self):
        """Get list of all projects"""
        projects = Project.query.all()
        return {'projects': [project.to_dict() for project in projects]}
    
    def post(self):
        """Create a new project"""
        data = request.get_json()
        if not data or 'name' not in data:
            return {'error': 'Project name is required'}, 400
        
        # Check if project already exists
        existing_project = Project.query.filter_by(name=data['name']).first()
        if existing_project:
            return {'error': 'Project with this name already exists'}, 409
        
        project = Project(
            name=data['name'],
            description=data.get('description', '')
        )
        
        try:
            db.session.add(project)
            db.session.commit()
            return project.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to create project'}, 500

class ProjectResource(Resource):
    def get(self, project_id):
        """Get a specific project with its modules"""
        project = Project.query.get_or_404(project_id)
        project_dict = project.to_dict()
        project_dict['modules'] = [
            {
                'id': module.id,
                'name': module.name
            } for module in project.modules
        ]
        return project_dict
    
    def put(self, project_id):
        """Update a project"""
        project = Project.query.get_or_404(project_id)
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
        
        if 'name' in data:
            # Check if another project has this name
            existing = Project.query.filter(Project.name == data['name'], Project.id != project_id).first()
            if existing:
                return {'error': 'Project with this name already exists'}, 409
            project.name = data['name']
        
        if 'description' in data:
            project.description = data['description']
        
        try:
            db.session.commit()
            return project.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update project'}, 500
    
    def delete(self, project_id):
        """Delete a project and all its modules"""
        project = Project.query.get_or_404(project_id)
        
        try:
            db.session.delete(project)
            db.session.commit()
            return {'message': 'Project deleted successfully'}
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to delete project'}, 500

class ModuleListResource(Resource):
    def get(self, project_id):
        """Get all modules for a project"""
        project = Project.query.get_or_404(project_id)
        modules = Module.query.filter_by(project_id=project_id).all()
        return {
            'project': project.to_dict(),
            'modules': [module.to_dict() for module in modules]
        }
    
    def post(self, project_id):
        """Create a new module in a project"""
        project = Project.query.get_or_404(project_id)
        data = request.get_json()
        
        if not data or 'name' not in data:
            return {'error': 'Module name is required'}, 400
        
        if 'json_content' not in data:
            return {'error': 'JSON content is required'}, 400
        
        # Check if module already exists in this project
        existing_module = Module.query.filter_by(name=data['name'], project_id=project_id).first()
        if existing_module:
            return {'error': 'Module with this name already exists in this project'}, 409
        
        # Validate JSON content
        try:
            json_content = json.dumps(data['json_content'])
        except (TypeError, ValueError):
            return {'error': 'Invalid JSON content'}, 400
        
        module = Module(
            name=data['name'],
            project_id=project_id,
            json_content=json_content
        )
        
        try:
            db.session.add(module)
            db.session.commit()
            return module.to_dict(), 201
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to create module'}, 500

class ModuleResource(Resource):
    def get(self, project_id, module_id):
        """Get a specific module"""
        module = Module.query.filter_by(id=module_id, project_id=project_id).first_or_404()
        return module.to_dict()
    
    def put(self, project_id, module_id):
        """Update a module's content"""
        module = Module.query.filter_by(id=module_id, project_id=project_id).first_or_404()
        data = request.get_json()
        
        if not data:
            return {'error': 'No data provided'}, 400
        
        if 'name' in data:
            # Check if another module in this project has this name
            existing = Module.query.filter(
                Module.name == data['name'], 
                Module.project_id == project_id,
                Module.id != module_id
            ).first()
            if existing:
                return {'error': 'Module with this name already exists in this project'}, 409
            module.name = data['name']
        
        if 'json_content' in data:
            try:
                json_content = json.dumps(data['json_content'])
                module.json_content = json_content
            except (TypeError, ValueError):
                return {'error': 'Invalid JSON content'}, 400
        
        try:
            db.session.commit()
            return module.to_dict()
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to update module'}, 500
    
    def delete(self, project_id, module_id):
        """Delete a module"""
        module = Module.query.filter_by(id=module_id, project_id=project_id).first_or_404()
        
        try:
            db.session.delete(module)
            db.session.commit()
            return {'message': 'Module deleted successfully'}
        except Exception as e:
            db.session.rollback()
            return {'error': 'Failed to delete module'}, 500

# Register API routes
api.add_resource(ProjectListResource, '/projects')
api.add_resource(ProjectResource, '/projects/<int:project_id>')
api.add_resource(ModuleListResource, '/projects/<int:project_id>/modules')
api.add_resource(ModuleResource, '/projects/<int:project_id>/modules/<int:module_id>')

@app.route('/')
def index():
    return jsonify({
        'message': 'Project and Module Management API',
        'endpoints': {
            'projects': '/projects',
            'specific_project': '/projects/<project_id>',
            'project_modules': '/projects/<project_id>/modules',
            'specific_module': '/projects/<project_id>/modules/<module_id>'
        }
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)