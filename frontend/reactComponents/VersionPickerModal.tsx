// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview A dialog for choosing a version (or the current project), for example for one side
 * of a comparison. It lists the versions like the Versions dialog does, without the buttons for
 * changing them.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as storageVersions from '../storage/versions';
import { useVersionFilters } from './VersionFilters';
import { CurrentVersionBar, useVersionColumns } from './VersionDescription';

/** A version, or the current project if it is null. */
export type VersionChoice = storageVersions.VersionInfo | null;

interface VersionPickerModalProps {
  isOpen: boolean;
  /**
   * Whether the dialog that shows the picker is open. The filters are kept between the times the
   * picker is shown while it is, so they don't have to be set again, and are reset when it opens.
   */
  ownerOpen: boolean;
  title: string;
  versions: storageVersions.VersionInfo[];
  /** The choice that is shown as chosen, if there is one. */
  selected?: VersionChoice;
  /** A choice that can't be chosen, for example the one on the other side of a comparison. */
  disabled?: VersionChoice;
  onChoose: (choice: VersionChoice) => void;
  onClose: () => void;
}

/** The size and position of the dialog, which are the same as the Versions dialog's. */
const MODAL_WIDTH = '90vw';
const MODAL_TOP = '5vh';
const MODAL_BODY_HEIGHT = 'calc(90vh - 165px)';

/** Returns whether a choice is the given version (or the current project, if it is null). */
function isChoice(choice: VersionChoice | undefined, version: VersionChoice): boolean {
  return choice !== undefined && (choice?.versionId ?? null) === (version?.versionId ?? null);
}

/**
 * Modal component for choosing a version or the current project. Clicking one chooses it and
 * closes the dialog.
 */
export default function VersionPickerModal(props: VersionPickerModalProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const columns = useVersionColumns();
  const filters = useVersionFilters(props.versions);

  React.useEffect(() => {
    if (props.ownerOpen) {
      filters.reset(false);
    }
  }, [props.ownerOpen]);

  const choose = (choice: VersionChoice): void => {
    if (!isChoice(props.disabled, choice)) {
      props.onChoose(choice);
    }
  };

  const selectedVersionId = props.selected?.versionId;

  return (
    <Antd.Modal
      title={props.title}
      open={props.isOpen}
      onCancel={props.onClose}
      width={MODAL_WIDTH}
      style={{ top: MODAL_TOP }}
      // It is only as tall as it needs to be.
      styles={{ body: { maxHeight: MODAL_BODY_HEIGHT, overflow: 'auto' } }}
      footer={<Antd.Button onClick={props.onClose}>{t('CANCEL')}</Antd.Button>}
    >
      <div style={{ display: 'flex', marginBottom: 12 }}>
        <CurrentVersionBar
          onClick={() => choose(null)}
          selected={props.selected === null}
          disabled={props.disabled === null}
        />
      </div>
      {props.versions.length > 0 && filters.renderFilters()}
      <Antd.Table<storageVersions.VersionInfo>
        rowKey="versionId"
        size="small"
        // The table's edge shadows (::before and ::after of .ant-table-container) stick out
        // 1px below it, which makes the dialog body scroll when the table is last in it.
        style={{ marginBottom: 1 }}
        columns={columns}
        dataSource={filters.pageVersions}
        pagination={false}
        // The radio buttons show which version is chosen, and which one can't be.
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedVersionId ? [selectedVersionId] : [],
          getCheckboxProps: (version) => ({ disabled: isChoice(props.disabled, version) }),
          onSelect: (version) => choose(version),
        }}
        onRow={(version) => ({
          // Clicking the radio button chooses the version already (onSelect).
          onClick: (e) => {
            if (!(e.target as HTMLElement).closest('.ant-table-selection-column')) {
              choose(version);
            }
          },
          style: { cursor: isChoice(props.disabled, version) ? 'not-allowed' : 'pointer' },
        })}
        locale={{
          emptyText: (
            <Antd.Empty
              image={Antd.Empty.PRESENTED_IMAGE_SIMPLE}
              description={props.versions.length === 0
                  ? t('VERSIONS.NO_VERSIONS') : t('VERSIONS.NO_MATCHING_VERSIONS')}
            >
              {props.versions.length > 0 && (
                <Antd.Button size="small" onClick={filters.clearFilters}>
                  {t('VERSIONS.FILTER_CLEAR')}
                </Antd.Button>
              )}
            </Antd.Empty>
          ),
        }}
      />
      {filters.renderPagination()}
    </Antd.Modal>
  );
}
