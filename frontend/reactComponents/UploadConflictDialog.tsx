/**
 * @license
 * Copyright 2025 Porpoiseful LLC
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
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as storageModule from '../storage/module';
import * as storageNames from '../storage/names';
import * as storageProject from '../storage/project';
import * as commonStorage from '../storage/common_storage';

interface UploadConflictDialogProps {
  isOpen: boolean;
  existingProjectName: string;
  uploadedFiles: {[fileName: string]: string};
  preferredName: string;
  allProjectNames: string[];
  storage: commonStorage.Storage;
  setAlertErrorMessage: (message: string) => void;
  onComplete: (projectName: string) => Promise<void>;
  onCancel: () => void;
}

type MergeChoice = 'new' | 'old' | 'none';
type ConflictStep = 'choice' | 'merge';

interface ModuleRow {
  key: string;
  fileName: string;
  className: string;
  moduleType: storageModule.ModuleType;
  status: 'same' | 'different' | 'new-only' | 'old-only';
}

function normalizeModuleContent(content: string): string {
  try {
    const parsed = JSON.parse(content);
    delete parsed.modulePath;
    delete parsed.projectName;
    return JSON.stringify(parsed);
  } catch {
    return content;
  }
}

function triggerDownload(blobUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

export default function UploadConflictDialog(props: UploadConflictDialogProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const [step, setStep] = React.useState<ConflictStep>('choice');
  const [existingFiles, setExistingFiles] = React.useState<{[fileName: string]: string}>({});
  const [choices, setChoices] = React.useState<{[fileName: string]: MergeChoice}>({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (props.isOpen) {
      setStep('choice');
      setExistingFiles({});
    }
  }, [props.isOpen]);

  const moduleRows = React.useMemo((): ModuleRow[] => {
    if (step !== 'merge') return [];
    const allFileNames = new Set([
      ...Object.keys(props.uploadedFiles),
      ...Object.keys(existingFiles),
    ]);
    const rows: ModuleRow[] = [];
    for (const fileName of allFileNames) {
      if (!storageNames.isValidModuleFileName(fileName)) continue;
      const className = storageNames.getClassName(fileName);
      const moduleType = storageNames.getModuleType(fileName);
      const inNew = fileName in props.uploadedFiles;
      const inOld = fileName in existingFiles;
      let status: ModuleRow['status'];
      if (inNew && inOld) {
        status = normalizeModuleContent(props.uploadedFiles[fileName]) ===
                 normalizeModuleContent(existingFiles[fileName]) ? 'same' : 'different';
      } else {
        status = inNew ? 'new-only' : 'old-only';
      }
      rows.push({ key: fileName, fileName, className, moduleType, status });
    }
    const typeOrder: Record<storageModule.ModuleType, number> = {
      [storageModule.ModuleType.ROBOT]: 0,
      [storageModule.ModuleType.MECHANISM]: 1,
      [storageModule.ModuleType.OPMODE]: 2,
    };
    rows.sort((a, b) => typeOrder[a.moduleType] - typeOrder[b.moduleType] || a.className.localeCompare(b.className));
    return rows;
  }, [step, props.uploadedFiles, existingFiles]);

  React.useEffect(() => {
    const initial: {[fileName: string]: MergeChoice} = {};
    for (const r of moduleRows) {
      if (r.status === 'different') initial[r.fileName] = 'new';
      else if (r.status === 'new-only') initial[r.fileName] = 'new';
      else if (r.status === 'old-only') initial[r.fileName] = 'old';
    }
    setChoices(initial);
  }, [moduleRows]);

  const moduleTypeLabel = (moduleType: storageModule.ModuleType): string => {
    switch (moduleType) {
      case storageModule.ModuleType.ROBOT: return t('ROBOT');
      case storageModule.ModuleType.MECHANISM: return t('MECHANISM');
      case storageModule.ModuleType.OPMODE: return t('OPMODE');
    }
  };

  const handleNewProject = async () => {
    setLoading(true);
    try {
      const modifiedFiles = { ...props.uploadedFiles };
      for (const fileName in modifiedFiles) {
        if (storageNames.isValidProjectInfoFileName(fileName)) {
          const info = JSON.parse(modifiedFiles[fileName]);
          info.projectId = crypto.randomUUID();
          modifiedFiles[fileName] = JSON.stringify(info, null, 2);
        }
      }
      const uniqueName = storageNames.makeUniqueName(props.preferredName, props.allProjectNames);
      await storageProject.uploadProjectFiles(props.storage, uniqueName, modifiedFiles);
      await props.onComplete(uniqueName);
    } catch (error) {
      console.error('Error creating new project from upload:', error);
      props.setAlertErrorMessage(t('UPLOAD_FAILED'));
    } finally {
      setLoading(false);
    }
  };

  const handleReplace = async () => {
    setLoading(true);
    try {
      await storageProject.deleteProject(props.storage, props.existingProjectName);
      await storageProject.uploadProjectFiles(props.storage, props.existingProjectName, props.uploadedFiles);
      await props.onComplete(props.existingProjectName);
    } catch (error) {
      console.error('Error replacing project:', error);
      props.setAlertErrorMessage(t('UPLOAD_FAILED'));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMerge = async () => {
    setLoading(true);
    try {
      const files = await storageProject.fetchProjectFiles(props.storage, props.existingProjectName);
      setExistingFiles(files);
      setStep('merge');
    } catch (error) {
      console.error('Error loading existing project for merge:', error);
      props.setAlertErrorMessage(t('UPLOAD_FAILED'));
    } finally {
      setLoading(false);
    }
  };

  const handleMerge = async () => {
    setLoading(true);
    try {
      const backupBlobUrl = await storageProject.downloadProject(props.storage, props.existingProjectName);
      triggerDownload(
        backupBlobUrl,
        props.existingProjectName + ' - BeforeMerge' + storageNames.UPLOAD_DOWNLOAD_FILE_EXTENSION,
      );

      const mergedFiles: {[fileName: string]: string} = { ...existingFiles };
      for (const row of moduleRows) {
        const choice = choices[row.fileName];
        if (row.status === 'new-only') {
          if (choice === 'new') mergedFiles[row.fileName] = props.uploadedFiles[row.fileName];
          // 'none': don't add it (not in mergedFiles, which started from existingFiles)
        } else if (row.status === 'old-only') {
          if (choice === 'none') delete mergedFiles[row.fileName];
          // 'old': keep it (already in mergedFiles from existingFiles)
        } else if (row.status === 'different') {
          mergedFiles[row.fileName] = choice === 'new'
            ? props.uploadedFiles[row.fileName]
            : existingFiles[row.fileName];
        }
        // 'same': already in mergedFiles from existingFiles
      }
      // project.info.json: keep existing (already in mergedFiles)

      await storageProject.uploadProjectFiles(props.storage, props.existingProjectName, mergedFiles);
      await props.onComplete(props.existingProjectName);
    } catch (error) {
      console.error('Error merging project:', error);
      props.setAlertErrorMessage(t('UPLOAD_FAILED'));
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('NAME'),
      key: 'name',
      render: (_: unknown, row: ModuleRow) => (
        <span style={{ opacity: row.status === 'same' ? 0.45 : 1 }}>
          {row.className}
          {row.moduleType !== storageModule.ModuleType.ROBOT && (
            <Antd.Tag style={{ marginLeft: 8 }}>{moduleTypeLabel(row.moduleType)}</Antd.Tag>
          )}
        </span>
      ),
    },
    {
      title: t('MERGE_STATUS'),
      key: 'status',
      render: (_: unknown, row: ModuleRow) => {
        const configs: Record<ModuleRow['status'], { color: string; label: string }> = {
          same: { color: 'default', label: t('MODULE_UNCHANGED') },
          different: { color: 'orange', label: t('MODULE_CHANGED') },
          'new-only': { color: 'blue', label: t('MODULE_NEW') },
          'old-only': { color: 'purple', label: t('MODULE_EXISTING_ONLY') },
        };
        const { color, label } = configs[row.status];
        return <Antd.Tag color={color}>{label}</Antd.Tag>;
      },
    },
    {
      title: t('MERGE_KEEP'),
      key: 'choice',
      render: (_: unknown, row: ModuleRow) => {
        if (row.status === 'same') return null;
        type OptionPair = [MergeChoice, string, MergeChoice, string];
        const [leftValue, leftLabel, rightValue, rightLabel]: OptionPair =
          row.status === 'new-only' ? ['new', t('MERGE_UPLOADED'), 'none', t('MERGE_NONE')] :
          row.status === 'old-only' ? ['none', t('MERGE_NONE'), 'old', t('MERGE_EXISTING')] :
                                      ['new', t('MERGE_UPLOADED'), 'old', t('MERGE_EXISTING')];
        const current = choices[row.fileName];
        const pick = (v: MergeChoice) =>
          setChoices(prev => ({ ...prev, [row.fileName]: v }));
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <Antd.Radio checked={current === leftValue} onChange={() => pick(leftValue)}>
              {leftLabel}
            </Antd.Radio>
            <Antd.Radio checked={current === rightValue} onChange={() => pick(rightValue)}>
              {rightLabel}
            </Antd.Radio>
          </div>
        );
      },
    },
  ];

  const isChoiceStep = step === 'choice';

  return (
    <Antd.Modal
      title={isChoiceStep ? t('UPLOAD_ID_CONFLICT_TITLE') : t('MERGE_MODULES_TITLE')}
      open={props.isOpen}
      onCancel={isChoiceStep ? props.onCancel : () => setStep('choice')}
      width={isChoiceStep ? 480 : 700}
      footer={
        isChoiceStep
          ? [
              <Antd.Button key="cancel" onClick={props.onCancel}>{t('CANCEL')}</Antd.Button>,
              <Antd.Button key="new" onClick={handleNewProject} loading={loading}>
                {t('UPLOAD_AS_NEW_PROJECT')}
              </Antd.Button>,
              <Antd.Button key="replace" danger onClick={handleReplace} loading={loading}>
                {t('UPLOAD_REPLACE')}
              </Antd.Button>,
              <Antd.Button key="merge" type="primary" onClick={handleOpenMerge} loading={loading}>
                {t('UPLOAD_MERGE')}
              </Antd.Button>,
            ]
          : [
              <Antd.Button key="back" onClick={() => setStep('choice')}>{t('CANCEL')}</Antd.Button>,
              <Antd.Button key="merge" type="primary" onClick={handleMerge} loading={loading}>
                {t('MERGE')}
              </Antd.Button>,
            ]
      }
    >
      {isChoiceStep ? (
        <p>{t('UPLOAD_ID_CONFLICT_DESCRIPTION', { existingName: props.existingProjectName })}</p>
      ) : (
        <>
          <p>{t('MERGE_MODULES_DESCRIPTION', { existingName: props.existingProjectName })}</p>
          <Antd.Table
            dataSource={moduleRows}
            columns={columns}
            pagination={false}
            size="small"
            rowKey="key"
          />
        </>
      )}
    </Antd.Modal>
  );
}
