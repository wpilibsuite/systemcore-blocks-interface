// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Shows versions in lists of versions: their descriptions, dates, and tags, and the
 * bar for the current project above them.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as storageVersions from '../storage/versions';
import { VersionTagList } from './VersionTags';

/** Returns a function that formats the date and time when a version was created. */
export function useFormatVersionDate(): (isoDate: string) => string {
  const {i18n} = I18Next.useTranslation();
  return (isoDate: string) => isoDate ? new Date(isoDate).toLocaleString(
      i18n.language, { dateStyle: 'short', timeStyle: 'short' }) : '';
}

/**
 * Shows an icon if a version has notes, with the notes in its tooltip. The notes are only shown
 * when the icon is hovered, to keep things compact.
 */
export function VersionNotesIcon(
    props: { version: storageVersions.VersionInfo }): React.JSX.Element | null {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const notes = props.version.notes;
  if (!notes) {
    return null;
  }
  return (
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
  );
}

/** Shows a version's description, and an icon if it has notes. */
export function VersionDescription(
    props: { version: storageVersions.VersionInfo }): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  return (
    <Antd.Space size={8}>
      {props.version.description || (
        <Antd.Typography.Text type="secondary">{t('VERSIONS.NO_DESCRIPTION')}</Antd.Typography.Text>
      )}
      <VersionNotesIcon version={props.version} />
    </Antd.Space>
  );
}

/**
 * Returns the columns that every table of versions has: the description, the tags, and when the
 * version was created.
 */
export function useVersionColumns(): NonNullable<
    Antd.TableProps<storageVersions.VersionInfo>['columns']> {
  const {t} = I18Next.useTranslation();
  const formatDate = useFormatVersionDate();
  return [
    {
      title: t('VERSIONS.DESCRIPTION'),
      key: 'description',
      render: (_: unknown, version) => <VersionDescription version={version} />,
    },
    {
      title: t('VERSIONS.TAGS'),
      key: 'tags',
      width: 240,
      render: (_: unknown, version) => <VersionTagList tags={version.tags} />,
    },
    {
      title: t('VERSIONS.CREATED'),
      key: 'createdAt',
      width: 200,
      render: (_: unknown, version) => formatDate(version.createdAt),
    },
  ];
}

interface CurrentVersionBarProps {
  onClick: () => void;
  /** Whether the current project is the one chosen, for example in the version picker. */
  selected?: boolean;
  disabled?: boolean;
  /** Shown at the end of the bar, for example buttons. */
  extra?: React.ReactNode;
}

/**
 * Shows the current project, above the versions in a list, since it isn't filtered or paged like
 * they are. The whole bar can be clicked (or pressed with Enter or Space).
 */
export function CurrentVersionBar(props: CurrentVersionBarProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const click = (): void => {
    if (!props.disabled) {
      props.onClick();
    }
  };
  return (
    <div
      role="button"
      tabIndex={props.disabled ? -1 : 0}
      aria-disabled={props.disabled}
      aria-pressed={props.selected}
      onClick={click}
      onKeyDown={(e) => {
        if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          click();
        }
      }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap',
        flex: '1 1 auto', minWidth: 0, gap: 8, padding: '8px 12px',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
        border: `1px solid ${props.selected ? token.colorPrimary : token.colorBorderSecondary}`,
        borderRadius: token.borderRadiusLG,
        background: props.selected ? token.controlItemBgActive : token.colorFillQuaternary,
      }}
    >
      <Antd.Space size={8} wrap>
        <Antd.Typography.Text strong>{t('VERSIONS.CURRENT')}</Antd.Typography.Text>
        <Antd.Typography.Text type="secondary">{t('VERSIONS.CURRENT_DESCRIPTION')}</Antd.Typography.Text>
      </Antd.Space>
      {/* Clicks in the extra content (such as on its buttons) shouldn't also click the bar. */}
      {props.extra && <div onClick={(e) => e.stopPropagation()}>{props.extra}</div>}
    </div>
  );
}
