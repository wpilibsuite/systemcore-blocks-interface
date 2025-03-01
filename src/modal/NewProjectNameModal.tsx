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


export type NewProjectNameModalProps = {
  title: string;
  isOpen: boolean;
  initialValue: string;
  getProjectNames: () => string[];
  onOk: (newName: string) => void;
  onCancel: () => void;
}

export const NewProjectNameModal: React.FC<NewProjectNameModalProps> = ({ title, isOpen, initialValue, getProjectNames, onOk, onCancel }) => {
  const inputRef = useRef<InputRef>(null);
  const [message, setMessage] = useState('');
  const [value, setValue] = useState('');
  const [projectNames, setProjectNames] = useState<string[]>([]);
  const [alertErrorMessage, setAlertErrorMessage] = useState('');
  const [alertErrorVisible, setAlertErrorVisible] = useState(false);

  const afterOpenChange = (open: boolean) => {
    if (open) {
      setValue(initialValue);
      const w = getProjectNames();
      if (w.length === 0) {
        setMessage('Let\'s create your first project. You just need to give it a name.');
      }
      setProjectNames(w);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      setValue('');
      setMessage('');
    }
  };

  const handleOk = () => {
    if (!commonStorage.isValidPythonModuleName(value)) {
      setAlertErrorMessage(value + ' is not a valid blocks module name');
      setAlertErrorVisible(true);
      return;
    }
    if (projectNames.includes(value)) {
      setAlertErrorMessage('There is already a project named ' +  value);
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
        <Typography.Paragraph> Project Name </Typography.Paragraph>
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
