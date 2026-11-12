# Problem
Without some sort of versioning support, a team is limited to remembering to download a project
and save it off the robot (or making a copy on the robot) before making a change.   Even with this,
there is no easy way to see the visual difference between the changes.

Also, making a full copy of the projects leads to bloat of repeated pieces that haven't changed.

# Proposed Solution
* Under the projects there is a /versions/versionId.json file which would have the description, the tags, the notes, the save date, and what files are in it.
* Under the projects there is a /versions/objects that have each module with its SHA256 hash
    * Each object is named `<sha256>` (with no extension), and `versionId.json` has `files` (file name → hash) and `complete`
    * The hash uses `@noble/hashes`, because the browser's `crypto.subtle` only works in secure
    contexts and the robot is served over http
* Stored objects are never changed, and neither are the files a version lists; only a version's description, tags, and notes can be edited.  A version saved with an older project format is upgraded in memory when it is compared or restored.

# Tags
* A version has a list of tags (strings) as well as its description.  Versions saved before tags existed have none.
* Deploying (or downloading) offers to create a version tagged `deployed` (or `downloaded`) with no description.  If the project hasn't changed since the newest version, that version gets the tag instead, without asking.
* The built-in tags are saved untranslated and shown translated.  Tags typed by users are saved as typed.
* The built-in tags are system tags: users can't add them to a version (including by typing their name or its translation) or remove them, so a `deployed` tag always means the version was deployed.  `updateVersion` keeps a version's system tags and ignores new ones.

# Notes
* A version can also have notes: longer, optional text, shown in the version's details.  The description is the short line that identifies the version in lists and titles.  Versions saved before notes existed have none.

# Saving and cleaning up
There is no locking between students using the same robot, so the order of the steps matters.
* Creating a version:
    1. Save `versionId.json` with `complete: false`
    2. Save the objects that aren't already stored
    3. Check again, and save any that were deleted in the meantime
    4. Save `versionId.json` with `complete: true`
* Versions that aren't complete aren't listed.  If one is still incomplete an hour after it was
created (for example, the browser was closed while saving), it is deleted.
* Deleting a version deletes its `versionId.json` and then garbage collects: it lists the
objects *first*, then reads every `versionId.json` (including incomplete ones), and deletes the listed objects that none of them use.  Since a version's `versionId.json` is saved before its objects, an object that is listed always belongs to a `versionId.json` that is read.

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
* Every added or removed block is outlined, but a group of them (a block with the blocks inside
  and after it that were added or removed too) is one change for next/previous change
* A block moved out of a removed block into an added block (like a component's port when the
  component is moved into a mechanism) is part of both groups, not changed
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

# UI
* Above the list of versions (and its filters) is a "Current" bar for the project as it is now, with View and Create Version buttons.  It isn't a row of the table, since it isn't filtered or paged.
* The list can be searched (descriptions, notes, and tags) and filtered by description ("Only those [with | without] a description": a checkbox, rather than a choice that includes "any", since the search and other filters still apply when it is unchecked), by date (radio buttons, each with its inputs always shown and dimmed until chosen, so nothing appears or disappears: any time; within the last (<=), or older than (>), a number of days, which starts at 14, with a switch like the AND/OR one that shows the symbol and has the words in its tooltip; or chosen dates), and by tags (with an AND/OR switch, as in Samples, for whether a version must have every chosen tag or any of them).  Each filter can say either side (with or without a description, within or older than), so there is no need for a way to invert the filters.  The filters are hidden behind a Filter button so the list isn't intimidating; while they are shown, 5 versions are shown on each page instead of 10, so everything fits without scrolling (showing or hiding them keeps the version that was at the top of the page on the page); when the list is filtered, "Showing X of Y versions" stays visible even with the filters hidden.  The filters are reset and hidden when the dialog is opened.
* Each version's description, tags, and notes can be edited, and it can be deleted.
* Bulk delete: Clean Up (a broom, at the bottom of the Versions dialog) opens a dialog for deleting several versions.  It has the same filters as the list (shown from the start, since finding versions is what it is for), and checkboxes; clicking a row selects it.  "Select all <n>" selects every version the filters show, on every page (the count makes that clear, since only one page is visible), so the filters can be used to pick what to delete.  It starts with the filters set to the versions most often cleaned up: no description, older than 14 days.  Only selected versions that are shown are deleted; the confirmation gives the count and how many of them were deployed.  `deleteVersions` deletes all of the info files and then garbage collects once.
* Clicking a version shows its details: its blocks (read-only, but blocks can be copied), and buttons to restore it, save it as a new project, download it, and compare it with Current or with another version.
* Clicking Current shows the same details for the project as it is now, except for what doesn't apply: it has no date, tags, or description to edit, and can't be restored or compared with Current.  It has Create Version instead of Restore.
* On deploying or downloading, prompt for whether a version should be created

# Future UI ideas
* Allow settings for saving versions automatically
* More filtering ideas to find a version in a lot of versions
    * Favorites (per user) - this would have to be stored in browser settings
    * Hide versions that are less than x older than the one after it
* Allow setting left/right for diffs ( a la code search by Google - https://cs.android.com/android/_/android/platform/hardware/google/camera/+/cd15337bd229dd521a860d88bca3e37c3ca845f7:common/hal/common/hal_types.h )
* Allow "diff" betweeen separate projects



