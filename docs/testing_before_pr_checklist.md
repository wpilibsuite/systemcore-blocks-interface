For each PR, make sure the categories that are appropriate for your PR have been tested

# For every PR
* [ ] Ran `npm run tscheck` and `npm run test` and they passed
* [ ] Verified there are no new errors in the javascript console while using the change

# If it is a bug fix
* [ ] Reproduced the bug before the change
* [ ] Verified the bug is fixed after the change

# If it adds or modifies a block
* [ ] Added the block
* [ ] Verified that the python code generated is appropriate
* [ ] Put it on Systemcore and verified that an opmode with the block works correctly

# If it affects code generation for existing block
* [ ] Opened a project saved before the change that already uses the block
* [ ] Verified that the python code generated is appropriate
* [ ] Put it on Systemcore and verified that an opmode with the block still works correctly

# If it is a blocks style change
* [ ] Verified that each type of connection displays correctly
* [ ] Visually inspected each toolbox
* [ ] Added a screenshot to the PR

# If it is a theme change
* [ ] Verified that visually it makes the change
* [ ] Added a screenshot to the PR

# If it is a UI change
* [ ] Checked it in both a light and a dark theme
* [ ] Checked it in at least one other language (longer strings shouldn't overflow)
* [ ] Added a screenshot to the PR

# If it adds or changes user-visible text
* [ ] Added the key to every file in `frontend/i18n/locales/` (no `|| 'fallback'`)

# If it changes the toolbox
* [ ] Checked the toolbox while editing the Robot, a Mechanism, and an OpMode

# If it is a new feature
* [ ] Tested the feature
* [ ] If it touches storage or deploy, tested it both with and without the backend
* [ ] Verified the feature doesn't break
    * [ ] Creating a new project
    * [ ] Creating mechanism in new project
    * [ ] Creating opmode in new project

# If it is plumbing between modules
* [ ] Ran through [testing_before_release_checklist.md](testing_before_release_checklist.md)

# If it changes libraries (blocks_lib)
* [ ] Made the matching change in both `frontend/libraries/blocks_lib.ts` and `backend/blocks_lib.py`
* [ ] Ran through the Libraries section of [testing_before_release_checklist.md](testing_before_release_checklist.md)

# If it regenerates the WPILib JSON
* [ ] Reviewed the diff of the regenerated JSON

# If it is a change to the backend
* [ ] Verified that deploy still works on Systemcore
* [ ] Disconnected the robot and verified the warning comes on
* [ ] Reconnected and verified the warning goes away

# If it changes storage format
* [ ] Bumped `CURRENT_VERSION` in `upgrade_project.ts`
* [ ] Verified the migration works by creating a document in the old format and running the migration
* [ ] Tested with and without the backend
