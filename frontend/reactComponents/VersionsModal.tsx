/**
 * @license
 * Copyright 2026 Porpoiseful LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  DiffOutlined,
  DisconnectOutlined,
  DownOutlined,
  EditOutlined,
  LinkOutlined,
  PlusOutlined,
  RollbackOutlined,
} from '@ant-design/icons';
import * as Blockly from 'blockly/core';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageNames from '../storage/names';
import * as storageProject from '../storage/project';
import * as storageVersions from '../storage/versions';
import * as versionDiff from '../storage/version_diff';
import { TabType, TabTypeUtils } from '../types/TabType';
import { useAutosave } from './AutosaveManager';
import ProjectNameComponent from './ProjectNameComponent';
import ReadOnlyBlocklyPreview, { BlockHighlights } from './ReadOnlyBlocklyPreview';

/** Props for the VersionsModal component. */
interface VersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  storage: commonStorage.Storage | null;
  currentProject: storageProject.Project | null;
  setCurrentProject: (project: storageProject.Project | null) => void;
  setAlertErrorMessage: (message: string) => void;
  theme: string;
  renderer: string;
}

/** Modal width, as a percentage of the viewport width. */
const MODAL_WIDTH = '90vw';

/** Modal top offset, leaving equal space above and below for a modal that is 90% of the
 * viewport height. */
const MODAL_TOP = '5vh';

/** Height of the modal body, accounting for the title bar, footer, and padding. */
const MODAL_BODY_HEIGHT = 'calc(90vh - 165px)';

/** Number of versions shown on each page of the version list. */
const VERSIONS_PAGE_SIZE = 10;

/** Width of the list of modules in the compare view. */
const MODULE_LIST_WIDTH = 240;

/** Space between the two block previews in the compare view. */
const PANE_GAP = 12;

/** Border around each block preview in the compare view. */
const PREVIEW_BORDER = '1px solid rgba(128,128,128,0.3)';

/** The tag color for each kind of module change. */
const CHANGE_TAG_COLORS: {[change: string]: string | undefined} = {
  [versionDiff.ModuleChange.ADDED]: 'green',
  [versionDiff.ModuleChange.REMOVED]: 'red',
  [versionDiff.ModuleChange.CHANGED]: 'gold',
  [versionDiff.ModuleChange.UNCHANGED]: undefined,
};

/** The i18n key for each kind of module change. */
const CHANGE_LABEL_KEYS: {[change: string]: string} = {
  [versionDiff.ModuleChange.ADDED]: 'VERSIONS.MODULE_ADDED',
  [versionDiff.ModuleChange.REMOVED]: 'VERSIONS.MODULE_REMOVED',
  [versionDiff.ModuleChange.CHANGED]: 'VERSIONS.MODULE_CHANGED',
  [versionDiff.ModuleChange.UNCHANGED]: 'VERSIONS.MODULE_UNCHANGED',
};

/** The tab type of each module type, for showing the module's icon. */
const MODULE_TYPE_TO_TAB_TYPE: {[moduleType: string]: TabType} = {
  [storageModule.ModuleType.ROBOT]: TabType.ROBOT,
  [storageModule.ModuleType.MECHANISM]: TabType.MECHANISM,
  [storageModule.ModuleType.OPMODE]: TabType.OPMODE,
};

/**
 * How long after scrolling a workspace to match the other one its own scroll events are ignored,
 * so the two workspaces don't keep scrolling each other. Blockly fires the events asynchronously.
 */
const SCROLL_SYNC_IGNORE_MS = 100;

/** The CSS class (defined in index.css) for the change that was last scrolled to. */
const CURRENT_CHANGE_CLASS = 'mrcDiffCurrent';

/** The two block previews in the compare view. */
type Pane = 'left' | 'right';

/** A changed block, and the panes it is shown in. The first pane is used to order the changes. */
type BlockChange = {
  blockId: string,
  panes: Pane[],
};

function getOtherPane(pane: Pane): Pane {
  return pane === 'left' ? 'right' : 'left';
}

