import { describe, expect, test } from 'vitest';
import { MemoryStorage } from '../frontend/storage/memory_storage';
import * as storageModuleContent from '../frontend/storage/module_content';
import * as storageNames from '../frontend/storage/names';
import * as storageProject from '../frontend/storage/project';
import * as storageVersions from '../frontend/storage/versions';
import * as versionDiff from '../frontend/storage/version_diff';

function makeBlocks(...topLevelBlocks: any[]): any {
  return { blocks: { languageVersion: 0, blocks: topLevelBlocks } };
}

function numberBlock(id: string, num: number): any {
  return { type: 'math_number', id, fields: { NUM: num } };
}

function printBlock(id: string, textBlock: any): any {
  const blockJson: any = { type: 'text_print', id, x: 10, y: 10 };
  if (textBlock) {
    blockJson.inputs = { TEXT: { block: textBlock } };
  }
  return blockJson;
}

function ifBlock(id: string, firstStatement?: any): any {
  const blockJson: any = { type: 'controls_if', id };
  if (firstStatement) {
    blockJson.inputs = { DO0: { block: firstStatement } };
  }
  return blockJson;
}

/** Connects the given blocks into a stack and returns the first one. */
function stack(...blocks: any[]): any {
  for (let i = 0; i < blocks.length - 1; i++) {
    blocks[i].next = { block: blocks[i + 1] };
  }
  return blocks[0];
}

/** Returns the content text of a module with the given id and blocks. */
function moduleContentText(moduleId: string, blocks: any): string {
  const content = storageModuleContent.parseModuleContentText(
      storageModuleContent.newMechanismContent('P', 'Arm'));
  content.setModuleId(moduleId);
  content.setBlocks(blocks);
  return content.getModuleContentText();
}

describe('diffBlocks', () => {
  test('finds added, removed, and changed blocks', () => {
    const oldBlocks = makeBlocks(printBlock('p1', numberBlock('n1', 1)), numberBlock('n2', 2));
    const newBlocks = makeBlocks(printBlock('p1', numberBlock('n1', 5)), numberBlock('n3', 3));
    const diff = versionDiff.diffBlocks(oldBlocks, newBlocks);
    expect([...diff.changed]).toEqual(['n1']);
    expect([...diff.added]).toEqual(['n3']);
    expect([...diff.removed]).toEqual(['n2']);
  });

  test('a change to a child block does not mark its parent', () => {
    const diff = versionDiff.diffBlocks(
        makeBlocks(printBlock('p1', numberBlock('n1', 1))),
        makeBlocks(printBlock('p1', numberBlock('n1', 2))));
    expect(diff.changed.has('p1')).toBe(false);
  });

  test('replacing a block does not mark its parent', () => {
    const diff = versionDiff.diffBlocks(
        makeBlocks(printBlock('p1', numberBlock('n1', 1))),
        makeBlocks(printBlock('p1', numberBlock('n2', 1))));
    expect([...diff.changed]).toEqual([]);
    expect([...diff.added]).toEqual(['n2']);
    expect([...diff.removed]).toEqual(['n1']);
  });

  test('deleting a block marks only that block, not the blocks inside it or its parent', () => {
    // if (p1 printing n1) { p2 printing n2 }, with p3 after p2.
    const statements = stack(printBlock('p2', numberBlock('n2', 2)), printBlock('p3', numberBlock('n3', 3)));
    const oldBlocks = makeBlocks(ifBlock('if1', stack(printBlock('p1', numberBlock('n1', 1)), statements)));
    const newBlocks = makeBlocks(ifBlock('if1', stack(printBlock('p1', numberBlock('n1', 1)))));
    const diff = versionDiff.diffBlocks(oldBlocks, newBlocks);
    expect([...diff.removed].sort()).toEqual(['p2', 'p3']);
    expect([...diff.changed]).toEqual([]);
    expect([...diff.added]).toEqual([]);

    // Deleting the if block marks only the if block.
    const deletedIf = versionDiff.diffBlocks(oldBlocks, makeBlocks());
    expect([...deletedIf.removed]).toEqual(['if1']);
  });

  test('deleting a block from the middle of a stack does not mark the blocks around it', () => {
    const diff = versionDiff.diffBlocks(
        makeBlocks(stack(printBlock('a', numberBlock('na', 1)), printBlock('b', numberBlock('nb', 2)),
            printBlock('c', numberBlock('nc', 3)))),
        makeBlocks(stack(printBlock('a', numberBlock('na', 1)), printBlock('c', numberBlock('nc', 3)))));
    expect([...diff.removed]).toEqual(['b']);
    expect([...diff.changed]).toEqual([]);
  });

  test('adding a block with blocks inside it marks only that block', () => {
    const diff = versionDiff.diffBlocks(
        makeBlocks(ifBlock('if1')),
        makeBlocks(ifBlock('if1', stack(printBlock('p1', numberBlock('n1', 1))))));
    expect([...diff.added]).toEqual(['p1']);
    expect([...diff.changed]).toEqual([]);
  });

  test('moving a block marks the block that moved', () => {
    // Reordering a stack.
    const reordered = versionDiff.diffBlocks(
        makeBlocks(stack(printBlock('a', numberBlock('na', 1)), printBlock('b', numberBlock('nb', 2)))),
        makeBlocks(stack(printBlock('b', numberBlock('nb', 2)), printBlock('a', numberBlock('na', 1)))));
    expect(reordered.changed.has('a') || reordered.changed.has('b')).toBe(true);
    expect(reordered.changed.has('na') || reordered.changed.has('nb')).toBe(false);

    // Moving a block into a different block's input.
    const moved = versionDiff.diffBlocks(
        makeBlocks(printBlock('p1', numberBlock('n1', 1)), printBlock('p2', undefined)),
        makeBlocks(printBlock('p1', undefined), printBlock('p2', numberBlock('n1', 1))));
    expect([...moved.changed]).toEqual(['n1']);
  });

  test('moving a stack is not a change', () => {
    const moved = printBlock('p1', numberBlock('n1', 1));
    moved.x = 500;
    moved.y = 300;
    const diff = versionDiff.diffBlocks(makeBlocks(printBlock('p1', numberBlock('n1', 1))), makeBlocks(moved));
    expect(diff.changed.size + diff.added.size + diff.removed.size).toBe(0);
    expect([...diff.moved]).toEqual(['p1']);
  });
});

