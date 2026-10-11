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
 * @fileoverview The content of the dialog that asks the user to confirm moving blocks to another
 * tab when some blocks won't work after the move.
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import { Breakage, MovePlan } from '../editor/move_blocks_to_module';

interface MoveBlocksConfirmContentProps {
  plan: MovePlan;
  /** Whether the move also changes tabs other than the one the blocks are moving from and to. */
  changesOtherTabs: boolean;
  /** Called with whether the user wants the robot components in plan.componentsToMove moved too. */
  onMoveComponentsChange: (moveComponents: boolean) => void;
}

/**
 * Lists the blocks that won't work after the move, grouped by where they are, and lets the user
 * choose to move robot components along with the blocks when that keeps some of them working.
 */
export default function MoveBlocksConfirmContent(props: MoveBlocksConfirmContentProps): React.JSX.Element {
  const { t } = I18Next.useTranslation();
  const [moveComponents, setMoveComponents] = React.useState(props.plan.componentsToMove.length > 0);

  const breakages = props.plan.breakages.filter(
      breakage => !(moveComponents && breakage.fixedByMovingComponentId));

  // Group the breakages by module, with the moved blocks first.
  const groups = new Map<string | null, Breakage[]>();
  if (breakages.some(breakage => breakage.moduleName === null)) {
    groups.set(null, []);
  }
  breakages.forEach(breakage => {
    let group = groups.get(breakage.moduleName);
    if (!group) {
      group = [];
      groups.set(breakage.moduleName, group);
    }
    group.push(breakage);
  });

  const getLabel = (breakage: Breakage): string => {
    switch (breakage.kind) {
      case 'fireEvent':
        return t('MOVE_BLOCKS_FIRE_EVENT', { name: breakage.label });
      case 'eventHandler':
        return t('MOVE_BLOCKS_EVENT_HANDLER', { name: breakage.label });
      default:
        return breakage.label;
    }
  };

  const handleMoveComponentsChange = (checked: boolean): void => {
    setMoveComponents(checked);
    props.onMoveComponentsChange(checked);
  };

  return (
    <div>
      {breakages.length > 0 ? (
        <>
          <p>{t('MOVE_BLOCKS_WILL_NOT_WORK')}</p>
          {[...groups.entries()].map(([moduleName, group]) => (
            <div key={moduleName ?? ''}>
              <Antd.Typography.Text strong>
                {moduleName === null
                    ? t('MOVE_BLOCKS_IN_MOVED_BLOCKS')
                    : t('MOVE_BLOCKS_IN_MODULE', { name: moduleName })}
              </Antd.Typography.Text>
              <ul style={{ marginTop: 4 }}>
                {group.map((breakage, index) => (
                  <li key={index}><Antd.Typography.Text code>{getLabel(breakage)}</Antd.Typography.Text></li>
                ))}
              </ul>
            </div>
          ))}
        </>
      ) : (
        <p>{t('MOVE_BLOCKS_ALL_WILL_WORK')}</p>
      )}
      {props.plan.componentsToMove.length > 0 && (
        <Antd.Checkbox
          checked={moveComponents}
          onChange={(e) => handleMoveComponentsChange(e.target.checked)}
        >
          {t('MOVE_BLOCKS_MOVE_COMPONENTS', {
            components: props.plan.componentsToMove.map(component => component.name).join(', '),
            name: props.plan.targetModule.className,
          })}
        </Antd.Checkbox>
      )}
      {props.changesOtherTabs && (
        <p style={{ marginTop: 12 }}>{t('MOVE_BLOCKS_CHANGES_OTHER_TABS')}</p>
      )}
    </div>
  );
}
