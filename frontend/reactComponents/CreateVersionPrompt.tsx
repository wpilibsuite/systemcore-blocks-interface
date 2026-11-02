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
 * @fileoverview Asks the user whether to create a version before deploying or downloading.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageVersions from '../storage/versions';

/** What the user is about to do, which sets the version's default description. */
export type CreateVersionReason = 'deploy' | 'download';

/** The default description of the version for each reason. */
const DESCRIPTION_KEYS: Record<CreateVersionReason, string> = {
  deploy: 'VERSIONS.DEPLOYED_DESCRIPTION',
  download: 'VERSIONS.DOWNLOADED_DESCRIPTION',
};

type PendingPrompt = {
  storage: commonStorage.Storage,
  projectName: string,
  reason: CreateVersionReason,
  resolve: (shouldContinue: boolean) => void,
};

/**
 * Returns a function that asks the user whether to create a version of a project (with an
 * optional description) before deploying or downloading it, and the element that shows the
 * prompt, which must be rendered. The function resolves to true if the user created a version or
 * chose not to, and to false if the user cancelled (or creating the version failed). It doesn't
 * ask, and resolves to true, if the project hasn't changed since its newest version.
 */
export function useCreateVersionPrompt(setAlertErrorMessage: (message: string) => void): {
  askToCreateVersion: (
      storage: commonStorage.Storage, projectName: string,
      reason: CreateVersionReason) => Promise<boolean>,
  createVersionPrompt: React.JSX.Element,
} {
  const {t, i18n} = I18Next.useTranslation();
  const [pending, setPending] = React.useState<PendingPrompt | null>(null);
  const [description, setDescription] = React.useState('');
  const [creating, setCreating] = React.useState(false);

  const askToCreateVersion = async (
      storage: commonStorage.Storage, projectName: string,
      reason: CreateVersionReason): Promise<boolean> => {
    // There's no need for a version if the project hasn't changed since the newest one.
    try {
      if (!await storageVersions.hasChangesSinceLatestVersion(storage, projectName)) {
        return true;
      }
    } catch (e) {
      // Ask anyway, so the user can still create a version.
      console.error('Failed to compare with the newest version:', e);
    }
    return new Promise<boolean>((resolve) => {
      setDescription(t(DESCRIPTION_KEYS[reason],
          { dateTime: new Date().toLocaleString(
              i18n.language, { dateStyle: 'short', timeStyle: 'short' }) }));
      setPending({ storage, projectName, reason, resolve });
    });
  };

  const finish = (shouldContinue: boolean): void => {
    pending?.resolve(shouldContinue);
    setPending(null);
  };

  const handleCreate = async (): Promise<void> => {
    if (!pending) {
      return;
    }
    setCreating(true);
    try {
      await storageVersions.createVersion(pending.storage, pending.projectName, description);
      finish(true);
    } catch (e) {
      console.error('Failed to create version:', e);
      setAlertErrorMessage(t('VERSIONS.CREATE_FAILED'));
      finish(false);
    } finally {
      setCreating(false);
    }
  };

  const createVersionPrompt = (
    <Antd.Modal
      title={t('VERSIONS.PROMPT_TITLE')}
      open={pending !== null}
      onCancel={() => finish(false)}
      footer={[
        <Antd.Button key="cancel" onClick={() => finish(false)}>
          {t('CANCEL')}
        </Antd.Button>,
        <Antd.Button key="skip" onClick={() => finish(true)}>
          {t('VERSIONS.SKIP')}
        </Antd.Button>,
        <Antd.Button key="create" type="primary" loading={creating} onClick={handleCreate}>
          {t('VERSIONS.CREATE')}
        </Antd.Button>,
      ]}
    >
      <Antd.Typography.Paragraph>
        {t('VERSIONS.PROMPT_MESSAGE')}
      </Antd.Typography.Paragraph>
      <Antd.Input.TextArea
        rows={3}
        value={description}
        placeholder={t('VERSIONS.DESCRIPTION_PLACEHOLDER')}
        onChange={(e) => setDescription(e.target.value)}
      />
    </Antd.Modal>
  );

  return { askToCreateVersion, createVersionPrompt };
}
