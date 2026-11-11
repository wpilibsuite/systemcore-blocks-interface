// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Asks the user whether to create a version before deploying or downloading.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageVersions from '../storage/versions';
import { collectTags } from './VersionTags';
import { EMPTY_VERSION_FIELD_VALUES, VersionFieldValues, VersionFields } from './VersionFields';

/** What the user is about to do, which sets the version's tag. */
export type CreateVersionReason = 'deploy' | 'download';

/** The tag of the version for each reason. */
const REASON_TAGS: Record<CreateVersionReason, string> = {
  deploy: storageVersions.DEPLOYED_TAG,
  download: storageVersions.DOWNLOADED_TAG,
};

type PendingPrompt = {
  storage: commonStorage.Storage,
  projectName: string,
  // The tags of the project's other versions, offered as choices.
  knownTags: string[],
  resolve: (shouldContinue: boolean) => void,
};

/**
 * Returns a function that asks the user whether to create a version of a project (with an
 * optional description) before deploying or downloading it, and the element that shows the
 * prompt, which must be rendered. The version is tagged with the reason (for example, "deployed")
 * and has no description unless the user types one. The function resolves to true if the user
 * created a version or chose not to, and to false if the user cancelled (or creating the version
 * failed). If the project hasn't changed since its newest version, it doesn't ask: it adds the tag
 * to that version instead, and resolves to true.
 */
export function useCreateVersionPrompt(setAlertErrorMessage: (message: string) => void): {
  askToCreateVersion: (
      storage: commonStorage.Storage, projectName: string,
      reason: CreateVersionReason) => Promise<boolean>,
  createVersionPrompt: React.JSX.Element,
} {
  const {t} = I18Next.useTranslation();
  const [pending, setPending] = React.useState<PendingPrompt | null>(null);
  const [fields, setFields] = React.useState<VersionFieldValues>(EMPTY_VERSION_FIELD_VALUES);
  const [creating, setCreating] = React.useState(false);

  const askToCreateVersion = async (
      storage: commonStorage.Storage, projectName: string,
      reason: CreateVersionReason): Promise<boolean> => {
    const tag = REASON_TAGS[reason];
    let knownTags: string[] = [];
    // There's no need for a version if the project hasn't changed since the newest one, but that
    // version gets the tag, so it shows that it was deployed (or downloaded).
    try {
      const versions = await storageVersions.listVersions(storage, projectName);
      knownTags = collectTags(versions);
      if (!await storageVersions.hasChangesSinceLatestVersion(storage, projectName)) {
        await storageVersions.addVersionTag(storage, projectName, versions[0].versionId, tag);
        return true;
      }
    } catch (e) {
      // Ask anyway, so the user can still create a version.
      console.error('Failed to compare with the newest version:', e);
    }
    return new Promise<boolean>((resolve) => {
      setFields({ ...EMPTY_VERSION_FIELD_VALUES, tags: [tag] });
      setPending({ storage, projectName, knownTags, resolve });
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
      await storageVersions.createVersion(
          pending.storage, pending.projectName, fields.description, fields.tags, fields.notes);
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
      <VersionFields
        value={fields}
        onChange={setFields}
        knownTags={pending?.knownTags ?? []}
      />
    </Antd.Modal>
  );

  return { askToCreateVersion, createVersionPrompt };
}
