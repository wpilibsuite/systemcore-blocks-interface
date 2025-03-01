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


export type NewModuleNameModalProps = {
  title: string;
  isOpen: boolean;
  initialValue: string;
  getCurrentProjectName: () => string;
  getModuleNames: (projectName: string) => string[];
  onOk: (newName: string) => void;
  onCancel: () => void;
}

export const NewModuleNameModal: React.FC<NewModuleNameModalProps> = ({ title, isOpen, initialValue, getCurrentProjectName, getModuleNames, onOk, onCancel }) => {
  const inputRef = useRef<InputRef>(null);
  const [value, setValue] = useState('');
  const [projectName, setProjectName] = useState('');
  const [moduleNames, setModuleNames] = useState<string[]>([]);
  const [alertErrorMessage, setAlertErrorMessage] = useState('');
  const [alertErrorVisible, setAlertErrorVisible] = useState(false);

  const afterOpenChange = (open: boolean) => {
    if (open) {
      setValue(initialValue);
      const currentProjectName = getCurrentProjectName();
      setProjectName(currentProjectName);
      setModuleNames(getModuleNames(currentProjectName));
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setValue('');
    }
  };

  const handleOk = () => {
    if (!commonStorage.isValidPythonModuleName(value)) {
      setAlertErrorMessage(value + ' is not a valid blocks module name');
      setAlertErrorVisible(true);
      return;
    }
    if (projectName === value) {
      setAlertErrorMessage('The project is already named ' + value);
      setAlertErrorVisible(true);
      return;
    }
    if (moduleNames.includes(value)) {
      setAlertErrorMessage('Another module is already named ' +  value);
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
        <Typography.Paragraph> Name </Typography.Paragraph>
        <Input
          ref={inputRef}
          value={value}
          onPressEnter={handleOk}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
        />
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
