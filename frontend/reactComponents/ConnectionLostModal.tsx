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
 * @fileoverview Checks the connection to the backend and blocks editing while it is lost.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as React from 'react';
import * as Antd from 'antd';
import * as Blockly from 'blockly/core';
import { DisconnectOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

import * as serverSideStorage from '../storage/server_side_storage';
import { useAutosave } from './AutosaveManager';

/** Time in milliseconds between heartbeat checks. */
const HEARTBEAT_INTERVAL_MS = 1000;

/** Time in milliseconds to wait for a heartbeat response before treating it as lost. */
const HEARTBEAT_TIMEOUT_MS = 2000;

/**
 * Checks the backend every second and, if the connection is lost, shows a modal that can't be
 * dismissed (blocking all editing) until the connection returns. Only render this when the app
 * started out connected to a backend.
 */
const ConnectionLostModal: React.FC = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { hasUnsavedChanges, triggerSave } = useAutosave();
  const [connected, setConnected] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | null = null;

    // Wait for each check to finish before scheduling the next, so slow responses don't pile up.
    const check = async (): Promise<void> => {
      const available = await serverSideStorage.isServerAvailable(HEARTBEAT_TIMEOUT_MS);
      if (cancelled) {
        return;
      }
      setConnected(available);
      timer = setTimeout(check, HEARTBEAT_INTERVAL_MS);
    };
    timer = setTimeout(check, HEARTBEAT_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, []);

  // Close any open field editor or dropdown, since they are shown above the modal.
  React.useEffect(() => {
    if (!connected) {
      Blockly.WidgetDiv.hide();
      Blockly.DropDownDiv.hideWithoutAnimation();
    }
  }, [connected]);

  // An autosave that failed while the connection was lost isn't retried, so save once it returns.
  const wasConnected = React.useRef(true);
  React.useEffect(() => {
    if (connected && !wasConnected.current && hasUnsavedChanges) {
      triggerSave().catch(() => {
        // triggerSave already logs the error and keeps the changes marked as unsaved.
      });
    }
    wasConnected.current = connected;
  }, [connected, hasUnsavedChanges, triggerSave]);

  return (
    <Antd.Modal
      open={!connected}
      title={
        <Antd.Space>
          <DisconnectOutlined />
          {t('CONNECTION_LOST_TITLE')}
        </Antd.Space>
      }
      closable={false}
      mask={{ closable: false }}
      keyboard={false}
      footer={null}
      centered
      zIndex={2000}
    >
      <Antd.Space orientation="vertical">
        <Antd.Typography.Text>{t('CONNECTION_LOST_MESSAGE')}</Antd.Typography.Text>
        <Antd.Space>
          <Antd.Spin size="small" />
          <Antd.Typography.Text type="secondary">{t('CONNECTION_LOST_RECONNECTING')}</Antd.Typography.Text>
        </Antd.Space>
      </Antd.Space>
    </Antd.Modal>
  );
};

export default ConnectionLostModal;
