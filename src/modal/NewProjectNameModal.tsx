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


export const TITLE_WELCOME = 'Welcome to WPILib Blocks!';
export const TITLE_NEW_PROJECT = 'New Project';
export const TITLE_RENAME_PROJECT = 'Rename Project';
export const TITLE_COPY_PROJECT = 'Copy Project';

export const MESSAGE_WELCOME = 'Let\'s create your first project. You just need to give it a name.';

const DESCRIPTION = 'No spaces are allowed in the name. Each word in the name should start with a capital letter.';
const EXAMPLE = 'For example, WackyWheelerRobot';
const LABEL = 'Project Name:';

type NewProjectNameModalProps = {
  title: string;
  message: string;
  isOpen: boolean;
  initialValue: string;
  getProjectClassNames: () => string[];
  onOk: (newName: string) => void;
  onCancel: () => void;
}

export const NewProjectNameModal: React.FC<NewProjectNameModalProps> = ({ title, message, isOpen, initialValue, getProjectClassNames, onOk, onCancel }) => {
  const inputRef = useRef<InputRef>(null);
  const [value, setValue] = useState('');
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [alertErrorMessage, setAlertErrorMessage] = useState('');
  const [alertErrorVisible, setAlertErrorVisible] = useState(false);

  const afterOpenChange = (open: boolean) => {
    if (open) {
      setValue(initialValue);
      const w = getProjectClassNames();
      setProjectNames(w);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setValue('');
      setAlertErrorVisible(false);
    }
  };

  const onChange = (e) => {
    setValue(commonStorage.onChangeClassName(e.target.value));
  };

  const handleOk = () => {
    if (!commonStorage.isValidClassName(value)) {
      setAlertErrorMessage(value + ' is not a valid project name. Please enter a different name.');
      setAlertErrorVisible(true);
      return;
    }
    if (projectNames.includes(value)) {
      setAlertErrorMessage('There is already a project named ' +  value + '. Please enter a different name.');
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
        <Typography.Paragraph
          style={message.length === 0 ? { display: 'none' } : { }}
        >{message}</Typography.Paragraph>
        <Typography.Paragraph>{DESCRIPTION}</Typography.Paragraph>
        <Typography.Paragraph>{EXAMPLE}</Typography.Paragraph>
        <Flex vertical gap="0">
          <Typography.Paragraph>{LABEL}</Typography.Paragraph>
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
