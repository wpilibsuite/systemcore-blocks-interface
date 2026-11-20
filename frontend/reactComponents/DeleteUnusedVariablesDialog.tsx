// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview A dialog that lists the variables that no block in a module uses, with a checkbox
 * for each, so that the user can delete them. They all start out checked.
 */
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import { simpleClassName } from '../blocks/utils/python';

/** A variable that can be deleted. */
export interface UnusedVariable {
  id: string;
  name: string;
  /** The python type of the variable, or '' if it doesn't have one. */
  type: string;
}

/**
 * The most the list can be, in pixels, before it scrolls. The list is as tall as its rows, so
 * there is no scrollbar until it reaches this.
 */
const MAX_LIST_HEIGHT = 300;

interface DeleteUnusedVariablesDialogProps {
  isOpen: boolean;
  variables: UnusedVariable[];
  /** Called with the ids of the variables that the user chose to delete. */
  onDelete: (variableIds: string[]) => void;
  onCancel: () => void;
}

/** Dialog component for choosing which of a module's unused variables to delete. */
export default function DeleteUnusedVariablesDialog(
    props: DeleteUnusedVariablesDialogProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const { token } = Antd.theme.useToken();
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Check all of the variables whenever the dialog is opened.
  React.useEffect(() => {
    if (props.isOpen) {
      setSelectedIds(new Set(props.variables.map(variable => variable.id)));
    }
  }, [props.isOpen, props.variables]);

  /** Toggles whether a variable is selected. */
  const toggleSelected = (id: string): void => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });
  };

  /** Toggles whether all of the variables are selected. */
  const toggleSelectAll = (): void => {
    setSelectedIds(prev => prev.size === props.variables.length ?
        new Set() : new Set(props.variables.map(variable => variable.id)));
  };

  return (
    <Antd.Modal
      title={t('DELETE_UNUSED_VARIABLES_TITLE')}
      open={props.isOpen}
      onCancel={props.onCancel}
      onOk={() => props.onDelete([...selectedIds])}
      okText={t('DELETE')}
      okButtonProps={{ danger: true, disabled: selectedIds.size === 0 }}
      cancelText={t('CANCEL')}
    >
      {props.variables.length > 0 && (
        <>
          <p>{t('DELETE_UNUSED_VARIABLES_DESC')}</p>
          <Antd.Checkbox
            checked={selectedIds.size === props.variables.length}
            indeterminate={selectedIds.size > 0 && selectedIds.size < props.variables.length}
            onChange={toggleSelectAll}
          >
            {t('SELECT_ALL')}
          </Antd.Checkbox>
        </>
      )}
      <div
        style={{
          maxHeight: MAX_LIST_HEIGHT,
          overflow: 'auto',
          marginTop: 16,
          border: `1px solid ${token.colorBorder}`,
          borderRadius: '6px',
        }}
      >
        {props.variables.length === 0 ? (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: token.colorTextSecondary,
          }}>
            {t('NO_UNUSED_VARIABLES')}
          </div>
        ) : (
          <ul style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}>
            {props.variables.map(variable => (
              <li
                key={variable.id}
                onClick={() => toggleSelected(variable.id)}
                style={{
                  cursor: 'pointer',
                  padding: '12px 16px',
                  borderBottom: `1px solid ${token.colorBorderSecondary}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = token.colorBgTextHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Antd.Checkbox
                  checked={selectedIds.has(variable.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSelected(variable.id)}
                />
                <span style={{fontSize: '14px'}}>
                  {variable.name}
                </span>
                {variable.type && (
                  <span style={{fontSize: '14px', color: token.colorTextSecondary}}>
                    {simpleClassName(variable.type)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Antd.Modal>
  );
}
