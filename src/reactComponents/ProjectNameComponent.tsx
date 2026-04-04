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
import * as storageNames from '../storage/names';

/** Props for the ProjectNameComponent. */
interface ProjectNameComponentProps {
  newItemName: string;
  setNewItemName: (name: string) => void;
  onAddNewItem: () => void;
  projectNames: string[];
}

/** Full width style for input components. */
const FULL_WIDTH_STYLE = {width: '100%'};

/** Top margin for error alert. */
const ERROR_ALERT_MARGIN_TOP = 8;

/** Invalid project name message suffix. */
const INVALID_NAME_MESSAGE_SUFFIX = ' is not a valid project name. Please enter a different name.';

/** Duplicate project name message prefix. */
const DUPLICATE_NAME_MESSAGE_PREFIX = 'There is already a project named ';

/** Duplicate project name message suffix. */
const DUPLICATE_NAME_MESSAGE_SUFFIX = '. Please enter a different name.';

/**
 * Component for entering and validating project names.
 * Provides input validation, error display, and automatic capitalization.
 */
export default function ProjectNameComponent(props: ProjectNameComponentProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const [alertErrorMessage, setAlertErrorMessage] = React.useState('');
  const [alertErrorVisible, setAlertErrorVisible] = React.useState(false);

  /** Handles adding a new item with validation. */
  const handleAddNewItem = (): void => {
    const newProjectName = props.newItemName.trim();
    if (!newProjectName) {
      return;
    }

    if (!storageNames.isValidClassName(newProjectName)) {
      showError(newProjectName + INVALID_NAME_MESSAGE_SUFFIX);
      return;
    }

    if (props.projectNames.includes(newProjectName)) {
      showError(DUPLICATE_NAME_MESSAGE_PREFIX + newProjectName + DUPLICATE_NAME_MESSAGE_SUFFIX);
      return;
    }

    props.onAddNewItem();
  };

  /** Shows an error message. */
  const showError = (message: string): void => {
    setAlertErrorMessage(message);
    setAlertErrorVisible(true);
  };

  /** Clears the error state. */
  const clearError = (): void => {
    setAlertErrorVisible(false);
    setAlertErrorMessage('');
  };

  /** Handles input change with automatic capitalization. */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // Force first character to be uppercase
    const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1);
    props.setNewItemName(capitalizedValue);

    // Clear error when user starts typing
    if (alertErrorVisible) {
      clearError();
    }
  };

  /** Handles the alert close action. */
  const handleAlertClose = (): void => {
    setAlertErrorVisible(false);
  };

  /** Renders the input field. */
  const renderInput = (): React.JSX.Element => (
    <Antd.Input
      style={FULL_WIDTH_STYLE}
      value={props.newItemName}
      onChange={handleInputChange}
      onPressEnter={handleAddNewItem}
    />
  );

  /** Renders the new project button. */
  const renderButton = (): React.JSX.Element => (
    <Antd.Button
      type="primary"
      onClick={handleAddNewItem}
    >
      {t('CREATE')}
    </Antd.Button>
  );

  /** Renders the error alert if visible. */
  const renderErrorAlert = (): React.JSX.Element | null => {
    if (!alertErrorVisible) {
      return null;
    }

    return (
      <Antd.Alert
        type="error"
        title={alertErrorMessage}
        closable={{ closeIcon: true, onClose: handleAlertClose }}
        style={{marginTop: ERROR_ALERT_MARGIN_TOP}}
      />
    );
  };

  return (
    <>
      <Antd.Typography.Paragraph>
        {t('class_rule_description')}
      </Antd.Typography.Paragraph>
      <Antd.Typography.Paragraph>
        {t('example_project')}
      </Antd.Typography.Paragraph>
      <Antd.Space.Compact style={FULL_WIDTH_STYLE}>
        {renderInput()}
        {renderButton()}
      </Antd.Space.Compact>
      {renderErrorAlert()}
    </>
  );
}
