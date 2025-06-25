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
import {TabType } from '../types/TabType';

import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as commonStorage from '../storage/common_storage';

/** Props for the ModuleNameComponent. */
interface ModuleNameComponentProps {
  tabType: TabType;
  newItemName: string;
  setNewItemName: (name: string) => void;
  onAddNewItem: () => void;
  project: commonStorage.Project | null;
  storage: commonStorage.Storage | null;
  buttonLabel: string;
}

/** Width calculation for input when button is present. */
const INPUT_WIDTH_WITH_BUTTON = 'calc(100% - 80px)';

/** Width for input when no button is present. */
const INPUT_WIDTH_FULL = '100%';

/** Top margin for error alert. */
const ERROR_ALERT_MARGIN_TOP = 8;

/**
 * Component for entering and validating module names.
 * Provides input validation, error display, and automatic capitalization.
 */
export default function ModuleNameComponent(props: ModuleNameComponentProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const [alertErrorMessage, setAlertErrorMessage] = React.useState('');
  const [alertErrorVisible, setAlertErrorVisible] = React.useState(false);

  /** Handles adding a new item with validation. */
  const handleAddNewItem = (): void => {
    const trimmedName = props.newItemName.trim();
    if (!trimmedName) {
      return;
    }

    if (!props.project) {
      return;
    }

    const {ok, error} = commonStorage.isClassNameOk(props.project, trimmedName);
    if (ok) {
      clearError();
      props.onAddNewItem();
    } else {
      showError(error);
    }
  };

  /** Clears the error state. */
  const clearError = (): void => {
    setAlertErrorVisible(false);
    setAlertErrorMessage('');
  };

  /** Shows an error message. */
  const showError = (message: string): void => {
    setAlertErrorMessage(message);
    setAlertErrorVisible(true);
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

  /** Gets the example text based on tab type. */
  const getExampleText = (): string => {
    return props.tabType === TabType.MECHANISM ?
      t('example_mechanism') :
      t('example_opmode');
  };

  /** Gets the input width based on whether button is present. */
  const getInputWidth = (): string => {
    return props.buttonLabel ? INPUT_WIDTH_WITH_BUTTON : INPUT_WIDTH_FULL;
  };

  /** Renders the input field. */
  const renderInput = (): React.JSX.Element => (
    <Antd.Input
      style={{width: getInputWidth()}}
      placeholder={t('addTabDialog.newItemPlaceholder')}
      value={props.newItemName}
      onChange={handleInputChange}
      onPressEnter={handleAddNewItem}
    />
  );

  /** Renders the button if a label is provided. */
  const renderButton = (): React.JSX.Element | null => {
    if (!props.buttonLabel) {
      return null;
    }

    return (
      <Antd.Button
        type="primary"
        onClick={handleAddNewItem}
      >
        {props.buttonLabel}
      </Antd.Button>
    );
  };

  /** Renders the error alert if visible. */
  const renderErrorAlert = (): React.JSX.Element | null => {
    if (!alertErrorVisible) {
      return null;
    }

    return (
      <Antd.Alert
        type="error"
        message={alertErrorMessage}
        closable
        afterClose={handleAlertClose}
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
        {getExampleText()}
      </Antd.Typography.Paragraph>
      <Antd.Space.Compact style={{width: '100%'}}>
        {renderInput()}
        {renderButton()}
      </Antd.Space.Compact>
      {renderErrorAlert()}
    </>
  );
}