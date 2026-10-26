# Problem
Without some sort of versioning support, a team is limited to remembering to download a project
and save it off the robot (or making a copy on the robot) before making a change.   Even with this,
there is no easy way to see the visual difference between the changes.

Also, making a full copy of the projects leads to bloat of repeated pieces that don't change.

# Proposed Solution
* Under the projects there is a /versions/versionId that would have its own
'version.info.json' which would have the description, the save date, and what files are in it.
* Under the projects there is a /versions/objects that have each module with its SHA256 hash
    * Each object is named `<sha256>` (with no extension), and `version.info.json` has `files` (file name → hash) and `complete`
    * The hash uses `@noble/hashes`, because the browser's `crypto.subtle` only works in secure
    contexts and the robot is served over http
* Stored versions and objects are never changed.  A version saved with an older project format is upgraded in memory when it is compared or restored.

# Saving and cleaning up
There is no locking between students using the same robot, so the order of the steps matters.
* Creating a version:
    1. Save `version.info.json` with `complete: false`
    2. Save the objects that aren't already stored
    3. Check again, and save any that were deleted in the meantime
    4. Save `version.info.json` with `complete: true`
* Versions that aren't complete aren't listed.  If one is still incomplete an hour after it was
created (for example, the browser was closed while saving), it is deleted.
* Deleting a version deletes its `version.info.json` and then garbage collects: it lists the
objects *first*, then reads every `version.info.json` (including incomplete ones), and deletes the listed objects that none of them use.  Since a version's `version.info.json` is saved before its objects, an object that is listed always belongs to a `version.info.json` that is read.

# Restores
* Before restoring: restoring into the current project first saves the current state as a "Before restoring …" version, so a restore can always be undone.
* What a restore changes:
  * It keeps the project's projectId, so open tabs and zoom settings still apply.
  * It brings back the version's gamepad config.
  * It deletes modules that were added after the version was made.
* Editors have to close first: the project is closed (setCurrentProject(null)) before any files are written. Otherwise an open editor's autosave can save its old blocks over the restored ones. This is the rule most likely to get broken by a future refactor.
* Restore as a New Project also exists, and gives the new project a fresh projectId and no versions.
* Restore is only offered when comparing against the currrent projects and they don't match

# Important Notes
* Renaming a project takes along the versions.
* Copying a project takes along only the most current
* Deleting a project gets rid of all versions
* Downloading a project only downloads the most current version
* All objects are local to a project.  (ie, even if a module is identical across projects there is 
 a copy per project)
* Modules are compared by ID, so a renamed module is still compared with itself
* Only the outermost added or removed block is marked
* Moved top-level stacks count as a change. (but not in the next/previous change)

# Diffs
* Show all added/deleted/changed blocks
    * Allow to go next/previous change
* Show moved blocks
    * But don't allow going there
* Allow locked scrolling together for looking at the difference
    * Also, allow to be unlocked 
* If modules are identical, show as one large view instead of 2 smaller ones


# Known limitations
* No merging - this is a see what is different only
* Deleting a version is O(number of versions) to see if it can delete objects as garbage collection.
This is considered to be ok, because the number of versions should never be astronomically large.
* For now, this only handles deduplication at the module level.  So even changing a single number,
means the entire module is saved again.
* Recreated blocks: because blocks are matched by id, a block that's deleted and then recreated identically shows as removed plus added, not unchanged.
* Shared by everyone on the robot: versions belong to the robot's project, not to a student. Anyone using the robot sees and can delete them. 
* Deleting a version can't be undone.
* If a version is created at exactly the same time another one is deleted, the garbage collection could still delete an object the new version uses.  Comparing or restoring that version would then fail with an error.

# UI plan
* For the first version, have a list of versions that you can compare to each other, edit the 
description or delete.
* On deploying or downloading, prompt for whether a version should be created

# Future UI ideas
* Allow settings for saving versions automatically
* Filtering ideas to find a version in a lot of versions
    * Favorites (per user) - this would have to be stored in browser settings
    * Date/time filtering
    * Hide versions that are less than x older than the one after it
* Allowing bulk delete
* Allow setting left/right for diffs ( a la code search by Google - https://cs.android.com/android/_/android/platform/hardware/google/camera/+/cd15337bd229dd521a860d88bca3e37c3ca845f7:common/hal/common/hal_types.h )



