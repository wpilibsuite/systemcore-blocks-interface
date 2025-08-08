# Project and Module Management API

A Flask-based REST API for managing projects and modules with JSON content, using SQLite as the database.

## Features

- **Projects**: Create, read, update, and delete projects
- **Modules**: Create, read, update, and delete modules within projects
- **JSON Content**: Each module stores JSON content as a string
- **SQLite Database**: Persistent storage using SQLite

## API Endpoints

### Projects

- `GET /projects` - Get list of all projects
- `POST /projects` - Create a new project
- `GET /projects/<project_id>` - Get a specific project with module list
- `PUT /projects/<project_id>` - Update a project
- `DELETE /projects/<project_id>` - Delete a project and all its modules

### Modules

- `GET /projects/<project_id>/modules` - Get all modules for a project
- `POST /projects/<project_id>/modules` - Create a new module in a project
- `GET /projects/<project_id>/modules/<module_id>` - Get a specific module
- `PUT /projects/<project_id>/modules/<module_id>` - Update a module
- `DELETE /projects/<project_id>/modules/<module_id>` - Delete a module

## Running the Application

1. Install dependencies:
   ```bash
   pip install flask flask-restful flask-sqlalchemy
   ```

2. Run the application:
   ```bash
   python main.py
   ```

3. The API will be available at `http://localhost:5001`

## Example Usage

### Create a Project
```bash
curl -X POST http://localhost:5001/projects \
  -H "Content-Type: application/json" \
  -d '{"name": "Robot Controller", "description": "Main robot control project"}'
```

### Create a Module
```bash
curl -X POST http://localhost:5001/projects/1/modules \
  -H "Content-Type: application/json" \
  -d '{"name": "motor_controller", "json_content": {"type": "motor", "settings": {"speed": 100}}}'
```

### Get All Projects
```bash
curl http://localhost:5001/projects
```

### Get Project Modules
```bash
curl http://localhost:5001/projects/1/modules
```

### Update Module Content
```bash
curl -X PUT http://localhost:5001/projects/1/modules/1 \
  -H "Content-Type: application/json" \
  -d '{"json_content": {"type": "motor", "settings": {"speed": 150}}}'
```

## Data Models

### Project
- `id`: Integer (Primary Key)
- `name`: String (Unique, Required)
- `description`: Text (Optional)
- `modules`: Relationship to Module objects

### Module
- `id`: Integer (Primary Key)
- `name`: String (Required, Unique per project)
- `project_id`: Integer (Foreign Key)
- `json_content`: Text (Required, stored as JSON string)

## Database

The application creates a SQLite database file `projects.db` in the backend directory automatically when first run.
