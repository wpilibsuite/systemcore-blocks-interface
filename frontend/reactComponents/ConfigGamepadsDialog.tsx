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
import * as storageProject from '../storage/project';
import { GamepadType, GamepadTypeUtils } from '../types/GamepadType';

/** Props for the ConfigGamepadsDialog component. */
interface ConfigGamepadsDialogProps {
  isOpen: boolean;
  onOk: (config: storageProject.GamepadConfig) => void;
  onCancel: () => void;
  currentConfig: storageProject.GamepadConfig;
}

/** Number of gamepads to configure (0-5). */
const GAMEPAD_COUNT = 6;

/**
 * Dialog component for configuring gamepad controller types.
 * Allows users to select controller type for gamepads 0-5.
 */
export default function ConfigGamepadsDialog(props: ConfigGamepadsDialogProps) {
  const { t } = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  
  // Local state for the configuration being edited
  const [localConfig, setLocalConfig] = React.useState<storageProject.GamepadConfig>(props.currentConfig);

  // Update local config when props change (dialog opens)
  React.useEffect(() => {
    setLocalConfig(props.currentConfig);
  }, [props.currentConfig, props.isOpen]);

  /** Handles gamepad type selection change. */
  const handleGamepadTypeChange = (gamepadIndex: number, type: GamepadType): void => {
    setLocalConfig(prev => ({
      ...prev,
      [gamepadIndex]: type,
    }));
  };

  /** Handles confirmation and saves the configuration. */
  const handleOk = (): void => {
    props.onOk(localConfig);
  };

  /** Handles cancellation without saving. */
  const handleCancel = (): void => {
    props.onCancel();
  };

  // Create table data source
  const tableData = Array.from({ length: GAMEPAD_COUNT }, (_, index) => ({
    key: index,
    gamepadId: index,
    controllerType: GamepadTypeUtils.getGamepad(index, localConfig),
  }));

  // Define table columns
  const columns = [
    {
      title: t('configGamepadsDialog.gamepadIdColumn', 'Gamepad ID'),
      dataIndex: 'gamepadId',
      key: 'gamepadId',
      width: 120,
      render: (gamepadId: number) => (
        <span style={{ fontWeight: 500 }}>
          {t('configGamepadsDialog.gamepadLabel', `Gamepad ${gamepadId}`)}
        </span>
      ),
    },
    {
      title: t('configGamepadsDialog.controllerTypeColumn', 'Controller Type'),
      dataIndex: 'controllerType',
      key: 'controllerType',
      render: (controllerType: GamepadType, record: any) => (
        <Antd.Select
          value={controllerType}
          onChange={(value) => handleGamepadTypeChange(record.gamepadId, value as GamepadType)}
          style={{ width: '100%' }}
          options={Object.values(GamepadType).map(type => ({
            value: type,
            label: (
              <span>
                {GamepadTypeUtils.getGamepadIcon(type)} {type}
              </span>
            ),
          }))}
        />
      ),
    },
  ];

  return (
    <Antd.Modal
      title={t('configGamepadsDialog.title', 'Configure Gamepads')}
      open={props.isOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
      okText={t('configGamepadsDialog.ok', 'Save')}
      cancelText={t('configGamepadsDialog.cancel', 'Cancel')}
    >
      <div style={{ marginTop: 16 }}>
        <p style={{ marginBottom: 16, color: token.colorTextSecondary }}>
          {t('configGamepadsDialog.description', 'Select the controller type for each gamepad port (0-5):')}
        </p>
        
        <Antd.Table
          dataSource={tableData}
          columns={columns}
          pagination={false}
          size="middle"
          bordered
        />
      </div>
    </Antd.Modal>
  );
}
