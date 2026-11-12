// Copyright (c) FIRST and other WPILib contributors.

/**
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowUpOutlined,
  CopyOutlined,
  DeleteOutlined,
  DiffOutlined,
  DisconnectOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  FileTextOutlined,
  FilterOutlined,
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
import {
  collectTags,
  getStatusTagStyle,
  TagStatus,
  useTagLabel,
  VersionTagList,
} from './VersionTags';
import { EMPTY_VERSION_FIELD_VALUES, VersionFieldValues, VersionFields } from './VersionFields';

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

/** The theme colors of the tag for each kind of module change. */
const CHANGE_TAG_STATUSES: {[change: string]: TagStatus | undefined} = {
  [versionDiff.ModuleChange.ADDED]: 'success',
  [versionDiff.ModuleChange.REMOVED]: 'error',
  [versionDiff.ModuleChange.CHANGED]: 'warning',
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

/** The ranges of dates that the version list can be filtered by. */
type DateFilter = 'all' | 'today' | 'week' | 'month' | 'custom';

/** The i18n key of each date filter. */
const DATE_FILTER_LABEL_KEYS: Record<DateFilter, string> = {
  all: 'VERSIONS.FILTER_ANY_TIME',
  today: 'VERSIONS.FILTER_TODAY',
  week: 'VERSIONS.FILTER_LAST_7_DAYS',
  month: 'VERSIONS.FILTER_LAST_30_DAYS',
  custom: 'VERSIONS.FILTER_CHOOSE_DATES',
};

/** Whether a version must have all selected tags (AND) or any of them (OR) to match. */
type TagFilterMode = 'AND' | 'OR';

/** How many days, counting today, each date filter that goes back from today shows. */
const DATE_FILTER_DAYS: Partial<Record<DateFilter, number>> = {
  today: 1,
  week: 7,
  month: 30,
};

type DateRange = Antd.GetProps<typeof Antd.DatePicker.RangePicker>['value'];

const DAY_MS = 24 * 60 * 60 * 1000;

/** A row of the version list: a version, or the current project if version is null. */
type ListRow = {
  key: string,
  version: storageVersions.VersionInfo | null,
};

/** The key of the row for the current project. Version ids are never empty. */
const CURRENT_ROW_KEY = '';

/**
 * A version (or the current project, if version is null) whose details are shown, with its
 * modules and whether it is different from the current project.
 */
type Details = {
  version: storageVersions.VersionInfo | null,
  moduleDiffs: versionDiff.ModuleDiff[], // the version compared with itself, to list its modules
  hasChanges: boolean,
};

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
 * Modal component for creating versions of the current project, finding them by date and tags,
 * looking at a version's blocks, comparing them with the current blocks or another version's,
 * and going back to a version (in place, or as a new project).
 */
export default function VersionsModal(props: VersionsModalProps): React.JSX.Element {
  const {t, i18n} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  // The border around each block preview.
  const previewBorder = `1px solid ${token.colorBorder}`;
  // The colors that index.css outlines changed blocks in, which the legend uses too.
  const diffColors = {
    '--mrc-diff-added': token.colorSuccess,
    '--mrc-diff-removed': token.colorError,
    '--mrc-diff-changed': token.colorWarning,
    '--mrc-diff-moved': token.colorWarning,
  } as React.CSSProperties;
  const autosave = useAutosave();
  const [modal, contextHolder] = Antd.Modal.useModal();
  const [versions, setVersions] = React.useState<storageVersions.VersionInfo[]>([]);
  // The page of the version list, kept here so that it isn't lost while a comparison is shown.
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [descriptionDialog, setDescriptionDialog] = React.useState<DescriptionDialog | null>(null);
  const [fields, setFields] = React.useState<VersionFieldValues>(EMPTY_VERSION_FIELD_VALUES);
  const [dateFilter, setDateFilter] = React.useState<DateFilter>('all');
  const [customRange, setCustomRange] = React.useState<DateRange>(null);
  const [tagFilter, setTagFilter] = React.useState<string[]>([]);
  const [tagFilterMode, setTagFilterMode] = React.useState<TagFilterMode>('OR');
  const [onlyWithDescription, setOnlyWithDescription] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  // The filters are hidden until the user asks for them, so the list isn't intimidating.
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [details, setDetails] = React.useState<Details | null>(null);
  const [detailsModuleId, setDetailsModuleId] = React.useState('');
  const [comparison, setComparison] = React.useState<Comparison | null>(null);
  const [selectedModuleId, setSelectedModuleId] = React.useState('');
  // What is being saved as a new project: a version, or the current project if version is null.
  const [saveAsSource, setSaveAsSource] =
      React.useState<{ version: storageVersions.VersionInfo | null } | null>(null);
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
  const tagLabel = useTagLabel();
  const allTags = collectTags(versions);

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
      // The version whose details are shown might have been changed.
      setDetails(d => {
        if (!d?.version) {
          return d;
        }
        const version = list.find(v => v.versionId === d.version!.versionId);
        return version ? { ...d, version } : null;
      });
      // A tag that no version has anymore can't be used to filter.
      const listTags = collectTags(list);
      setTagFilter(f => f.filter(tag => listTags.includes(tag)));
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
      setDetails(null);
      setDetailsModuleId('');
      return;
    }
    setPage(1);
    clearFilters();
    setFiltersOpen(false);
    loadVersions();
  }, [props.isOpen, props.storage, projectName]);

  const openCreateDialog = (): void => {
    setFields(EMPTY_VERSION_FIELD_VALUES);
    setDescriptionDialog({ mode: 'create' });
  };

  const openEditDialog = (version: storageVersions.VersionInfo): void => {
    setFields({ description: version.description, tags: version.tags, notes: version.notes });
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
        await storageVersions.createVersion(
            props.storage, projectName, fields.description, fields.tags, fields.notes);
        // Versions are listed newest first, so the new version is on the first page.
        setPage(1);
      } else {
        await storageVersions.updateVersion(
            props.storage, projectName, descriptionDialog.version.versionId,
            fields.description, fields.tags, fields.notes);
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
      if (details?.version?.versionId === version.versionId) {
        setDetails(null);
      }
      await loadVersions();
    } catch (e) {
      console.error('Failed to delete version:', e);
      props.setAlertErrorMessage(t('VERSIONS.DELETE_FAILED'));
    }
  };

  /**
   * Shows the details of a version (its description, tags, and blocks), or of the current project
   * if version is null.
   */
  const openDetails = async (version: storageVersions.VersionInfo | null): Promise<void> => {
    if (!props.storage) {
      return;
    }
    setBusy(true);
    try {
      await autosave.triggerSave();
      const currentFiles = await storageProject.fetchProjectFiles(props.storage, projectName);
      const versionFiles = version
          ? await storageVersions.fetchVersionFiles(props.storage, projectName, version.versionId)
          : currentFiles;
      const moduleDiffs = versionDiff.diffModules(versionFiles, versionFiles);
      const hasChanges = version !== null && await storageVersions.hasChangesBetween(
          projectName, versionFiles, currentFiles);
      setDetails({ version, moduleDiffs, hasChanges });
      setDetailsModuleId(moduleDiffs.length ? moduleDiffs[0].moduleId : '');
    } catch (e) {
      console.error('Failed to load version:', e);
      props.setAlertErrorMessage(t('VERSIONS.LOAD_VERSION_FAILED'));
    } finally {
      setBusy(false);
    }
  };

  /**
   * Downloads a version (or the current project, if version is null), the same way the project
   * is downloaded.
   */
  const handleDownloadVersion = async (
      version: storageVersions.VersionInfo | null): Promise<void> => {
    if (!props.storage) {
      return;
    }
    try {
      const blobUrl = version
          ? await storageVersions.downloadVersion(props.storage, projectName, version.versionId)
          : await storageProject.downloadProject(props.storage, projectName);
      // The file name is used as the project name when the file is uploaded, so it has only
      // letters, digits, and underscores. The current project's file is named like it is when
      // the project is downloaded.
      const d = version ? new Date(version.createdAt) : new Date(NaN);
      const pad = (n: number): string => String(n).padStart(2, '0');
      const timestamp = isNaN(d.getTime()) ? '' :
          '_' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
          '_' + pad(d.getHours()) + pad(d.getMinutes());
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = projectName + timestamp + storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error('Failed to download version:', e);
      props.setAlertErrorMessage(t('DOWNLOAD_FAILED'));
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

  /** Asks for the name of a new project to save a version (or the current project) as. */
  const openRestoreAsNewDialog = async (
      version: storageVersions.VersionInfo | null): Promise<void> => {
    if (!props.storage) {
      return;
    }
    const projectNames = await storageProject.listProjectNames(props.storage);
    setAllProjectNames(projectNames);
    setNewProjectName(storageNames.makeUniqueName(projectName, projectNames));
    setSaveAsSource({ version });
  };

  const isNewProjectNameValid = storageNames.isValidClassName(newProjectName.trim()) &&
      !allProjectNames.includes(newProjectName.trim());

  const handleRestoreAsNew = async (): Promise<void> => {
    if (!props.storage || !saveAsSource || !isNewProjectNameValid) {
      return;
    }
    const name = newProjectName.trim();
    setBusy(true);
    try {
      await autosave.triggerSave();
      if (saveAsSource.version) {
        await storageVersions.restoreVersionAsNewProject(
            props.storage, projectName, saveAsSource.version.versionId, name);
      } else {
        // Like a version saved as a new project, the copy has a new projectId and no versions.
        await storageProject.copyProject(props.storage, projectName, name);
      }
      props.setCurrentProject(await storageProject.fetchProject(props.storage, name));
      setSaveAsSource(null);
      props.onClose();
    } catch (e) {
      console.error('Failed to restore version as a new project:', e);
      props.setAlertErrorMessage(t('VERSIONS.RESTORE_FAILED'));
    } finally {
      setBusy(false);
    }
  };

  /**
   * Renders the Restore button, which restores the project to the version. It is disabled if the
   * version is the same as the current project.
   */
  const renderRestoreButton = (
      version: storageVersions.VersionInfo, hasChanges: boolean): React.JSX.Element => (
    <Antd.Tooltip title={hasChanges ? undefined : t('VERSIONS.SAME_AS_CURRENT')}>
      <Antd.Button
        size="small"
        icon={<RollbackOutlined />}
        disabled={!hasChanges}
        onClick={() => confirmRestoreHere(version)}
      >
        {t('VERSIONS.RESTORE')}
      </Antd.Button>
    </Antd.Tooltip>
  );

  /** Returns the title of the dialog for saving a version (or the current project) as a new one. */
  const getSaveAsTitle = (version: storageVersions.VersionInfo | null): string =>
      version ? t('VERSIONS.RESTORE_AS_NEW') : t('VERSIONS.SAVE_AS_NEW_PROJECT');

  /**
   * Renders the Save As button, which makes a new project from the version (or the current
   * project, if version is null).
   */
  const renderSaveAsButton = (version: storageVersions.VersionInfo | null): React.JSX.Element => (
    <Antd.Tooltip title={getSaveAsTitle(version)}>
      <Antd.Button
        size="small" icon={<CopyOutlined />} onClick={() => openRestoreAsNewDialog(version)}>
        {t('VERSIONS.SAVE_AS') + '...'}
      </Antd.Button>
    </Antd.Tooltip>
  );

  /** Returns the text for a version in a menu: its description (if it has one) and date. */
  const getVersionMenuLabel = (version: storageVersions.VersionInfo): string =>
      version.description
          ? version.description + ' (' + formatDate(version.createdAt) + ')'
          : [formatDate(version.createdAt), ...version.tags.map(tagLabel)].join(' · ');

  /**
   * Renders the buttons for comparing the version with the current project, and with another
   * version. For the current project (if version is null), there is only the second one.
   */
  const renderCompareButtons = (version: storageVersions.VersionInfo | null): React.JSX.Element => {
    const otherVersions = versions.filter(v => v.versionId !== version?.versionId);
    return (
      <>
        {version && (
          <Antd.Button size="small" icon={<DiffOutlined />} onClick={() => handleCompare(version)}>
            {t('VERSIONS.COMPARE_WITH_CURRENT')}
          </Antd.Button>
        )}
        <Antd.Dropdown
          disabled={otherVersions.length === 0}
          trigger={['click']}
          menu={{
            style: { maxHeight: 360, overflowY: 'auto' },
            items: otherVersions.map(v => ({
              key: v.versionId,
              label: getVersionMenuLabel(v),
            })),
            onClick: ({ key }) => {
              const otherVersion = otherVersions.find(v => v.versionId === key);
              if (otherVersion) {
                // Comparing the current project with a version is comparing the version with it.
                handleCompare(version ?? otherVersion, version ? otherVersion : undefined);
              }
            },
          }}
        >
          <Antd.Button size="small" icon={<DiffOutlined />} disabled={otherVersions.length === 0}>
            <Antd.Space size={4}>
              {t('VERSIONS.COMPARE_WITH_VERSION')}
              <DownOutlined />
            </Antd.Space>
          </Antd.Button>
        </Antd.Dropdown>
      </>
    );
  };

  /** Returns the time from which versions are shown, or null if there is no such limit. */
  const getFilterStart = (): number | null => {
    if (dateFilter === 'custom') {
      return customRange?.[0] ? customRange[0].startOf('day').valueOf() : null;
    }
    const days = DATE_FILTER_DAYS[dateFilter];
    if (days === undefined) {
      return null;
    }
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return startOfToday.getTime() - (days - 1) * DAY_MS;
  };

  /** Returns the time until which versions are shown, or null if there is no such limit. */
  const getFilterEnd = (): number | null =>
      (dateFilter === 'custom' && customRange?.[1])
          ? customRange[1].endOf('day').valueOf() : null;

  const normalizedSearchText = searchText.trim().toLowerCase();
  const isFiltered = dateFilter !== 'all' || tagFilter.length > 0 || onlyWithDescription ||
      normalizedSearchText !== '';

  const clearFilters = (): void => {
    setDateFilter('all');
    setCustomRange(null);
    setTagFilter([]);
    setTagFilterMode('OR');
    setOnlyWithDescription(false);
    setSearchText('');
    setPage(1);
  };

  const filterStart = getFilterStart();
  const filterEnd = getFilterEnd();
  const filteredVersions = versions.filter(version => {
    const createdAt = new Date(version.createdAt).getTime();
    return (filterStart === null || createdAt >= filterStart) &&
        (filterEnd === null || createdAt <= filterEnd) &&
        (tagFilter.length === 0 || (tagFilterMode === 'AND'
            ? tagFilter.every(tag => version.tags.includes(tag))
            : tagFilter.some(tag => version.tags.includes(tag)))) &&
        (!onlyWithDescription || version.description !== '') &&
        // Tags are searched as they are shown, so built-in tags match in the user's language.
        (!normalizedSearchText ||
            version.description.toLowerCase().includes(normalizedSearchText) ||
            version.notes.toLowerCase().includes(normalizedSearchText) ||
            version.tags.some(tag => tagLabel(tag).toLowerCase().includes(normalizedSearchText)));
  });
  // If versions were deleted or filtered out, the page might not exist anymore.
  const pageCount = Math.max(1, Math.ceil(filteredVersions.length / VERSIONS_PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageVersions = filteredVersions.slice(
      (currentPage - 1) * VERSIONS_PAGE_SIZE, currentPage * VERSIONS_PAGE_SIZE);
  // The current project is at the top of every page.
  const rows: ListRow[] = [
    { key: CURRENT_ROW_KEY, version: null },
    ...pageVersions.map(version => ({ key: version.versionId, version })),
  ];

  /** Changes a filter, and goes back to the first page. */
  const changeFilter = <T,>(setter: (value: T) => void) => (value: T): void => {
    setter(value);
    setPage(1);
  };

  const toggleTagFilter = (tag: string, checked: boolean): void => {
    setTagFilter(f => checked ? [...f, tag] : f.filter(t => t !== tag));
    setPage(1);
  };

  const renderFilterPanel = (): React.JSX.Element => (
    // The box shows which controls appeared when the Filter button was clicked.
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 8, padding: 12,
      border: `1px solid ${token.colorBorderSecondary}`, borderRadius: token.borderRadiusLG,
      background: token.colorFillQuaternary,
    }}>
      <Antd.Input
        allowClear
        size="small"
        placeholder={t('VERSIONS.SEARCH_PLACEHOLDER')}
        value={searchText}
        onChange={(e) => changeFilter(setSearchText)(e.target.value)}
      />
      {/* This is near the top, since it is probably the most used. */}
      <Antd.Checkbox
        checked={onlyWithDescription}
        onChange={(e) => changeFilter(setOnlyWithDescription)(e.target.checked)}
        // Only the checkbox and its label are clickable, not the rest of the line.
        style={{ alignSelf: 'flex-start' }}
      >
        {t('VERSIONS.FILTER_ONLY_WITH_DESCRIPTION')}
      </Antd.Checkbox>
      <Antd.Space wrap>
        <Antd.Segmented<DateFilter>
          size="small"
          value={dateFilter}
          onChange={changeFilter(setDateFilter)}
          options={(Object.keys(DATE_FILTER_LABEL_KEYS) as DateFilter[]).map(filter => ({
            value: filter,
            label: t(DATE_FILTER_LABEL_KEYS[filter]),
          }))}
        />
        {dateFilter === 'custom' && (
          <Antd.DatePicker.RangePicker
            size="small"
            value={customRange}
            onChange={changeFilter(setCustomRange)}
            allowEmpty={[true, true]}
          />
        )}
      </Antd.Space>
      {allTags.length > 0 && (
        <Antd.Space size={4} wrap>
          <Antd.Typography.Text type="secondary">{t('VERSIONS.FILTER_TAGS')}</Antd.Typography.Text>
          <Antd.Tooltip title={t('VERSIONS.TAG_FILTER_MODE_TOOLTIP')}>
            <Antd.Switch
              size="small"
              checked={tagFilterMode === 'AND'}
              onChange={(checked) => changeFilter(setTagFilterMode)(checked ? 'AND' : 'OR')}
              checkedChildren={t('VERSIONS.TAG_FILTER_MODE_AND')}
              unCheckedChildren={t('VERSIONS.TAG_FILTER_MODE_OR')}
              style={{ marginRight: 8 }}
            />
          </Antd.Tooltip>
          {allTags.map(tag => (
            <Antd.Tag.CheckableTag
              key={tag}
              checked={tagFilter.includes(tag)}
              onChange={(checked) => toggleTagFilter(tag, checked)}
              style={{ border: `1px solid ${token.colorBorder}` }}
            >
              {tagLabel(tag)}
            </Antd.Tag.CheckableTag>
          ))}
        </Antd.Space>
      )}
    </div>
  );

  /**
   * Renders the Filter button, which shows or hides the filters, and, when the list is filtered,
   * how many versions are shown. That stays when the filters are hidden, so it is clear why
   * versions are missing.
   */
  const renderFilters = (): React.JSX.Element => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
      <Antd.Space size={8} wrap>
        <Antd.Button
          size="small"
          icon={<FilterOutlined />}
          type={filtersOpen ? 'primary' : 'default'}
          onClick={() => setFiltersOpen(open => !open)}
        >
          {t('VERSIONS.FILTER')}
        </Antd.Button>
        {isFiltered && (
          <Antd.Space size={4}>
            <Antd.Typography.Text type="secondary">
              {t('VERSIONS.FILTER_SHOWING', {
                count: filteredVersions.length, total: versions.length })}
            </Antd.Typography.Text>
            <Antd.Button size="small" type="link" onClick={clearFilters}>
              {t('VERSIONS.FILTER_CLEAR')}
            </Antd.Button>
          </Antd.Space>
        )}
      </Antd.Space>
      {filtersOpen && renderFilterPanel()}
    </div>
  );

  const columns: Antd.TableProps<ListRow>['columns'] = [
    {
      title: t('VERSIONS.DESCRIPTION'),
      key: 'description',
      render: (_: unknown, row: ListRow) => {
        if (!row.version) {
          return (
            <Antd.Space size={8}>
              <Antd.Typography.Text strong>{t('VERSIONS.CURRENT')}</Antd.Typography.Text>
              <Antd.Typography.Text type="secondary">
                {t('VERSIONS.CURRENT_DESCRIPTION')}
              </Antd.Typography.Text>
            </Antd.Space>
          );
        }
        const notes = row.version.notes;
        return (
          <Antd.Space size={8}>
            {row.version.description || (
              <Antd.Typography.Text type="secondary">
                {t('VERSIONS.NO_DESCRIPTION')}
              </Antd.Typography.Text>
            )}
            {/* The notes are only shown when the icon is hovered, to keep the list compact. */}
            {notes && (
              <Antd.Tooltip
                title={
                  <div style={{ whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto' }}>
                    {notes}
                  </div>
                }
              >
                <FileTextOutlined
                  aria-label={t('VERSIONS.NOTES')}
                  style={{ color: token.colorTextSecondary }}
                />
              </Antd.Tooltip>
            )}
          </Antd.Space>
        );
      },
    },
    {
      title: t('VERSIONS.TAGS'),
      key: 'tags',
      width: 240,
      render: (_: unknown, row: ListRow) => row.version && <VersionTagList tags={row.version.tags} />,
    },
    {
      title: t('VERSIONS.CREATED'),
      key: 'createdAt',
      width: 200,
      render: (_: unknown, row: ListRow) => row.version && formatDate(row.version.createdAt),
    },
    {
      title: t('VERSIONS.ACTIONS'),
      key: 'actions',
      width: 180,
      render: (_: unknown, row: ListRow) => (
        // Clicking a row shows its details, so clicks on these buttons (and their popups, whose
        // events bubble through React) shouldn't reach the row.
        <div onClick={(e) => e.stopPropagation()}>
          {row.version ? renderVersionActions(row.version) : (
            <Antd.Button
              size="small"
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateDialog}
              disabled={!props.storage || !projectName}
            >
              {t('VERSIONS.CREATE')}
            </Antd.Button>
          )}
        </div>
      ),
    },
  ];

  /** Renders the buttons for editing a version's description and tags, and deleting it. */
  const renderVersionActions = (version: storageVersions.VersionInfo): React.JSX.Element => (
    <Antd.Space size={4}>
      <Antd.Tooltip title={t('VERSIONS.EDIT_DESCRIPTION')}>
        <Antd.Button size="small" icon={<EditOutlined />} onClick={() => openEditDialog(version)} />
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
  );

  const renderVersionList = (): React.JSX.Element => (
    <>
      {versions.length > 0 && renderFilters()}
      <Antd.Table<ListRow>
        rowKey="key"
        size="small"
        loading={loading || busy}
        columns={columns}
        dataSource={rows}
        pagination={false}
        onRow={(row) => ({
          onClick: () => openDetails(row.version),
          style: { cursor: 'pointer' },
        })}
      />
      {!loading && filteredVersions.length === 0 && (
        <Antd.Empty
          image={Antd.Empty.PRESENTED_IMAGE_SIMPLE}
          description={versions.length === 0
              ? t('VERSIONS.NO_VERSIONS') : t('VERSIONS.NO_MATCHING_VERSIONS')}
          style={{ marginTop: 24 }}
        >
          {versions.length > 0 && (
            <Antd.Button size="small" onClick={clearFilters}>{t('VERSIONS.FILTER_CLEAR')}</Antd.Button>
          )}
        </Antd.Empty>
      )}
      {filteredVersions.length > VERSIONS_PAGE_SIZE && (
        <Antd.Pagination
          style={{ marginTop: 12, justifyContent: 'flex-end' }}
          size="small"
          current={currentPage}
          pageSize={VERSIONS_PAGE_SIZE}
          total={filteredVersions.length}
          onChange={setPage}
          showSizeChanger={false}
          showTotal={(total, range) =>
              t('PAGINATION_ITEMS', { range0: range[0], range1: range[1], total })}
        />
      )}
    </>
  );

  /** Renders a list of modules, with the selected one highlighted. */
  const renderModuleList = (
      moduleDiffs: versionDiff.ModuleDiff[], selected: string, onSelect: (moduleId: string) => void,
      showChanges: boolean): React.JSX.Element => (
    <div style={{ width: MODULE_LIST_WIDTH, flex: '0 0 auto', overflow: 'auto' }}>
      <Antd.List
        size="small"
        dataSource={moduleDiffs}
        renderItem={(diff) => {
          const className = diff.rightClassName ?? diff.leftClassName!;
          const renamed = diff.leftClassName && diff.rightClassName &&
              diff.leftClassName !== diff.rightClassName;
          return (
            <Antd.List.Item
              onClick={() => onSelect(diff.moduleId)}
              style={{
                cursor: 'pointer',
                paddingInline: 8,
                background: diff.moduleId === selected ? token.controlItemBgActive : undefined,
              }}
            >
              <Antd.List.Item.Meta
                avatar={TabTypeUtils.getIcon(MODULE_TYPE_TO_TAB_TYPE[diff.moduleType])}
                title={className}
                description={renamed
                    ? t('VERSIONS.RENAMED_FROM', { name: diff.leftClassName }) : undefined}
              />
              {showChanges && (
                <Antd.Tag style={getStatusTagStyle(token, CHANGE_TAG_STATUSES[diff.change])}>
                  {t(CHANGE_LABEL_KEYS[diff.change])}
                </Antd.Tag>
              )}
            </Antd.List.Item>
          );
        }}
      />
    </div>
  );

  /**
   * Renders the details of a version: when it was created, its tags and description, what can be
   * done with it, and its blocks, which can be looked at but not changed. The current project's
   * details (if d.version is null) are the same, except for what doesn't apply to it: it has no
   * date, tags, or description, and can't be restored or compared with itself.
   */
  const renderDetails = (d: Details): React.JSX.Element => {
    const selected = d.moduleDiffs.find(diff => diff.moduleId === detailsModuleId) ?? null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: '0 0 auto', marginBottom: 12 }}>
          {d.version ? (
            <>
              {/* The title is the version's description, or its date if it has no description
                  (see getVersionLabel), so whichever one is in the title isn't repeated here.
                  It is on its own line, above the buttons: Space is inline unless it is flex. */}
              <Antd.Space size={8} wrap style={{ display: 'flex', marginBottom: 8 }}>
                {d.version.description ? (
                  <Antd.Typography.Text strong>
                    {formatDate(d.version.createdAt)}
                  </Antd.Typography.Text>
                ) : (
                  <Antd.Typography.Text type="secondary">
                    {t('VERSIONS.NO_DESCRIPTION')}
                  </Antd.Typography.Text>
                )}
                <VersionTagList tags={d.version.tags} />
                <Antd.Tooltip title={t('VERSIONS.EDIT_DESCRIPTION')}>
                  <Antd.Button
                    size="small" type="text" icon={<EditOutlined />}
                    onClick={() => openEditDialog(d.version!)} />
                </Antd.Tooltip>
              </Antd.Space>
              {d.version.notes && (
                <Antd.Typography.Paragraph
                  style={{ whiteSpace: 'pre-wrap', marginBottom: 8, maxHeight: 120, overflowY: 'auto' }}
                >
                  {d.version.notes}
                </Antd.Typography.Paragraph>
              )}
            </>
          ) : (
            <Antd.Typography.Paragraph type="secondary" style={{ marginBottom: 8 }}>
              {t('VERSIONS.CURRENT_DESCRIPTION')}
            </Antd.Typography.Paragraph>
          )}
          <Antd.Space size={8} wrap>
            {d.version ? renderRestoreButton(d.version, d.hasChanges) : (
              <Antd.Button
                size="small" type="primary" icon={<PlusOutlined />} onClick={openCreateDialog}>
                {t('VERSIONS.CREATE')}
              </Antd.Button>
            )}
            {renderSaveAsButton(d.version)}
            <Antd.Button
              size="small" icon={<DownloadOutlined />}
              onClick={() => handleDownloadVersion(d.version)}
            >
              {t('DOWNLOAD')}
            </Antd.Button>
            <Antd.Divider orientation="vertical" />
            {renderCompareButtons(d.version)}
          </Antd.Space>
        </div>
        <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, gap: 12 }}>
          {renderModuleList(d.moduleDiffs, detailsModuleId, setDetailsModuleId, false)}
          <div style={{ flex: '1 1 auto', minWidth: 0, border: previewBorder }}>
            {selected?.rightContentText && (
              <ReadOnlyBlocklyPreview
                key={selected.moduleId}
                moduleContentText={selected.rightContentText}
                theme={props.theme}
                renderer={props.renderer}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

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
      <div style={{ flex: '1 1 auto', minHeight: 0, border: previewBorder }}>
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
      ? selectedDiff.blockDiff.addedGroups.size + selectedDiff.blockDiff.removedGroups.size +
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
      ...[...blockDiff.removedGroups].map(blockId => ({ blockId, panes: ['left'] as Pane[] })),
      ...[...blockDiff.changed].map(
          blockId => ({ blockId, panes: ['right', 'left'] as Pane[] })),
      ...[...blockDiff.addedGroups].map(blockId => ({ blockId, panes: ['right'] as Pane[] })),
    ];
    const getPosition = (change: BlockChange): Blockly.utils.Coordinate =>
        workspacesRef.current[change.panes[0]]?.getBlockById(change.blockId)
            ?.getRelativeToSurfaceXY() ?? new Blockly.utils.Coordinate(0, 0);
    const positions = new Map(changes.map(change => [change, getPosition(change)]));
    return changes.sort((a, b) =>
        (positions.get(a)!.y - positions.get(b)!.y) || (positions.get(a)!.x - positions.get(b)!.x));
  };

  /** Scrolls the panes to the change at the given index. */
  const goToChange = (index: number): void => {
    const changes = getChanges();
    if (!changes.length) {
      return;
    }
    const i = Math.min(Math.max(index, 0), changes.length - 1);
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
        disabled={changeCount === 0 || changeIndex <= 0}
        onClick={() => goToChange(changeIndex - 1)}
      >
        {t('VERSIONS.PREVIOUS_CHANGE')}
      </Antd.Button>
      <Antd.Button
        size="small"
        icon={<ArrowDownOutlined />}
        disabled={changeCount === 0 || changeIndex >= changeCount - 1}
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
          {!c.rightVersion && renderRestoreButton(c.leftVersion, c.hasChanges)}
          {!c.rightVersion && renderSaveAsButton(c.leftVersion)}
          <Antd.Space size={16} style={{ marginLeft: 16 }}>
            {renderLegendItem('var(--mrc-diff-added)', t('VERSIONS.LEGEND_ADDED'))}
            {renderLegendItem('var(--mrc-diff-removed)', t('VERSIONS.LEGEND_REMOVED'))}
            {renderLegendItem('var(--mrc-diff-changed)', t('VERSIONS.LEGEND_CHANGED'))}
            {renderLegendItem('var(--mrc-diff-moved)', t('VERSIONS.LEGEND_MOVED'), 'dotted')}
          </Antd.Space>
        </Antd.Space>
        <div style={{ display: 'flex', flex: '1 1 auto', minHeight: 0, gap: 12 }}>
          {renderModuleList(c.moduleDiffs, selectedModuleId, selectModule, true)}
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

  /**
   * In the compare view, goes back to the version's details (or the list of versions). In the
   * details, goes back to the list of versions. Otherwise, closes the dialog.
   */
  const handleCloseOrBack = (): void => {
    if (comparison) {
      setComparison(null);
      setSelectedModuleId('');
    } else if (details) {
      setDetails(null);
      setDetailsModuleId('');
    } else {
      props.onClose();
    }
  };

  const getTitle = (): string => {
    if (comparison) {
      return t('VERSIONS.COMPARE_TITLE');
    }
    if (details) {
      return details.version
          ? t('VERSIONS.DETAILS_TITLE', { name: getVersionLabel(details.version) })
          : t('VERSIONS.CURRENT');
    }
    return t('VERSIONS.TITLE');
  };

  return (
    <>
      {contextHolder}
      <Antd.Modal
        title={getTitle()}
        open={props.isOpen}
        onCancel={handleCloseOrBack}
        footer={[
          (comparison || details) ? (
            <Antd.Button key="back" icon={<ArrowLeftOutlined />} onClick={handleCloseOrBack}>
              {t('VERSIONS.BACK')}
            </Antd.Button>
          ) : (
            <Antd.Button key="close" type="primary" onClick={handleCloseOrBack}>
              {t('OK')}
            </Antd.Button>
          ),
        ]}
        width={MODAL_WIDTH}
        style={{ top: MODAL_TOP }}
        styles={{ body: { height: MODAL_BODY_HEIGHT, overflow: 'auto', ...diffColors } }}
      >
        {comparison ? renderComparison(comparison)
            : details ? renderDetails(details)
            : renderVersionList()}
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
        <VersionFields autoFocus value={fields} onChange={setFields} knownTags={allTags} />
      </Antd.Modal>

      <Antd.Modal
        title={getSaveAsTitle(saveAsSource?.version ?? null)}
        open={saveAsSource !== null}
        onCancel={() => setSaveAsSource(null)}
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
