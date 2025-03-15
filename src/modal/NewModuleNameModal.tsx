/**
 * @license
 * Copyright 2024 Google LLC
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
 * @author lizlooney@google.com (Liz Looney)
 */

import React, { useState, useRef } from 'react';

import {
  Alert,
  Button,
  Flex,
  Input,
  Modal,
  Typography,
} from 'antd';
import type { InputRef } from 'antd';

import * as commonStorage from '../storage/common_storage';


export const TITLE_NEW_MECHANISM = 'New Mechanism';
export const TITLE_RENAME_MECHANISM = 'Rename Mechanism';
export const TITLE_COPY_MECHANISM = 'Copy Mechanism';
export const TITLE_NEW_OPMODE = 'New OpMode';
export const TITLE_RENAME_OPMODE = 'Rename OpMode';
export const TITLE_COPY_OPMODE = 'Copy OpMode';

const DESCRIPTION = 'No spaces are allowed in the name. Each word in the name should start with a capital letter.';

export const EXAMPLE_MECHANISM = 'For example: GamePieceShooter';
export const EXAMPLE_OPMODE = 'For example: AutoParkAndShoot';
export const LABEL_MECHANISM = 'Mechanism Name:';
export const LABEL_OPMODE = 'OpMode Name:';

type NewModuleNameModalProps = {
  title: string;
  example: string;
  label: string;
  isOpen: boolean;
  initialValue: string;
  getCurrentProjectName: () => string;
  getModuleClassNames: (projectName: string) => string[];
  onOk: (newName: string) => void;
  onCancel: () => void;
}

export const NewModuleNameModal: React.FC<NewModuleNameModalProps> = ({ title, example, label, isOpen, initialValue, getCurrentProjectName, getModuleClassNames, onOk, onCancel }) => {
  const inputRef = useRef<InputRef>(null);
  const [value, setValue] = useState('');
  const [projectClassName, setProjectClassName] = useState('');
  const [moduleClassNames, setModuleClassNames] = useState<string[]>([]);
  const [alertErrorMessage, setAlertErrorMessage] = useState('');
  const [alertErrorVisible, setAlertErrorVisible] = useState(false);

  const afterOpenChange = (open: boolean) => {
    if (open) {
      setValue(initialValue);
      const currentProjectName = getCurrentProjectName();
      setProjectClassName(commonStorage.moduleNameToClassName(currentProjectName));
      setModuleClassNames(getModuleClassNames(currentProjectName));
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setValue('');
      setAlertErrorVisible(false);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(commonStorage.onChangeClassName(e.target.value));
  };

  const handleOk = () => {
    if (!commonStorage.isValidClassName(value)) {
      setAlertErrorMessage(value + ' is not a valid name. Please enter a different name.');
      setAlertErrorVisible(true);
      return;
    }
    if (projectClassName === value) {
      setAlertErrorMessage('The project is already named ' + value + '. Please enter a different name.');
      setAlertErrorVisible(true);
      return;
    }
    if (moduleClassNames.includes(value)) {
      setAlertErrorMessage('Another Mechanism or OpMode is already named ' +  value + '. Please enter a different name.');
      setAlertErrorVisible(true);
      return;
    }
    onOk(value);
  };

  return (
    <Modal
      title={title}
      open={isOpen}
      afterOpenChange={afterOpenChange}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}> Cancel </Button>,
        <Button key="ok" onClick={handleOk}> OK </Button>
      ]}
    >
      <Flex vertical gap="small">
        <Typography.Paragraph>{DESCRIPTION}</Typography.Paragraph>
        <Typography.Paragraph>{example}</Typography.Paragraph>
        <Flex vertical gap="0">
          <Typography.Paragraph>{label}</Typography.Paragraph>
          <Input
            ref={inputRef}
            value={value}
            onPressEnter={handleOk}
            onChange={onChange}
          />
        </Flex>
        {alertErrorVisible && (
          <Alert
            type="error"
            message={alertErrorMessage}
            closable
            afterClose={() => setAlertErrorVisible(false)}
          />
        )}
      </Flex>
    </Modal>
  );
};