/** Scrolls and zooms one workspace to match another. */
function matchViewport(
    from: Blockly.WorkspaceSvg, to: Blockly.WorkspaceSvg, drivenAt: Map<string, number>): void {
  drivenAt.set(to.id, Date.now());
  if (to.scale !== from.scale) {
    to.setScale(from.scale);
  }
  to.scroll(from.scrollX, from.scrollY);
}

/** What the description dialog is being used for. */
type DescriptionDialog =
  | { mode: 'create' }
  | { mode: 'edit', version: storageVersions.VersionInfo };

/**
 * The version in the left pane, what is in the right pane (another version, or the current project
 * if rightVersion is null), and the differences between them.
 */
type Comparison = {
  leftVersion: storageVersions.VersionInfo,
  rightVersion: storageVersions.VersionInfo | null,
  moduleDiffs: versionDiff.ModuleDiff[],
  hasChanges: boolean,
};

/**
 * Modal component for creating versions of the current project, comparing a version's blocks with
 * the current blocks, and going back to a version (in place, or as a new project).
 */
export default function VersionsModal(props: VersionsModalProps): React.JSX.Element {
  const {t, i18n} = I18Next.useTranslation();
  const autosave = useAutosave();
  const [modal, contextHolder] = Antd.Modal.useModal();
  const [versions, setVersions] = React.useState<storageVersions.VersionInfo[]>([]);
  // The page of the version list, kept here so that it isn't lost while a comparison is shown.
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [descriptionDialog, setDescriptionDialog] = React.useState<DescriptionDialog | null>(null);
  const [description, setDescription] = React.useState('');
  const [comparison, setComparison] = React.useState<Comparison | null>(null);
  const [selectedModuleId, setSelectedModuleId] = React.useState('');
  const [restoreAsNewVersion, setRestoreAsNewVersion] =
      React.useState<storageVersions.VersionInfo | null>(null);
  const [newProjectName, setNewProjectName] = React.useState('');
  const [allProjectNames, setAllProjectNames] = React.useState<string[]>([]);
  const [scrollTogether, setScrollTogether] = React.useState(true);
  const [changeIndex, setChangeIndex] = React.useState(-1);
  // The compare view's workspaces, and when each was last scrolled to match the other.
  const workspacesRef = React.useRef<Record<Pane, Blockly.WorkspaceSvg | null>>(
      { left: null, right: null });
  const drivenAtRef = React.useRef(new Map<string, number>());
  const scrollTogetherRef = React.useRef(scrollTogether);
  scrollTogetherRef.current = scrollTogether;
  const currentChangeBlocksRef = React.useRef<Blockly.BlockSvg[]>([]);

  const projectName = props.currentProject?.projectName ?? '';

  const formatDate = (isoDate: string): string =>
      isoDate ? new Date(isoDate).toLocaleString(
          i18n.language, { dateStyle: 'short', timeStyle: 'short' }) : '';

  /** Returns the text that identifies a version: its description, or else when it was created. */
  const getVersionLabel = (version: storageVersions.VersionInfo): string =>
      version.description || formatDate(version.createdAt);

  const loadVersions = async (): Promise<void> => {
    if (!props.storage || !projectName) {
      return;
    }
    setLoading(true);
    try {
      const list = await storageVersions.listVersions(props.storage, projectName);
      setVersions(list);
      // If versions were deleted, the page might not exist anymore.
      const pageCount = Math.max(1, Math.ceil(list.length / VERSIONS_PAGE_SIZE));
      setPage(p => Math.min(p, pageCount));
    } catch (e) {
      console.error('Failed to load versions:', e);
      props.setAlertErrorMessage(t('VERSIONS.LOAD_FAILED'));
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (!props.isOpen) {
      setComparison(null);
      setSelectedModuleId('');
      return;
    }
    setPage(1);
    loadVersions();
  }, [props.isOpen, props.storage, projectName]);

  const openCreateDialog = (): void => {
    setDescription('');
    setDescriptionDialog({ mode: 'create' });
  };

  const openEditDialog = (version: storageVersions.VersionInfo): void => {
    setDescription(version.description);
    setDescriptionDialog({ mode: 'edit', version: version });
  };

  const handleDescriptionDialogOk = async (): Promise<void> => {
    if (!props.storage || !descriptionDialog) {
      return;
    }
    setBusy(true);
    try {
      if (descriptionDialog.mode === 'create') {
        // Save the current tab first, so that the version includes the latest changes.
        await autosave.triggerSave();
        await storageVersions.createVersion(props.storage, projectName, description);
        // Versions are listed newest first, so the new version is on the first page.
        setPage(1);
      } else {
        await storageVersions.updateVersionDescription(
            props.storage, projectName, descriptionDialog.version.versionId, description);
      }
      setDescriptionDialog(null);
      await loadVersions();
    } catch (e) {
      console.error('Failed to save version:', e);
      props.setAlertErrorMessage(t(descriptionDialog.mode === 'create'
          ? 'VERSIONS.CREATE_FAILED' : 'VERSIONS.UPDATE_FAILED'));
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (version: storageVersions.VersionInfo): Promise<void> => {
    if (!props.storage) {
      return;
    }
    try {
      await storageVersions.deleteVersion(props.storage, projectName, version.versionId);
      await loadVersions();
    } catch (e) {
      console.error('Failed to delete version:', e);
      props.setAlertErrorMessage(t('VERSIONS.DELETE_FAILED'));
    }
  };

  /**
   * Compares a version with the current project, or with another version. The version goes in the
   * left pane and the current project in the right pane. When two versions are compared, the one
   * that was created first goes in the left pane.
   */
  const handleCompare = async (
      version: storageVersions.VersionInfo,
      otherVersion?: storageVersions.VersionInfo): Promise<void> => {
    if (!props.storage) {
      return;
    }
    let leftVersion = version;
    let rightVersion: storageVersions.VersionInfo | null = null;
    if (otherVersion) {
      [leftVersion, rightVersion] = (otherVersion.createdAt < version.createdAt)
          ? [otherVersion, version] : [version, otherVersion];
    }
    setBusy(true);
    try {
      await autosave.triggerSave();
      const leftFiles = await storageVersions.fetchVersionFiles(
          props.storage, projectName, leftVersion.versionId);
      const rightFiles = rightVersion
          ? await storageVersions.fetchVersionFiles(
              props.storage, projectName, rightVersion.versionId)
          : await storageProject.fetchProjectFiles(props.storage, projectName);
      const moduleDiffs = versionDiff.diffModules(leftFiles, rightFiles);
      const hasChanges = await storageVersions.hasChangesBetween(
          projectName, leftFiles, rightFiles);
      setComparison({ leftVersion, rightVersion, moduleDiffs, hasChanges });
      selectModule(moduleDiffs.length ? moduleDiffs[0].moduleId : '');
    } catch (e) {
      console.error('Failed to compare with version:', e);
      props.setAlertErrorMessage(t('VERSIONS.COMPARE_FAILED'));
    } finally {
      setBusy(false);
    }
  };

  const confirmRestoreHere = (version: storageVersions.VersionInfo): void => {
    modal.confirm({
      title: t('VERSIONS.RESTORE_HERE'),
      content: t('VERSIONS.RESTORE_HERE_CONFIRM'),
      okText: t('VERSIONS.RESTORE'),
      cancelText: t('CANCEL'),
      onOk: () => handleRestoreHere(version),
    });
  };

  const handleRestoreHere = async (version: storageVersions.VersionInfo): Promise<void> => {
    const storage = props.storage;
    if (!storage || !projectName) {
      return;
    }
    // Save the current tab, and then close the project so that its editors are gone before the
    // files change. Otherwise an editor could save its blocks over the restored ones.
    await autosave.triggerSave();
    props.setCurrentProject(null);
    await new Promise(resolve => setTimeout(resolve, 0));
    let restored = false;
    try {
      await storageVersions.restoreVersionInPlace(
          storage, projectName, version.versionId,
          t('VERSIONS.AUTO_BEFORE_RESTORE', { name: getVersionLabel(version) }));
      restored = true;
    } catch (e) {
      console.error('Failed to restore version:', e);
      props.setAlertErrorMessage(t('VERSIONS.RESTORE_FAILED'));
    }
    try {
      props.setCurrentProject(await storageProject.fetchProject(storage, projectName));
    } catch (e) {
      console.error('Failed to reopen the project after restoring a version:', e);
      props.setAlertErrorMessage(t('VERSIONS.RESTORE_FAILED'));
      return;
    }
    if (restored) {
      props.onClose();
    }
  };

  const openRestoreAsNewDialog = async (version: storageVersions.VersionInfo): Promise<void> => {
    if (!props.storage) {
      return;
    }
    const projectNames = await storageProject.listProjectNames(props.storage);
    setAllProjectNames(projectNames);
    setNewProjectName(storageNames.makeUniqueName(projectName, projectNames));
    setRestoreAsNewVersion(version);
  };

  const isNewProjectNameValid = storageNames.isValidClassName(newProjectName.trim()) &&
      !allProjectNames.includes(newProjectName.trim());

  const handleRestoreAsNew = async (): Promise<void> => {
    if (!props.storage || !restoreAsNewVersion || !isNewProjectNameValid) {
      return;
    }
    const name = newProjectName.trim();
    setBusy(true);
    try {
      await autosave.triggerSave();
      await storageVersions.restoreVersionAsNewProject(
          props.storage, projectName, restoreAsNewVersion.versionId, name);
      props.setCurrentProject(await storageProject.fetchProject(props.storage, name));
      setRestoreAsNewVersion(null);
      props.onClose();
    } catch (e) {
      console.error('Failed to restore version as a new project:', e);
      props.setAlertErrorMessage(t('VERSIONS.RESTORE_FAILED'));
    } finally {
      setBusy(false);
    }
  };

  /**
   * Renders the Restore button. It is disabled if disabled is true, for example because the version
   * is the same as the current project.
   */
  const renderRestoreButton = (
      version: storageVersions.VersionInfo, disabled: boolean = false): React.JSX.Element => (
    <Antd.Dropdown
      disabled={disabled}
      menu={{
        items: [
          { key: 'here', label: t('VERSIONS.RESTORE_HERE') },
          { key: 'new', label: t('VERSIONS.RESTORE_AS_NEW') + '...' },
        ],
        onClick: ({ key }) => {
          if (key === 'here') {
            confirmRestoreHere(version);
          } else {
            openRestoreAsNewDialog(version);
          }
        },
      }}
    >
      <Antd.Button size="small" icon={<RollbackOutlined />} disabled={disabled}>
        <Antd.Space size={4}>
          {t('VERSIONS.RESTORE')}
          <DownOutlined />
        </Antd.Space>
      </Antd.Button>
    </Antd.Dropdown>
  );

  /**
   * Renders the Compare button, which compares the version with the current project, and next to
   * it a menu for comparing the version with another version.
   */
  const renderCompareButton = (version: storageVersions.VersionInfo): React.JSX.Element => {
    const otherVersions = versions.filter(v => v.versionId !== version.versionId);
    return (
      <Antd.Space.Compact size="small">
        <Antd.Button size="small" icon={<DiffOutlined />} onClick={() => handleCompare(version)}>
          {t('VERSIONS.COMPARE')}
        </Antd.Button>
        <Antd.Tooltip title={t('VERSIONS.COMPARE_WITH_VERSION')}>
          <Antd.Dropdown
            disabled={otherVersions.length === 0}
            menu={{
              items: [{
                type: 'group',
                label: t('VERSIONS.COMPARE_WITH_VERSION'),
                children: otherVersions.map(v => ({
                  key: v.versionId,
                  label: v.description
                      ? v.description + ' (' + formatDate(v.createdAt) + ')'
                      : formatDate(v.createdAt),
                })),
              }],
              onClick: ({ key }) => {
                const otherVersion = otherVersions.find(v => v.versionId === key);
                if (otherVersion) {
                  handleCompare(version, otherVersion);
                }
              },
            }}
          >
            <Antd.Button
              size="small" icon={<DownOutlined />} disabled={otherVersions.length === 0} />
          </Antd.Dropdown>
        </Antd.Tooltip>
      </Antd.Space.Compact>
    );
  };

  const columns: Antd.TableProps<storageVersions.VersionInfo>['columns'] = [
    {
      title: t('VERSIONS.DESCRIPTION'),
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || (
        <Antd.Typography.Text type="secondary">{t('VERSIONS.NO_DESCRIPTION')}</Antd.Typography.Text>
      ),
    },
    {
      title: t('VERSIONS.CREATED'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 220,
      render: (createdAt: string) => formatDate(createdAt),
    },
    {
      title: t('VERSIONS.ACTIONS'),
      key: 'actions',
      width: 260,
      render: (_: unknown, version: storageVersions.VersionInfo) => (
        // Clicking a row compares it, so clicks on these buttons (and their popups, whose
        // events bubble through React) shouldn't reach the row.
        <div onClick={(e) => e.stopPropagation()}>
          <Antd.Space size={4} wrap>
            {renderCompareButton(version)}
            <Antd.Tooltip title={t('VERSIONS.EDIT_DESCRIPTION')}>
              <Antd.Button
                size="small" icon={<EditOutlined />} onClick={() => openEditDialog(version)} />
            </Antd.Tooltip>
            <Antd.Popconfirm
              title={t('VERSIONS.DELETE_CONFIRM')}
              okText={t('DELETE')}
              cancelText={t('CANCEL')}
              onConfirm={() => handleDelete(version)}
            >
              <Antd.Tooltip title={t('DELETE')}>
                <Antd.Button size="small" danger icon={<DeleteOutlined />} />
              </Antd.Tooltip>
            </Antd.Popconfirm>
          </Antd.Space>
        </div>
      ),
    },
  ];

  const renderVersionList = (): React.JSX.Element => (
    <>
      <Antd.Space style={{ marginBottom: 12 }}>
        <Antd.Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateDialog}
          disabled={!props.storage || !projectName}
        >
          {t('VERSIONS.CREATE')}
        </Antd.Button>
      </Antd.Space>
      <Antd.Table
        rowKey="versionId"
        size="small"
        loading={loading || busy}
        columns={columns}
        dataSource={versions}
        pagination={versions.length > VERSIONS_PAGE_SIZE ? {
          current: page,
          pageSize: VERSIONS_PAGE_SIZE,
          onChange: setPage,
          showSizeChanger: false,
          showTotal: (total, range) =>
              t('PAGINATION_ITEMS', { range0: range[0], range1: range[1], total }),
        } : false}
        locale={{ emptyText: t('VERSIONS.NO_VERSIONS') }}
        onRow={(version) => ({
          onClick: () => handleCompare(version),
          style: { cursor: 'pointer' },
        })}
      />
    </>
  );

  const renderLegendItem = (
      color: string, label: string, borderStyle: string = 'solid'): React.JSX.Element => (
    <Antd.Space size={4}>
      <span style={{
        display: 'inline-block', width: 14, height: 14, border: `3px ${borderStyle} ${color}`,
        borderRadius: 3,
      }} />
      {label}
    </Antd.Space>
  );

  const renderPreviewPane = (
      pane: Pane, title: React.ReactNode, contentText: string | null, emptyText: string,
      highlights: BlockHighlights): React.JSX.Element => (
    <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 0', minWidth: 0 }}>
      <div style={{ marginBottom: 4 }}>
        {typeof title === 'string'
            ? <Antd.Typography.Text strong>{title}</Antd.Typography.Text>
            : title}
      </div>
      <div style={{ flex: '1 1 auto', minHeight: 0, border: PREVIEW_BORDER }}>
        {contentText ? (
          <ReadOnlyBlocklyPreview
            moduleContentText={contentText}
            theme={props.theme}
            renderer={props.renderer}
            selectable={false}
            highlights={highlights}
            onWorkspaceChanged={(workspace) => handleWorkspaceChanged(pane, workspace)}
          />
        ) : (
          <Antd.Empty
            image={Antd.Empty.PRESENTED_IMAGE_SIMPLE}
            description={emptyText}
            style={{ marginTop: 48 }}
          />
        )}
      </div>
    </div>
  );

  const selectedDiff = comparison?.moduleDiffs.find(d => d.moduleId === selectedModuleId) ?? null;
  // An unchanged module is shown in one preview, since both would show the same blocks.
  const isUnchanged = selectedDiff?.change === versionDiff.ModuleChange.UNCHANGED;
  const changeCount = selectedDiff
      ? selectedDiff.blockDiff.added.size + selectedDiff.blockDiff.removed.size +
          selectedDiff.blockDiff.changed.size
      : 0;

  const selectModule = (moduleId: string): void => {
    currentChangeBlocksRef.current = [];
    setChangeIndex(-1);
    setSelectedModuleId(moduleId);
  };

  /** Returns the changes in the selected module, in order from top to bottom. */
  const getChanges = (): BlockChange[] => {
    if (!selectedDiff) {
      return [];
    }
    const blockDiff = selectedDiff.blockDiff;
    const changes: BlockChange[] = [
      ...[...blockDiff.removed].map(blockId => ({ blockId, panes: ['left'] as Pane[] })),
      ...[...blockDiff.changed].map(
          blockId => ({ blockId, panes: ['right', 'left'] as Pane[] })),
      ...[...blockDiff.added].map(blockId => ({ blockId, panes: ['right'] as Pane[] })),
    ];
    const getPosition = (change: BlockChange): Blockly.utils.Coordinate =>
        workspacesRef.current[change.panes[0]]?.getBlockById(change.blockId)
            ?.getRelativeToSurfaceXY() ?? new Blockly.utils.Coordinate(0, 0);
    const positions = new Map(changes.map(change => [change, getPosition(change)]));
    return changes.sort((a, b) =>
        (positions.get(a)!.y - positions.get(b)!.y) || (positions.get(a)!.x - positions.get(b)!.x));
  };

  /** Scrolls the panes to the change at the given index, wrapping around at either end. */
  const goToChange = (index: number): void => {
    const changes = getChanges();
    if (!changes.length) {
      return;
    }
    const i = (index + changes.length) % changes.length;
    const change = changes[i];
    currentChangeBlocksRef.current.forEach(block => block.removeClass(CURRENT_CHANGE_CLASS));
    currentChangeBlocksRef.current = [];
    // Center the block in each pane that shows it. Those panes don't scroll the other one, since
    // the block's position can be different in each.
    for (const pane of change.panes) {
      const workspace = workspacesRef.current[pane];
      const block = workspace?.getBlockById(change.blockId);
      if (workspace && block) {
        drivenAtRef.current.set(workspace.id, Date.now());
        workspace.centerOnBlock(change.blockId);
        block.addClass(CURRENT_CHANGE_CLASS);
        currentChangeBlocksRef.current.push(block);
      }
    }
    if (change.panes.length === 1 && scrollTogetherRef.current) {
      const from = workspacesRef.current[change.panes[0]];
      const to = workspacesRef.current[getOtherPane(change.panes[0])];
      if (from && to) {
        matchViewport(from, to, drivenAtRef.current);
      }
    }
    setChangeIndex(i);
  };

  const handleWorkspaceChanged = (pane: Pane, workspace: Blockly.WorkspaceSvg | null): void => {
    workspacesRef.current[pane] = workspace;
    if (!workspace) {
      return;
    }
    workspace.addChangeListener((event: Blockly.Events.Abstract) => {
      if (event.type !== Blockly.Events.VIEWPORT_CHANGE || !scrollTogetherRef.current) {
        return;
      }
      const drivenAt = drivenAtRef.current.get(workspace.id);
      if (drivenAt !== undefined && Date.now() - drivenAt < SCROLL_SYNC_IGNORE_MS) {
        return;
      }
      const other = workspacesRef.current[getOtherPane(pane)];
      if (other) {
        matchViewport(workspace, other, drivenAtRef.current);
      }
    });
    // Once every pane that has blocks is loaded, go to the first change.
    const loaded =
        (!selectedDiff?.leftContentText || workspacesRef.current.left) &&
        (!selectedDiff?.rightContentText || workspacesRef.current.right);
    if (loaded) {
      setTimeout(() => goToChange(0), 0);
    }
  };

  const handleScrollTogetherChange = (checked: boolean): void => {
    setScrollTogether(checked);
    const left = workspacesRef.current.left;
    const right = workspacesRef.current.right;
    if (checked && left && right) {
      matchViewport(right, left, drivenAtRef.current);
    }
  };

  // These are memoized so that the previews aren't recreated every time this renders.
  const leftHighlights = React.useMemo<BlockHighlights>(() => ({
    removed: selectedDiff?.blockDiff.removed,
    changed: selectedDiff?.blockDiff.changed,
    moved: selectedDiff?.blockDiff.moved,
  }), [selectedDiff]);
  const rightHighlights = React.useMemo<BlockHighlights>(() => ({
    added: selectedDiff?.blockDiff.added,
    changed: selectedDiff?.blockDiff.changed,
    moved: selectedDiff?.blockDiff.moved,
  }), [selectedDiff]);

  const renderChangeNavigation = (): React.JSX.Element => (
    <Antd.Space style={{ marginBottom: 8, flex: '0 0 auto' }} wrap>
      <Antd.Button
        size="small"
        icon={<ArrowUpOutlined />}
        disabled={changeCount === 0}
        onClick={() => goToChange(changeIndex - 1)}
      >
        {t('VERSIONS.PREVIOUS_CHANGE')}
      </Antd.Button>
      <Antd.Button
        size="small"
        icon={<ArrowDownOutlined />}
        disabled={changeCount === 0}
        onClick={() => goToChange(changeIndex + 1)}
      >
        {t('VERSIONS.NEXT_CHANGE')}
      </Antd.Button>
      <Antd.Typography.Text type="secondary">
        {changeCount === 0
            ? t('VERSIONS.NO_CHANGES')
            : t('VERSIONS.CHANGE_POSITION',
                { index: Math.max(changeIndex, 0) + 1, count: changeCount })}
      </Antd.Typography.Text>
      {selectedDiff && selectedDiff.blockDiff.moved.size > 0 && (
        <Antd.Typography.Text type="secondary" style={{ marginLeft: 16 }}>
          {t('VERSIONS.MOVED_COUNT', { count: selectedDiff.blockDiff.moved.size })}
        </Antd.Typography.Text>
      )}
      <Antd.Switch
        size="small"
        checked={scrollTogether}
        onChange={handleScrollTogetherChange}
        checkedChildren={<LinkOutlined />}
        unCheckedChildren={<DisconnectOutlined />}
        style={{ marginLeft: 16 }}
      />
      <Antd.Typography.Text>{t('VERSIONS.SCROLL_TOGETHER')}</Antd.Typography.Text>
    </Antd.Space>
  );

  const renderComparison = (c: Comparison): React.JSX.Element => {
    const leftTitle = t('VERSIONS.VERSION') + ': ' + getVersionLabel(c.leftVersion);
    const rightTitle = c.rightVersion
        ? t('VERSIONS.VERSION') + ': ' + getVersionLabel(c.rightVersion)
        : t('VERSIONS.CURRENT');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Antd.Space style={{ marginBottom: 12, flex: '0 0 auto' }} wrap>
          {/* With two versions, it isn't clear which one would be restored, so Restore isn't
              shown. */}
          {!c.rightVersion && renderRestoreButton(c.leftVersion, !c.hasChanges)}
          <Antd.Space size={16} style={{ marginLeft: 16 }}>
            {renderLegendItem('var(--mrc-diff-added)', t('VERSIONS.LEGEND_ADDED'))}
            {renderLegendItem('var(--mrc-diff-removed)', t('VERSIONS.LEGEND_REMOVED'))}
            {renderLegendItem('var(--mrc-diff-changed)', t('VERSIONS.LEGEND_CHANGED'))}
            {renderLegendItem('var(--mrc-diff-moved)', t('VERSIONS.LEGEND_MOVED'), 'dotted')}
          </Antd.Space>
        </Antd.Space>
        <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, gap: 12 }}>
          <div style={{ width: MODULE_LIST_WIDTH, flex: '0 0 auto', overflow: 'auto' }}>
            <Antd.List
              size="small"
              dataSource={c.moduleDiffs}
              renderItem={(diff) => {
                const className = diff.rightClassName ?? diff.leftClassName!;
                const renamed = diff.leftClassName && diff.rightClassName &&
                    diff.leftClassName !== diff.rightClassName;
                return (
                  <Antd.List.Item
                    onClick={() => selectModule(diff.moduleId)}
                    style={{
                      cursor: 'pointer',
                      paddingInline: 8,
                      background: diff.moduleId === selectedModuleId
                          ? 'rgba(128,128,128,0.2)' : undefined,
                    }}
                  >
                    <Antd.List.Item.Meta
                      avatar={TabTypeUtils.getIcon(MODULE_TYPE_TO_TAB_TYPE[diff.moduleType])}
                      title={className}
                      description={renamed
                          ? t('VERSIONS.RENAMED_FROM', { name: diff.leftClassName }) : undefined}
                    />
                    <Antd.Tag color={CHANGE_TAG_COLORS[diff.change]}>
                      {t(CHANGE_LABEL_KEYS[diff.change])}
                    </Antd.Tag>
                  </Antd.List.Item>
                );
              }}
            />
          </div>
          {selectedDiff && (
            <div style={{
              display: 'flex', flexDirection: 'column', flex: '1 1 auto', minWidth: 0,
            }}>
              {!isUnchanged && renderChangeNavigation()}
              <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, gap: PANE_GAP }}>
                {isUnchanged ? (
                  // Both titles are where they would be with two panes.
                  renderPreviewPane(
                      'right',
                      <div style={{ display: 'flex', gap: PANE_GAP }}>
                        <Antd.Typography.Text strong style={{ flex: '1 1 0', minWidth: 0 }}>
                          {leftTitle}
                        </Antd.Typography.Text>
                        <Antd.Typography.Text strong style={{ flex: '1 1 0', minWidth: 0 }}>
                          {rightTitle}
                        </Antd.Typography.Text>
                      </div>,
                      selectedDiff.rightContentText, t('VERSIONS.NOT_IN_CURRENT'),
                      rightHighlights)
                ) : (
                  <>
                    {renderPreviewPane(
                        'left', leftTitle,
                        selectedDiff.leftContentText, t('VERSIONS.NOT_IN_VERSION'),
                        leftHighlights)}
                    {renderPreviewPane(
                        'right', rightTitle,
                        selectedDiff.rightContentText,
                        c.rightVersion
                            ? t('VERSIONS.NOT_IN_VERSION') : t('VERSIONS.NOT_IN_CURRENT'),
                        rightHighlights)}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  /** In the compare view, goes back to the list of versions. Otherwise, closes the dialog. */
  const handleCloseOrBack = (): void => {
    if (comparison) {
      setComparison(null);
    } else {
      props.onClose();
    }
  };

  return (
    <>
      {contextHolder}
      <Antd.Modal
        title={t('VERSIONS.TITLE', { projectName: projectName })}
        open={props.isOpen}
        onCancel={handleCloseOrBack}
        footer={[
          <Antd.Button key="close" type="primary" onClick={handleCloseOrBack}>
            {t('OK')}
          </Antd.Button>,
        ]}
        width={MODAL_WIDTH}
        style={{ top: MODAL_TOP }}
        styles={{ body: { height: MODAL_BODY_HEIGHT, overflow: 'auto' } }}
      >
        {comparison ? renderComparison(comparison) : renderVersionList()}
      </Antd.Modal>

      <Antd.Modal
        title={descriptionDialog?.mode === 'edit'
            ? t('VERSIONS.EDIT_DESCRIPTION') : t('VERSIONS.CREATE_TITLE')}
        open={descriptionDialog !== null}
        onCancel={() => setDescriptionDialog(null)}
        onOk={handleDescriptionDialogOk}
        okText={descriptionDialog?.mode === 'edit' ? t('SAVE') : t('CREATE')}
        cancelText={t('CANCEL')}
        confirmLoading={busy}
      >
        <Antd.Input.TextArea
          autoFocus
          rows={3}
          value={description}
          placeholder={t('VERSIONS.DESCRIPTION_PLACEHOLDER')}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Antd.Modal>

      <Antd.Modal
        title={t('VERSIONS.RESTORE_AS_NEW')}
        open={restoreAsNewVersion !== null}
        onCancel={() => setRestoreAsNewVersion(null)}
        onOk={handleRestoreAsNew}
        okText={t('CREATE')}
        okButtonProps={{ disabled: !isNewProjectNameValid }}
        cancelText={t('CANCEL')}
        confirmLoading={busy}
      >
        <ProjectNameComponent
          newItemName={newProjectName}
          setNewItemName={setNewProjectName}
          onAddNewItem={handleRestoreAsNew}
          projectNames={allProjectNames}
        />
      </Antd.Modal>
    </>
  );
}