describe('diffModules', () => {
  test('matches modules by moduleId, so renames are found', () => {
    const blocks = makeBlocks(numberBlock('n1', 1));
    const diffs = versionDiff.diffModules(
        {
          'Arm.mechanism.json': moduleContentText('arm', blocks),
          'Claw.mechanism.json': moduleContentText('claw', blocks),
        },
        {
          'Elbow.mechanism.json': moduleContentText('arm', blocks),
          'Lift.mechanism.json': moduleContentText('lift', blocks),
        });
    const byId = new Map(diffs.map(d => [d.moduleId, d]));
    expect(byId.get('arm')!.change).toBe(versionDiff.ModuleChange.CHANGED);
    expect(byId.get('arm')!.oldClassName).toBe('Arm');
    expect(byId.get('arm')!.currentClassName).toBe('Elbow');
    expect(byId.get('claw')!.change).toBe(versionDiff.ModuleChange.REMOVED);
    expect(byId.get('lift')!.change).toBe(versionDiff.ModuleChange.ADDED);
  });

  test('a module whose blocks were only moved is changed', () => {
    const moved = numberBlock('n1', 1);
    moved.x = 500;
    const diffs = versionDiff.diffModules(
        { 'Arm.mechanism.json': moduleContentText('arm', makeBlocks(numberBlock('n1', 1))) },
        { 'Arm.mechanism.json': moduleContentText('arm', makeBlocks(moved)) });
    expect(diffs[0].change).toBe(versionDiff.ModuleChange.CHANGED);
  });

  test('a module with the same blocks is unchanged', () => {
    const files = { 'Arm.mechanism.json': moduleContentText('arm', makeBlocks(numberBlock('n1', 1))) };
    expect(versionDiff.diffModules(files, files)[0].change).toBe(versionDiff.ModuleChange.UNCHANGED);
  });
});

