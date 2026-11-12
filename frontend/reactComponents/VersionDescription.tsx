// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Shows a version's description and date in lists of versions.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as storageVersions from '../storage/versions';

/** Returns a function that formats the date and time when a version was created. */
export function useFormatVersionDate(): (isoDate: string) => string {
  const {i18n} = I18Next.useTranslation();
  return (isoDate: string) => isoDate ? new Date(isoDate).toLocaleString(
      i18n.language, { dateStyle: 'short', timeStyle: 'short' }) : '';
}

/**
 * Shows a version's description, and an icon if it has notes. The notes are only shown when the
 * icon is hovered, to keep the list compact.
 */
export function VersionDescription(
    props: { version: storageVersions.VersionInfo }): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const { description, notes } = props.version;
  return (
    <Antd.Space size={8}>
      {description || (
        <Antd.Typography.Text type="secondary">{t('VERSIONS.NO_DESCRIPTION')}</Antd.Typography.Text>
      )}
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
}
