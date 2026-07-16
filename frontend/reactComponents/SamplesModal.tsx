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
  ArrowLeftOutlined,
  FolderAddOutlined,
  CloseCircleOutlined,
  RobotOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';
import * as storageModule from '../storage/module';
import * as storageProject from '../storage/project';
import * as samplesRegistry from '../samples/samples_registry';
import ProjectNameComponent from './ProjectNameComponent';
import ReadOnlyBlocklyPreview from './ReadOnlyBlocklyPreview';

/** Props for the SamplesModal component. */
interface SamplesModalProps {
  isOpen: boolean;
  onClose: () => void;
  storage: commonStorage.Storage | null;
  setCurrentProject: (project: storageProject.Project | null) => void;
  setAlertErrorMessage: (message: string) => void;
  theme: string;
}

/** Modal width, as a percentage of the viewport width. */
const MODAL_WIDTH = '90vw';

/** Modal top offset, leaving equal space above and below for a modal that is 90% of the
 * viewport height. */
const MODAL_TOP = '5vh';

/** Height of the modal body, accounting for the title bar, footer, and padding. */
const MODAL_BODY_HEIGHT = 'calc(90vh - 165px)';

/** Whether a sample must have all selected tags (AND) or any of them (OR) to match. */
type TagFilterMode = 'AND' | 'OR';

/**
 * Modal component for browsing samples, previewing their modules read-only, and creating a new
 * project from a sample.
 */