describe('versions', () => {
  async function makeProject(): Promise<MemoryStorage> {
    const storage = new MemoryStorage();
    await storageProject.createProject(storage, 'MyRobot');
    return storage;
  }

  test('creating, listing, describing, and deleting versions', async () => {
    const storage = await makeProject();
    const first = await storageVersions.createVersion(storage, 'MyRobot', '  first  ');
    await new Promise(resolve => setTimeout(resolve, 5));
    const second = await storageVersions.createVersion(storage, 'MyRobot', '');

    let versions = await storageVersions.listVersions(storage, 'MyRobot');
    expect(versions.map(v => v.versionId)).toEqual([second.versionId, first.versionId]);
    expect(versions[1].description).toBe('first');

    await storageVersions.updateVersionDescription(storage, 'MyRobot', second.versionId, 'second');
    versions = await storageVersions.listVersions(storage, 'MyRobot');
    expect(versions[0].description).toBe('second');

    await storageVersions.deleteVersion(storage, 'MyRobot', first.versionId);
    versions = await storageVersions.listVersions(storage, 'MyRobot');
    expect(versions.map(v => v.versionId)).toEqual([second.versionId]);
  });

  test('versions are not part of the project files, copies, or downloads', async () => {
    const storage = await makeProject();
    await storageVersions.createVersion(storage, 'MyRobot', 'v1');
    const fileNames = Object.keys(await storageProject.fetchProjectFiles(storage, 'MyRobot'));
    expect(fileNames.sort()).toEqual(['Robot.robot.json', 'Teleop.opmode.json', 'project.info.json']);

    await storageProject.copyProject(storage, 'MyRobot', 'MyCopy');
    expect(await storageVersions.listVersions(storage, 'MyCopy')).toEqual([]);
    // fetchProject still works with a versions directory in the project.
    const project = await storageProject.fetchProject(storage, 'MyRobot');
    expect(project.opModes.map(o => o.className)).toEqual(['Teleop']);
  });

  test('renaming a project keeps its versions', async () => {
    const storage = await makeProject();
    const version = await storageVersions.createVersion(storage, 'MyRobot', 'v1');
    await storageProject.renameProject(storage, 'MyRobot', 'Renamed');
    const versions = await storageVersions.listVersions(storage, 'Renamed');
    expect(versions.map(v => v.versionId)).toEqual([version.versionId]);
  });

  test('hasChangesSinceLatestVersion', async () => {
    const storage = await makeProject();
    expect(await storageVersions.hasChangesSinceLatestVersion(storage, 'MyRobot')).toBe(true);

    await storageVersions.createVersion(storage, 'MyRobot', 'v1');
    expect(await storageVersions.hasChangesSinceLatestVersion(storage, 'MyRobot')).toBe(false);

    const robotPath = storageNames.makeRobotPath('MyRobot');
    const robotContent = storageModuleContent.parseModuleContentText(
        await storage.fetchFileContentText(robotPath));
    robotContent.setBlocks(makeBlocks(numberBlock('n1', 1)));
    await storage.saveFile(robotPath, robotContent.getModuleContentText());
    expect(await storageVersions.hasChangesSinceLatestVersion(storage, 'MyRobot')).toBe(true);

    // Wait, so that v2 is created after v1 and is the newest version.
    await new Promise(resolve => setTimeout(resolve, 5));
    await storageVersions.createVersion(storage, 'MyRobot', 'v2');
    expect(await storageVersions.hasChangesSinceLatestVersion(storage, 'MyRobot')).toBe(false);

    const project = await storageProject.fetchProject(storage, 'MyRobot');
    await storageProject.updateProjectGamepadConfig(storage, project, {});
    expect(await storageVersions.hasChangesSinceLatestVersion(storage, 'MyRobot')).toBe(true);
  });

  test('restoring in place saves the current state first and keeps the projectId', async () => {
    const storage = await makeProject();
    const projectId = (await storageProject.fetchProjectInfo(storage, 'MyRobot')).projectId;
    const version = await storageVersions.createVersion(storage, 'MyRobot', 'v1');
    const versionFiles = await storageProject.fetchProjectFiles(storage, 'MyRobot');

    // Change the project after the version: add an opmode and change the robot.
    const project = await storageProject.fetchProject(storage, 'MyRobot');
    await storageProject.addModuleToProject(storage, project, project.opModes[0].moduleType, 'Auto');
    const robotPath = storageNames.makeRobotPath('MyRobot');
    const robotContent = storageModuleContent.parseModuleContentText(
        await storage.fetchFileContentText(robotPath));
    robotContent.setBlocks(makeBlocks(numberBlock('n1', 1)));
    await storage.saveFile(robotPath, robotContent.getModuleContentText());
    const changedFiles = await storageProject.fetchProjectFiles(storage, 'MyRobot');

    const backup = await storageVersions.restoreVersionInPlace(
        storage, 'MyRobot', version.versionId, 'before restoring');

    const restoredFiles = await storageProject.fetchProjectFiles(storage, 'MyRobot');
    expect(Object.keys(restoredFiles).sort()).toEqual(Object.keys(versionFiles).sort());
    expect(restoredFiles['Robot.robot.json']).toBe(versionFiles['Robot.robot.json']);
    expect((await storageProject.fetchProjectInfo(storage, 'MyRobot')).projectId).toBe(projectId);

    expect(backup.description).toBe('before restoring');
    const backupFiles = await storageVersions.fetchVersionFiles(storage, 'MyRobot', backup.versionId);
    expect(backupFiles['Auto.opmode.json']).toBe(changedFiles['Auto.opmode.json']);
    expect(backupFiles['Robot.robot.json']).toBe(changedFiles['Robot.robot.json']);
  });

  test('restoring as a new project gives it a new projectId and no versions', async () => {
    const storage = await makeProject();
    const projectId = (await storageProject.fetchProjectInfo(storage, 'MyRobot')).projectId;
    const version = await storageVersions.createVersion(storage, 'MyRobot', 'v1');
    await storageVersions.restoreVersionAsNewProject(storage, 'MyRobot', version.versionId, 'Restored');

    const newInfo = await storageProject.fetchProjectInfo(storage, 'Restored');
    expect(newInfo.projectId).not.toBe('');
    expect(newInfo.projectId).not.toBe(projectId);
    expect(await storageVersions.listVersions(storage, 'Restored')).toEqual([]);
    const project = await storageProject.fetchProject(storage, 'Restored');
    expect(project.robot.className).toBe('Robot');
  });

  test('an old version is upgraded when fetched, without changing it in storage', async () => {
    const storage = await makeProject();
    const infoPath = storageNames.makeProjectInfoPath('MyRobot');
    const info = JSON.parse(await storage.fetchFileContentText(infoPath));
    const currentVersion = info.version;
    info.version = '0.7.0';
    const oldInfoText = JSON.stringify(info, null, 2);
    await storage.saveFile(infoPath, oldInfoText);
    const version = await storageVersions.createVersion(storage, 'MyRobot', 'v1');

    const files = await storageVersions.fetchVersionFiles(storage, 'MyRobot', version.versionId);
    expect(JSON.parse(files['project.info.json']).version).toBe(currentVersion);
    const objectPath = storageNames.makeVersionObjectPath('MyRobot', storageVersions.hashContent(oldInfoText));
    expect(await storage.fetchFileContentText(objectPath)).toBe(oldInfoText);
  });

  /** Returns the number of objects stored for MyRobot's versions. */
  async function countObjects(storage: MemoryStorage): Promise<number> {
    return (await storage.list(storageNames.makeVersionObjectsDirectoryPath('MyRobot'))).length;
  }

  /** Changes the Robot module's blocks to a number block with the given number. */
  async function changeRobot(storage: MemoryStorage, num: number): Promise<void> {
    const robotPath = storageNames.makeRobotPath('MyRobot');
    const robotContent = storageModuleContent.parseModuleContentText(
        await storage.fetchFileContentText(robotPath));
    robotContent.setBlocks(makeBlocks(numberBlock('n1', num)));
    await storage.saveFile(robotPath, robotContent.getModuleContentText());
  }

  test('hashContent returns the SHA-256 hash', () => {
    expect(storageVersions.hashContent('abc')).toBe(
        'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
  });

  test('files that are the same in several versions are stored once', async () => {
    const storage = await makeProject();
    await storageVersions.createVersion(storage, 'MyRobot', 'v1');
    // Robot, Teleop, and the project info file.
    expect(await countObjects(storage)).toBe(3);
    await storageVersions.createVersion(storage, 'MyRobot', 'v2');
    expect(await countObjects(storage)).toBe(3);
    await changeRobot(storage, 1);
    await storageVersions.createVersion(storage, 'MyRobot', 'v3');
    expect(await countObjects(storage)).toBe(4);
  });

  test('deleting versions deletes the objects that no other version uses', async () => {
    const storage = await makeProject();
    const v1 = await storageVersions.createVersion(storage, 'MyRobot', 'v1');
    const v1Files = await storageVersions.fetchVersionFiles(storage, 'MyRobot', v1.versionId);
    await changeRobot(storage, 1);
    const v2 = await storageVersions.createVersion(storage, 'MyRobot', 'v2');
    await changeRobot(storage, 2);
    const v3 = await storageVersions.createVersion(storage, 'MyRobot', 'v3');
    const v3Files = await storageVersions.fetchVersionFiles(storage, 'MyRobot', v3.versionId);
    expect(await countObjects(storage)).toBe(5);

    // Only v2 used its Robot.
    await storageVersions.deleteVersion(storage, 'MyRobot', v2.versionId);
    expect(await countObjects(storage)).toBe(4);
    expect(await storageVersions.fetchVersionFiles(storage, 'MyRobot', v1.versionId)).toEqual(v1Files);
    expect(await storageVersions.fetchVersionFiles(storage, 'MyRobot', v3.versionId)).toEqual(v3Files);

    // v1 and v3 share Teleop and the project info file.
    await storageVersions.deleteVersion(storage, 'MyRobot', v1.versionId);
    expect(await countObjects(storage)).toBe(3);
    await storageVersions.deleteVersion(storage, 'MyRobot', v3.versionId);
    expect(await countObjects(storage)).toBe(0);
  });

  test('incomplete versions are not listed, and are deleted once they are abandoned', async () => {
    const storage = await makeProject();
    const other = await storageVersions.createVersion(storage, 'MyRobot', 'other');
    await changeRobot(storage, 1);
    const incomplete = await storageVersions.createVersion(storage, 'MyRobot', 'incomplete');
    const manifestPath = storageNames.makeVersionFilePath(
        'MyRobot', incomplete.versionId, storageNames.VERSION_INFO_FILE_NAME);
    const manifest = JSON.parse(await storage.fetchFileContentText(manifestPath));
    manifest.complete = false;
    await storage.saveFile(manifestPath, JSON.stringify(manifest));
    expect((await storageVersions.listVersions(storage, 'MyRobot')).map(v => v.versionId))
        .toEqual([other.versionId]);

    // A version that is still being created keeps its objects when another version is deleted.
    const third = await storageVersions.createVersion(storage, 'MyRobot', 'third');
    await storageVersions.deleteVersion(storage, 'MyRobot', third.versionId);
    expect(await countObjects(storage)).toBe(4);

    // Once it is over an hour old, it is deleted along with the objects only it used.
    manifest.createdAt = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();
    await storage.saveFile(manifestPath, JSON.stringify(manifest));
    await storageVersions.deleteVersion(storage, 'MyRobot', other.versionId);
    expect(await countObjects(storage)).toBe(0);
    expect(await storage.list(storageNames.makeVersionsDirectoryPath('MyRobot'))).toEqual([]);
  });

  test('fetching a version whose object is missing fails', async () => {
    const storage = await makeProject();
    const version = await storageVersions.createVersion(storage, 'MyRobot', 'v1');
    const robotText = await storage.fetchFileContentText(storageNames.makeRobotPath('MyRobot'));
    await storage.delete(storageNames.makeVersionObjectPath('MyRobot', storageVersions.hashContent(robotText)));
    await expect(storageVersions.fetchVersionFiles(storage, 'MyRobot', version.versionId))
        .rejects.toThrow();
  });

  test('changing the description keeps the version\'s files', async () => {
    const storage = await makeProject();
    const version = await storageVersions.createVersion(storage, 'MyRobot', 'v1');
    const files = await storageVersions.fetchVersionFiles(storage, 'MyRobot', version.versionId);
    await storageVersions.updateVersionDescription(storage, 'MyRobot', version.versionId, 'new');
    expect(await storageVersions.fetchVersionFiles(storage, 'MyRobot', version.versionId))
        .toEqual(files);
  });
});
