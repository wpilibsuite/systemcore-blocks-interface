// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview Shows the dialogs that Blockly asks for (Blockly.dialog.alert, confirm, and
 * prompt) as Antd dialogs, like the rest of the app, instead of the browser's alert, confirm, and
 * prompt. Blockly uses them for creating, renaming, and deleting variables, deleting all blocks,
 * and editing text fields on phones and tablets.
 *
 * Render one BlocklyDialogs inside the Antd ConfigProvider, so that the dialogs use the app's
 * theme and language.
 * 
 */
import * as Antd from 'antd';
import * as Blockly from 'blockly/core';
import * as I18Next from 'react-i18next';
import * as React from 'react';

/** The prompt that is shown, or null if there isn't one. */
interface PromptState {
  message: string;
  callback: (result: string | null) => void;
}

/** Messages can have more than one line, like the list of uses of a variable. */
const MESSAGE_STYLE: React.CSSProperties = { whiteSpace: 'pre-wrap' };

export default function BlocklyDialogs(): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const [modal, contextHolder] = Antd.Modal.useModal();
  const [prompt, setPrompt] = React.useState<PromptState | null>(null);
  const [promptValue, setPromptValue] = React.useState('');

  React.useEffect(() => {
    Blockly.dialog.setAlert((message, callback) => {
      modal.info({
        content: <div style={MESSAGE_STYLE}>{message}</div>,
        okText: t('OK'),
        onOk: () => callback?.(),
      });
    });
    Blockly.dialog.setConfirm((message, callback) => {
      modal.confirm({
        content: <div style={MESSAGE_STYLE}>{message}</div>,
        okText: t('OK'),
        cancelText: t('CANCEL'),
        onOk: () => callback(true),
        onCancel: () => callback(false),
      });
    });
    Blockly.dialog.setPrompt((message, defaultValue, callback) => {
      setPromptValue(defaultValue);
      setPrompt({ message, callback });
    });
    return () => {
      // Go back to the browser's dialogs.
      Blockly.dialog.setAlert();
      Blockly.dialog.setConfirm();
      Blockly.dialog.setPrompt();
    };
  }, [modal, t]);

  /** Closes the prompt and gives Blockly the result: the text, or null if it was canceled. */
  const closePrompt = (result: string | null): void => {
    const callback = prompt?.callback;
    setPrompt(null);
    callback?.(result);
  };

  return (
    <>
      {contextHolder}
      <Antd.Modal
        title={<span style={MESSAGE_STYLE}>{prompt?.message}</span>}
        open={prompt !== null}
        onOk={() => closePrompt(promptValue)}
        onCancel={() => closePrompt(null)}
        okText={t('OK')}
        cancelText={t('CANCEL')}
        destroyOnHidden
      >
        <Antd.Input
          autoFocus
          value={promptValue}
          onChange={(e) => setPromptValue(e.target.value)}
          onPressEnter={() => closePrompt(promptValue)}
        />
      </Antd.Modal>
    </>
  );
}
