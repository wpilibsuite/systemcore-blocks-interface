# Storage API

A Flask-based REST API for providing storage capabilities (key-value pairs and file storage) using SQLite as the database.

## Features

- **Key-Value Storage**: Store and retrieve key-value pairs on the robot
- **File Storage**: Store, retrieve, list, rename, and delete files and directories
- **SQLite Database**: Persistent storage using SQLite
- **CORS Support**: Cross-origin resource sharing for frontend integration

## API Endpoints

### Key-Value Storage (Entries)

These are for values that belong to the robot, so they are shared by everyone who connects to it. The frontend doesn't use them at the moment: user settings are specific to a user, so they are kept in the browser instead.

- `GET /entries/<entry_key>` - Fetch entry value by key (supports `?default=value` query param)
- `POST /entries/<entry_key>` - Save entry value
- `DELETE /entries/<entry_key>` - Delete entry (deleting an entry that doesn't exist is not an error)

### File and Directory Operations

- `GET /storage/<path>` - List directory contents (if path ends with `/`) or fetch file content (if path doesn't end with `/`)
- `POST /storage/<path>` - Save file content (path must not end with `/`)
- `DELETE /storage/<path>` - Delete file or directory
- `POST /storage/rename` - Rename file or directory

## Setup
    1. cd <your repo>/backend
    2. python3.12 -m venv ./venv
    3. source ./venv/bin/activate
    4. python3.12 -m pip install -r requirements.txt
    5. deactivate

## Running the Application (for debugging)
    1. source ./venv/bin/activate
    2. python main.py
    3. The API will be available at `http://localhost:5001`

## Running the Application (on systemcore)
    1. source ./venv/bin/activate
    2. gunicorn -b 0.0.0.0:8000 main:app
    3. The API will be available on port 8000

## Example Usage

### Key-Value Operations (Entries)

#### Save an Entry
```bash
curl -X POST http://localhost:5001/entries/team_number \
  -H "Content-Type: application/json" \
  -d '{"value": "1234"}'
```

#### Fetch an Entry
```bash
curl http://localhost:5001/entries/team_number
```

#### Fetch an Entry with Default Value
```bash
curl "http://localhost:5001/entries/missing_key?default=default_value"
```

### File and Directory Operations

#### Save a File
```bash
curl -X POST http://localhost:5001/storage/projects/robot1/main.py \
  -H "Content-Type: application/json" \
  -d '{"content": "# Robot main file\nprint(\"Hello Robot!\")"}'
```

#### Fetch a File
```bash
curl http://localhost:5001/storage/projects/robot1/main.py
```

#### List Files in Directory
```bash
curl http://localhost:5001/storage/projects/
```

#### Rename a File
```bash
curl -X POST http://localhost:5001/storage/rename \
  -H "Content-Type: application/json" \
  -d '{"old_path": "projects/robot1/main.py", "new_path": "projects/robot1/robot_main.py"}'
```

#### Rename a Directory
```bash
curl -X POST http://localhost:5001/storage/rename \
  -H "Content-Type: application/json" \
  -d '{"old_path": "projects/robot1/", "new_path": "projects/my_robot/"}'
```

#### Delete a File
```bash
curl -X DELETE http://localhost:5001/storage/projects/robot1/old_file.py
```

#### Delete a Directory
```bash
curl -X DELETE http://localhost:5001/storage/projects/old_project/
```

## Data Models

### StorageEntry (Key-Value Storage)
- `id`: Integer (Primary Key)
- `entry_key`: String (Unique, Required)
- `entry_value`: Text (Required)

### StorageFile (File Storage)
- `id`: Integer (Primary Key)
- `file_path`: String (Unique, Required)
- `file_content`: Text (Required)

## Database

The application creates a SQLite database file `storage.db` in the backend directory automatically when first run.

## CORS Support

The API includes CORS (Cross-Origin Resource Sharing) headers to allow frontend applications running on different ports to access the API. This is essential for development when the frontend runs on a different port than the backend.

## Frontend Integration

The server-side storage implementation in `frontend/storage/server_side_storage.ts` connects to this Flask backend. It implements the `Storage` interface with methods for:

- File operations (`saveFile`, `fetchFileContentText`, `list`, `rename`, `delete`), which use this backend
- Key-value entries (`saveEntry`, `fetchEntry`, `deleteEntry`, `listEntryKeys`), which don't use this backend. They hold user settings, which are specific to a user, so they are kept in the browser storage that `ServerSideStorage` is given.

Example usage in TypeScript:
```typescript
import { openClientSideStorage } from './storage/client_side_storage';
import { ServerSideStorage } from './storage/server_side_storage';

const storage = new ServerSideStorage(await openClientSideStorage());

// File operations
await storage.saveFile('projects/robot1/main.py', 'print("Hello Robot!")');
const content = await storage.fetchFileContentText('projects/robot1/main.py');
const files = await storage.list('projects/');
```
