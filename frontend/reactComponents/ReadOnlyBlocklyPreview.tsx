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
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Antd from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import * as I18Next from 'react-i18next';
import * as React from 'react';
import * as Blockly from 'blockly/core';
import 'blockly/blocks';
import * as storageModuleContent from '../storage/module_content';
import * as workspaces from '../blocks/utils/workspaces';
import { themes } from '../themes/mrc_themes';

/** Props for the ReadOnlyBlocklyPreview component. */
interface ReadOnlyBlocklyPreviewProps {
  moduleContentText: string;
  theme: string;
}

/** Grid spacing for the Blockly workspace. */
const GRID_SPACING = 20;

/** Grid line length for the Blockly workspace. */
const GRID_LENGTH = 3;

/** Grid color for the Blockly workspace. */
const GRID_COLOR = '#ccc';

const FULL_SIZE_STYLE: React.CSSProperties = {
  width: '100%',
  height: '100%',
};

const COPY_BUTTON_STYLE: React.CSSProperties = {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 1,
};

/**
 * Renders a Blockly workspace in read-only mode, showing the blocks from the given module
 * content. Used to preview a sample's modules without allowing edits, while still letting the
 * user select a block and copy it (via Ctrl/Cmd+C or the copy button) to paste into their own
 * workspace.
 *
 * Blockly's own selection is now implemented via its keyboard-navigation focus manager, which
 * refuses to focus anything inside a read-only workspace - so Blockly.common.getSelected()/
 * setSelected() never work here. Selection is tracked entirely ourselves instead, using
 * BlockSvg.addSelect()/removeSelect() (which only toggle the highlight, without touching focus
 * or firing an event) for the visual effect.
 */
export default function ReadOnlyBlocklyPreview(props: ReadOnlyBlocklyPreviewProps): React.JSX.Element {
  const {t} = I18Next.useTranslation();
  const blocklyDiv = React.useRef<HTMLDivElement | null>(null);
  const selectedBlockRef = React.useRef<Blockly.BlockSvg | null>(null);
  const [hasSelectedBlock, setHasSelectedBlock] = React.useState(false);

  const getBlocklyTheme = (): Blockly.Theme | undefined => {
    const blocklyThemeName = 'mrc_theme_' + props.theme.replace(/-/g, '_');
    return themes.find(theme => theme.name === blocklyThemeName);
  };

  const selectBlock = (block: Blockly.BlockSvg | null): void => {
    if (selectedBlockRef.current === block) {
      return;
    }
    selectedBlockRef.current?.removeSelect();
    selectedBlockRef.current = block;
    block?.addSelect();
    setHasSelectedBlock(block !== null);
  };

  const copySelectedBlock = (): void => {
    const selected = selectedBlockRef.current;
    if (selected) {
      // Blockly.clipboard.copy performs no permission checks (e.g. deletable/movable), which is
      // exactly what we need since these blocks are otherwise read-only.
      Blockly.clipboard.copy(selected);
    }
  };

  React.useEffect(() => {
    if (!blocklyDiv.current) {
      return;
    }
    const container = blocklyDiv.current;

    const moduleContent = storageModuleContent.parseModuleContentText(props.moduleContentText);

    const workspace = Blockly.inject(container, {
      readOnly: true,
      theme: getBlocklyTheme(),
      horizontalLayout: false,
      toolbox: {
        kind: 'categoryToolbox',
        contents: [],
      },
      grid: {
        spacing: GRID_SPACING,
        length: GRID_LENGTH,
        colour: GRID_COLOR,
        snap: false,
      },
      zoom: {
        controls: true,
        wheel: true,
      },
      scrollbars: true,
      trashcan: false,
    });

    workspaces.addWorkspace(workspace, moduleContent.getModuleType());
    Blockly.serialization.workspaces.load(moduleContent.getBlocks(), workspace);
    workspace.scrollCenter();

    selectBlock(null);

    // A read-only workspace doesn't let Blockly's own gesture/focus system select a block on
    // click, so selection is wired up by hand here: clicking a block selects it, clicking empty
    // canvas clears it. This uses a single capture-phase listener on the container (rather than
    // per-block listeners) so it always sees the event first, regardless of whether Blockly's own
    // (otherwise inert, since the workspace is read-only) handlers stop propagation.
    // Note: this listens for 'pointerdown', not 'mousedown' - Blockly's own pointerdown handler
    // calls preventDefault(), which per the Pointer Events spec suppresses the browser's
    // synthetic mousedown/mouseup compatibility events entirely, so 'mousedown' never fires here.
    const handlePointerDown = (event: PointerEvent): void => {
      // Walk up from the click target looking for a 'data-id' that matches a block in this
      // workspace. Every block's SVG group gets 'data-id' set to the block's id unconditionally
      // at init time - unlike the plain 'id' attribute (used by other node types, e.g. comments)
      // or CSS classes like '.blocklyDraggable' (toggled based on the block's *effective* movable
      // state, which is false for every block in a read-only workspace).
      let block: Blockly.BlockSvg | null = null;
      let element: Element | null = event.target as Element | null;
      while (element && element !== container) {
        const dataId = element.getAttribute('data-id');
        if (dataId) {
          const candidate = workspace.getBlockById(dataId);
          if (candidate) {
            block = candidate;
            break;
          }
        }
        element = element.parentElement;
      }
      selectBlock(block);
    };
    container.addEventListener('pointerdown', handlePointerDown, true);

    // Blockly's built-in copy shortcut refuses to run on a read-only workspace, so we handle the
    // key combo ourselves. Blockly.clipboard.copy() is designed to be called this way (it
    // performs no permission checks of its own).
    const handleKeyDown = (event: KeyboardEvent): void => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c') {
        copySelectedBlock();
      }
    };
    container.addEventListener('keydown', handleKeyDown);

    const resizeObserver = new ResizeObserver(() => {
      Blockly.svgResize(workspace);
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('pointerdown', handlePointerDown, true);
      selectedBlockRef.current = null;
      workspaces.removeWorkspace(workspace);
      workspace.dispose();
    };
  }, [props.moduleContentText, props.theme]);

  return (
    <div style={{ position: 'relative', ...FULL_SIZE_STYLE }}>
      <Antd.Tooltip title={t('SAMPLES.COPY_BLOCK_TOOLTIP')}>
        <Antd.Button
          style={COPY_BUTTON_STYLE}
          size="small"
          icon={<CopyOutlined />}
          disabled={!hasSelectedBlock}
          onClick={copySelectedBlock}
        >
          {t('SAMPLES.COPY_BLOCK')}
        </Antd.Button>
      </Antd.Tooltip>
      <div ref={blocklyDiv} style={FULL_SIZE_STYLE} />
    </div>
  );
}
