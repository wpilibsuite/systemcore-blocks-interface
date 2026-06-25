# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Blockly-based visual programming interface for FTC robotics teams running on WPILib/SystemCore. Students drag-and-drop blocks to write Python robot code, which is then deployed to a robot running on SystemCore (a Raspberry Pi-class device at `robot.local`).

## Development Commands

```bash
npm install          # Install dependencies
npm run start        # Dev server at localhost:3000 (also: npm run dev)
npm run build        # Production build into dist/
npm run test         # Run browser tests (Playwright/Vitest)
npm run tscheck      # TypeScript type checking (no emit)
npm run gen          # Regenerate block definitions from JSON
```

### Backend (Python/Flask) — needed for server-side storage and deploy

```bash
cd backend
python3.12 -m venv ./venv && source ./venv/bin/activate
pip install -r requirements.txt
python main.py       # Dev server at localhost:5001
```

### Regenerating WPILib block data

```bash
cd python_tools && source venv/bin/activate
python3.12 generate_json.py --output_directory=../frontend/blocks/utils
```

## Architecture

### Storage abstraction (`frontend/storage/common_storage.ts`)

A `Storage` interface is implemented by two backends:
- `client_side_storage.ts` — browser localStorage, used in dev/standalone mode
- `server_side_storage.ts` — REST calls to the Flask backend, used on SystemCore

All project data (Blockly workspace state + metadata) is stored as JSON through this interface. Projects live at `projects/<ProjectName>/`.

### Project data model (`frontend/storage/`)

A **Project** contains one **Robot**, zero or more **Mechanisms**, and zero or more **OpModes** — all called **Modules**. Each module is stored as a JSON file (`*.robot.json`, `*.mechanism.json`, `*.opmode.json`) with:
- Blockly workspace serialization (blocks)
- Extracted metadata: components, events, methods, mechanisms-in-robot

`module_content.ts` parses/serializes these files. `upgrade_project.ts` contains versioned migrations; bump `CURRENT_VERSION` and add a migration function when the storage format changes.

### Editor (`frontend/editor/editor.ts`)

The `Editor` class wraps a Blockly `WorkspaceSvg` and owns one module. It:
- Listens to Blockly workspace events (create, move, mutator-open) and dispatches them to custom blocks via duck-typed methods (`mrcOnLoad`, `mrcOnCreate`, `mrcOnMove`, etc.)
- Drives toolbox updates based on the current module type and what's defined in sibling modules
- Generates Python via `extendedPythonGenerator` and serializes back to storage on save

Two static maps (`workspaceIdToEditor`, `modulePathToEditor`) allow blocks in one workspace to look up data from other open workspaces.

### Custom blocks (`frontend/blocks/`)

Every custom block is in a `mrc_*.ts` file. Each file exports `setup()` and optionally `BLOCK_NAME` + `pythonFromBlock` for Python codegen. All blocks must be registered in `setup_custom_blocks.ts`.

Blocks communicate with the `Editor` through the duck-typed event methods listed above — not direct imports — to avoid circular dependencies.

### Toolbox (`frontend/toolbox/`)

The toolbox is rebuilt dynamically on every relevant workspace change. `toolbox.ts:getToolboxJSON()` switches on `ModuleType` (ROBOT/MECHANISM/OPMODE) and assembles categories from `hardware_category`, `event_category`, and `driver_station_category`. The toolbox contents reflect live workspace state (e.g., which components/mechanisms have been added).

### Python code generation (`frontend/editor/extended_python_generator.ts`)

Extends Blockly's built-in `PythonGenerator`. The generator runs when saving or deploying. Each module type produces a single Python class file. The "Deploy" action zips all generated `.py` files and POSTs to `POST /deploy` on the backend.

### Backend (`backend/`)

Flask + Flask-RESTful app. Key endpoints:
- `GET/POST /storage/<path>` — file and directory operations backed by SQLite (`projects.db`)
- `GET/POST /entries/<key>` — key-value settings storage
- `POST /deploy` — receives a zip, stops the robot service, extracts to `/home/systemcore/pyFromBlocks/`, rewrites `robotCommand`, restarts the robot

## Coding Standards

- Google TypeScript style
- Do not add new npm packages without explicit permission
- All variables in Blockly workspaces become class instance variables in the generated Python
- Each Blockly workspace maps to exactly one Python class/file

## Adding a New Custom Block

1. Create `frontend/blocks/mrc_<name>.ts` exporting `setup()`, `BLOCK_NAME`, and `pythonFromBlock`
2. Register it in `frontend/blocks/setup_custom_blocks.ts`
3. Add it to the appropriate toolbox category in `frontend/toolbox/`
4. Add i18n keys to `frontend/i18n/locales/` and reference them via `tokens.ts`

## Deploying to SystemCore

See `docs/running_on_systemcore.md` for initial setup. After setup, `./scripts/updateSystemcore.sh` syncs the repo and built assets; then refresh the browser at `http://robot.local:9001`.

## PR Testing Checklist

See `docs/testing_before_pr_checklist.md` — covers creating projects/opmodes/mechanisms, adding components, verifying toolbox contents, event handler visibility, and deploy zip validation.