export default function SamplesModal(props: SamplesModalProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const [samples] = React.useState<samplesRegistry.Sample[]>(() => samplesRegistry.listSamples());
  const [selectedSample, setSelectedSample] = React.useState<samplesRegistry.Sample | null>(null);
  const [selectedFileName, setSelectedFileName] = React.useState<string>('');
  const [allProjectNames, setAllProjectNames] = React.useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [newProjectName, setNewProjectName] = React.useState('');
  const [creating, setCreating] = React.useState(false);
  const [searchText, setSearchText] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [tagFilterMode, setTagFilterMode] = React.useState<TagFilterMode>('OR');

  React.useEffect(() => {
    if (!props.isOpen) {
      setSelectedSample(null);
      setSelectedFileName('');
      setSearchText('');
      setSelectedTags([]);
      setTagFilterMode('OR');
      return;
    }
    if (props.storage) {
      storageProject.listProjectNames(props.storage).then(setAllProjectNames);
    }
  }, [props.isOpen, props.storage]);

  const allTags = React.useMemo<string[]>(() => {
    const tagSet = new Set<string>();
    samples.forEach((sample) => sample.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [samples]);

  const filteredSamples = React.useMemo<samplesRegistry.Sample[]>(() => {
    const normalizedSearchText = searchText.trim().toLowerCase();
    return samples.filter((sample) => {
      if (selectedTags.length > 0) {
        const matchesTags = tagFilterMode === 'AND' ?
            selectedTags.every((tag) => sample.tags.includes(tag)) :
            selectedTags.some((tag) => sample.tags.includes(tag));
        if (!matchesTags) {
          return false;
        }
      }
      if (normalizedSearchText &&
          !sample.sampleName.toLowerCase().includes(normalizedSearchText) &&
          !sample.description.toLowerCase().includes(normalizedSearchText)) {
        return false;
      }
      return true;
    });
  }, [samples, searchText, selectedTags, tagFilterMode]);

  const hasActiveFilters = searchText.length > 0 || selectedTags.length > 0;

  const toggleTag = (tag: string): void => {
    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]);
  };

  const clearFilters = (): void => {
    setSearchText('');
    setSelectedTags([]);
    setTagFilterMode('OR');
  };

  const handleSelectSample = (sample: samplesRegistry.Sample): void => {
    setSelectedSample(sample);
    const robotModule = sample.moduleFiles.find(
        (m) => m.moduleType === storageModule.ModuleType.ROBOT);
    setSelectedFileName(robotModule ? robotModule.fileName : (sample.moduleFiles[0]?.fileName || ''));
  };

  const handleBack = (): void => {
    setSelectedSample(null);
    setSelectedFileName('');
  };

  const openCreateModal = (): void => {
    if (!selectedSample) {
      return;
    }
    setNewProjectName(selectedSample.sampleName);
    setCreateModalOpen(true);
  };

  const handleCreateProject = async (): Promise<void> => {
    if (!selectedSample || !props.storage) {
      return;
    }
    setCreating(true);
    try {
      await storageProject.createProjectFromSample(
          props.storage, selectedSample.files, newProjectName);
      const project = await storageProject.fetchProject(props.storage, newProjectName);
      props.setCurrentProject(project);
      setCreateModalOpen(false);
      props.onClose();
    } catch (e) {
      console.error('Failed to create project from sample:', e);
      props.setAlertErrorMessage(t('SAMPLES.FAILED_TO_CREATE_FROM_SAMPLE'));
    } finally {
      setCreating(false);
    }
  };

  const renderFilters = (): React.JSX.Element => (
    <div style={{ marginBottom: 12 }}>
      <Antd.Space.Compact style={{ width: '100%', marginBottom: 8 }}>
        <Antd.Input
          allowClear
          placeholder={t('SAMPLES.SEARCH_PLACEHOLDER')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {hasActiveFilters && (
          <Antd.Button icon={<CloseCircleOutlined />} onClick={clearFilters}>
            {t('SAMPLES.CLEAR_FILTERS')}
          </Antd.Button>
        )}
      </Antd.Space.Compact>
      {allTags.length > 0 && (
        <Antd.Space size={[4, 4]} wrap align="center">
          <Antd.Tooltip title={t('SAMPLES.TAG_FILTER_MODE_TOOLTIP')}>
            <Antd.Switch
              size="small"
              checked={tagFilterMode === 'AND'}
              onChange={(checked) => setTagFilterMode(checked ? 'AND' : 'OR')}
              checkedChildren={t('SAMPLES.TAG_FILTER_MODE_AND')}
              unCheckedChildren={t('SAMPLES.TAG_FILTER_MODE_OR')}
              style={{ marginRight: 8 }}
            />
          </Antd.Tooltip>
          {allTags.map((tag) => (
            <Antd.Tag.CheckableTag
              key={tag}
              checked={selectedTags.includes(tag)}
              onChange={() => toggleTag(tag)}
            >
              {tag}
            </Antd.Tag.CheckableTag>
          ))}
        </Antd.Space>
      )}
    </div>
  );

  const renderSampleList = (): React.JSX.Element => (
    <>
      {renderFilters()}
      <Antd.List
        dataSource={filteredSamples}
        locale={{ emptyText: t('SAMPLES.NO_SAMPLES_FOUND') }}
        renderItem={(sample) => (
          <Antd.List.Item
            onClick={() => handleSelectSample(sample)}
            style={{ cursor: 'pointer' }}
          >
            <Antd.List.Item.Meta
              title={sample.sampleName}
              description={
                <>
                  <div>{sample.description}</div>
                  {sample.tags.length > 0 && (
                    <Antd.Space size={[0, 4]} wrap style={{ marginTop: 4 }}>
                      {sample.tags.map((tag) => (
                        <Antd.Tag key={tag}>{tag}</Antd.Tag>
                      ))}
                    </Antd.Space>
                  )}
                </>
              }
            />
          </Antd.List.Item>
        )}
      />
    </>
  );

  const renderSampleDetail = (sample: samplesRegistry.Sample): React.JSX.Element => {
    const selectedFile = sample.moduleFiles.find((m) => m.fileName === selectedFileName);
    const selectedContentText = selectedFile ? sample.files[selectedFile.fileName] : '';

    const robotFile = sample.moduleFiles.find(
        (m) => m.moduleType === storageModule.ModuleType.ROBOT);
    const mechanismFiles = sample.moduleFiles.filter(
        (m) => m.moduleType === storageModule.ModuleType.MECHANISM);
    const opModeFiles = sample.moduleFiles.filter(
        (m) => m.moduleType === storageModule.ModuleType.OPMODE);
    const topRowFiles = robotFile ? [robotFile, ...mechanismFiles] : mechanismFiles;

    const toTabItems = (moduleFiles: samplesRegistry.SampleModuleFile[]): Antd.TabsProps['items'] =>
      moduleFiles.map((moduleFile) => ({
        key: moduleFile.fileName,
        label: moduleFile.className,
      }));

    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Antd.Space style={{ marginBottom: 12, flex: '0 0 auto' }}>
          <Antd.Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
            {t('SAMPLES.BACK_TO_SAMPLES')}
          </Antd.Button>
          <Antd.Button
            type="primary"
            icon={<FolderAddOutlined />}
            onClick={openCreateModal}
            disabled={!props.storage}
          >
            {t('SAMPLES.CREATE_PROJECT_FROM_SAMPLE')}
          </Antd.Button>
        </Antd.Space>
        <Antd.Typography.Title level={5} style={{ marginTop: 0, flex: '0 0 auto' }}>
          {sample.sampleName}
        </Antd.Typography.Title>
        <Antd.Typography.Paragraph type="secondary" style={{ flex: '0 0 auto' }}>
          {sample.description}
        </Antd.Typography.Paragraph>
        <div style={{ display: 'flex', flexDirection: 'column', flex: '1 1 auto', minHeight: 0 }}>
          <Antd.Tabs
            type="card"
            size="small"
            tabBarStyle={{ padding: 0, margin: 0 }}
            activeKey={selectedFileName}
            onChange={setSelectedFileName}
            items={toTabItems(topRowFiles)}
            tabBarExtraContent={{
              left: (
                <Antd.Tooltip title={t('MECHANISMS')}>
                  <RobotOutlined style={{ marginRight: 8 }} />
                </Antd.Tooltip>
              ),
            }}
          />
          {opModeFiles.length > 0 && (
            <Antd.Tabs
              type="card"
              size="small"
              tabBarStyle={{ padding: 0, margin: 0 }}
              activeKey={selectedFileName}
              onChange={setSelectedFileName}
              items={toTabItems(opModeFiles)}
              tabBarExtraContent={{
                left: (
                  <Antd.Tooltip title={t('OPMODES')}>
                    <CodeOutlined style={{ marginRight: 8 }} />
                  </Antd.Tooltip>
                ),
              }}
            />
          )}
          <div style={{ flex: '1 1 auto', minHeight: 0, border: '1px solid rgba(128,128,128,0.3)' }}>
            {selectedContentText && (
              <ReadOnlyBlocklyPreview
                moduleContentText={selectedContentText}
                theme={props.theme}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Antd.Modal
        title={t('SAMPLES.MENU_ITEM')}
        open={props.isOpen}
        onCancel={props.onClose}
        footer={[
          <Antd.Button key="close" onClick={props.onClose}>
            {t('CANCEL')}
          </Antd.Button>,
        ]}
        width={MODAL_WIDTH}
        style={{ top: MODAL_TOP }}
        styles={{ body: { height: MODAL_BODY_HEIGHT, overflow: 'auto' } }}
      >
        {selectedSample ? renderSampleDetail(selectedSample) : renderSampleList()}
      </Antd.Modal>

      <Antd.Modal
        title={t('SAMPLES.CREATE_PROJECT_FROM_SAMPLE')}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleCreateProject}
        okText={t('CREATE')}
        cancelText={t('CANCEL')}
        confirmLoading={creating}
      >
        <ProjectNameComponent
          newItemName={newProjectName}
          setNewItemName={setNewProjectName}
          onAddNewItem={handleCreateProject}
          projectNames={allProjectNames}
        />
      </Antd.Modal>
    </>
  );
}
