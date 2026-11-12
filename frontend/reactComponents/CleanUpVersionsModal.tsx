// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview A dialog for deleting several versions of a project at once. The versions can be
 * filtered the same way as in the version list, to find the ones to delete.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import { ClearOutlined, DeleteOutlined } from '@ant-design/icons';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageVersions from '../storage/versions';
import { DEFAULT_FILTER_DAYS, InitialVersionFilters, useVersionFilters } from './VersionFilters';
import { useVersionColumns } from './VersionDescription';

interface CleanUpVersionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after versions were deleted (or deleting some of them failed). */
  onDeleted: () => Promise<void>;
  storage: commonStorage.Storage | null;
  projectName: string;
  versions: storageVersions.VersionInfo[];
  setAlertErrorMessage: (message: string) => void;
}

/**
 * The size and position of the dialog. It is shown over the Versions dialog, and is the same size,
 * since its filters (which start out shown) and its versions need the room.
 */
const MODAL_WIDTH = '90vw';

/** Leaves equal space above and below for a dialog that is 90% of the viewport height. */
const MODAL_TOP = '5vh';

/** The most the body can be, after the title bar, the footer, and padding. */
const MODAL_BODY_HEIGHT = 'calc(90vh - 165px)';

/**
 * The filters that the dialog starts with: the versions most often cleaned up, which are the ones
 * without a description that are older than a couple of weeks.
 */
const INITIAL_FILTERS: InitialVersionFilters = {
  onlyDescription: true,
  descriptionMode: 'without',
  dateFilter: 'days',
  daysMode: 'olderThan',
  days: DEFAULT_FILTER_DAYS,
};

/**
 * Modal component for choosing versions and deleting them. It starts with the filters shown, and
 * set to the versions most often cleaned up, since finding the versions to delete is what it is
 * for.
 */
export default function CleanUpVersionsModal(
    props: CleanUpVersionsModalProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const [modal, contextHolder] = Antd.Modal.useModal();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [deleting, setDeleting] = React.useState(false);
  const filters = useVersionFilters(props.versions);
  const filteredVersions = filters.filteredVersions;

  React.useEffect(() => {
    if (props.isOpen) {
      setSelectedIds(new Set());
      filters.reset(true, INITIAL_FILTERS);
    }
  }, [props.isOpen]);

  // Only versions that are shown can be selected, so that a version that a filter hides isn't
  // deleted without the user seeing it. Selections are kept while a filter hides them, so they
  // come back when the filter is cleared.
  const selectedVersions = filteredVersions.filter(v => selectedIds.has(v.versionId));

  const toggleSelected = (versionId: string): void => {
    setSelectedIds(ids => {
      const newIds = new Set(ids);
      if (!newIds.delete(versionId)) {
        newIds.add(versionId);
      }
      return newIds;
    });
  };

  /** Selects all of the versions that the filters show, on every page. */
  const selectAll = (): void => {
    setSelectedIds(ids => new Set([...ids, ...filteredVersions.map(v => v.versionId)]));
  };

  const confirmDelete = (): void => {
    const toDelete = selectedVersions;
    if (!toDelete.length) {
      return;
    }
    const deployedCount = toDelete.filter(
        v => v.tags.includes(storageVersions.DEPLOYED_TAG)).length;
    modal.confirm({
      title: t('VERSIONS.DELETE_SELECTED_TITLE', { count: toDelete.length }),
      content: (
        <>
          {deployedCount > 0 && (
            <Antd.Typography.Paragraph>
              {t('VERSIONS.DELETE_SELECTED_DEPLOYED', { count: deployedCount })}
            </Antd.Typography.Paragraph>
          )}
          <Antd.Typography.Paragraph style={{ marginBottom: 0 }}>
            {t('VERSIONS.DELETE_SELECTED_CONTENT')}
          </Antd.Typography.Paragraph>
        </>
      ),
      okText: t('DELETE'),
      okButtonProps: { danger: true },
      cancelText: t('CANCEL'),
      onOk: () => handleDelete(toDelete),
    });
  };

  const handleDelete = async (toDelete: storageVersions.VersionInfo[]): Promise<void> => {
    if (!props.storage) {
      return;
    }
    setDeleting(true);
    let deleted = false;
    try {
      await storageVersions.deleteVersions(
          props.storage, props.projectName, toDelete.map(v => v.versionId));
      deleted = true;
    } catch (e) {
      console.error('Failed to delete versions:', e);
      props.setAlertErrorMessage(t('VERSIONS.DELETE_SELECTED_FAILED'));
    } finally {
      setDeleting(false);
      // Some of the versions might have been deleted even if it failed.
      await props.onDeleted();
    }
    if (deleted) {
      props.onClose();
    }
  };

  const columns = useVersionColumns();

  return (
    <>
      {contextHolder}
      <Antd.Modal
        title={
          <Antd.Space size={8}>
            <ClearOutlined />
            {t('VERSIONS.CLEAN_UP_TITLE')}
          </Antd.Space>
        }
        open={props.isOpen}
        onCancel={props.onClose}
        width={MODAL_WIDTH}
        style={{ top: MODAL_TOP }}
        // It is only as tall as it needs to be.
        styles={{ body: { maxHeight: MODAL_BODY_HEIGHT, overflow: 'auto' } }}
        footer={[
          <Antd.Button key="cancel" onClick={props.onClose}>{t('CANCEL')}</Antd.Button>,
          <Antd.Button
            key="delete"
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={selectedVersions.length === 0}
            loading={deleting}
            onClick={confirmDelete}
          >
            {t('DELETE')}
          </Antd.Button>,
        ]}
      >
        {filters.renderFilters()}
        <Antd.Space size={4} wrap style={{ display: 'flex', marginBottom: 8 }}>
          <Antd.Typography.Text strong>
            {t('VERSIONS.SELECTED_COUNT', { count: selectedVersions.length })}
          </Antd.Typography.Text>

          {/* The count makes it clear that this selects the versions on every page. */}
          <Antd.Button
            size="small" type="link" onClick={selectAll}
            disabled={filteredVersions.length === 0 ||
                selectedVersions.length === filteredVersions.length}
          >
            {t('VERSIONS.SELECT_ALL', { count: filteredVersions.length })}
          </Antd.Button>

          <Antd.Button
            size="small" type="link" onClick={() => setSelectedIds(new Set())}
            disabled={selectedVersions.length === 0}
          >
            {t('VERSIONS.CLEAR_SELECTION')}
          </Antd.Button>
        </Antd.Space>
        <Antd.Table<storageVersions.VersionInfo>
          rowKey="versionId"
          size="small"
          // The table's edge shadows (::before and ::after of .ant-table-container) stick out
          // 1px below it, which makes the dialog body scroll when the table is last in it.
          style={{ marginBottom: 1 }}
          loading={deleting}
          columns={columns}
          dataSource={filters.pageVersions}
          pagination={false}
          rowSelection={{
            selectedRowKeys: selectedVersions.map(v => v.versionId),
            // Select All is used instead, since this would only select the page.
            hideSelectAll: true,
            onSelect: (version) => toggleSelected(version.versionId),
          }}
          onRow={(version) => ({
            // Clicking the checkbox selects the version already (onSelect), and the click also
            // reaches the row, which would unselect it again.
            onClick: (e) => {
              if (!(e.target as HTMLElement).closest('.ant-table-selection-column')) {
                toggleSelected(version.versionId);
              }
            },
            style: { cursor: 'pointer' },
          })}
          locale={{ emptyText: t('VERSIONS.NO_MATCHING_VERSIONS') }}
        />
        {filters.renderPagination()}
      </Antd.Modal>
    </>
  );
}
