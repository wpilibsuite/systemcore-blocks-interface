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
 * @fileoverview Create a field that has a flydown workspace
 * @author alan@porpoiseful.com (Alan Smith)
 * 
 * Heavily inspired by
 * https://github.com/mit-cml/blockly-plugins/blob/main/block-lexical-variables/src/fields/field_flydown.js
 */
import * as Blockly from 'blockly';

enum FlydownLocation {
    DISPLAY_BELOW = 'displayBelow',
    DISPLAY_ABOVE = 'displayAbove',
    DISPLAY_LEFT = 'displayLeft',
    DISPLAY_RIGHT = 'displayRight',
}
class CustomFlyout extends Blockly.VerticalFlyout {
    protected x: number = 0;
    protected y: number = 0;

    public setPosition(x: number, y: number): void {
        this.x = x;
        this.y = y;
        this.position();
    }

    override position() {
        if (!this.isVisible() || !this.targetWorkspace!.isVisible()) {
            return;
        }

        this.height_ = this.getHeight();

        const edgeWidth = this.width_ - this.CORNER_RADIUS;
        const edgeHeight = this.height_ - 2 * this.CORNER_RADIUS;

        this.mySetBackgroundPath(edgeWidth, edgeHeight);

        const x = this.getX();
        const y = this.getY();

        this.positionAt_(this.width_, this.height_, x, y);
    }
    protected getHeight(): number {
        let flydownWorkspace = this.getWorkspace();
        if (!flydownWorkspace) {
            return 0;
        }
        const blocks = flydownWorkspace.getAllBlocks();
        let height = 0; 
        blocks.forEach((block : Blockly.BlockSvg) => {
            const blockHeight = block.getHeightWidth().height;
            height += blockHeight + this.GAP_Y; // Add some padding between blocks
        });

        return height;
    }
    

    /**
     * Create and set the path for the visible boundaries of the flyout.
     *
     * @param width The width of the flyout, not including the rounded corners.
     * @param height The height of the flyout, not including rounded corners.
     */
    private mySetBackgroundPath(width: number, height: number) {
        const atRight = false;
        const totalWidth = width + this.CORNER_RADIUS;

        // Decide whether to start on the left or right.
        const path: Array<string | number> = [
            'M ' + (atRight ? totalWidth : 0) + ',0',
        ];
        // Top.
        path.push('h', atRight ? -width : width);
        // Rounded corner.
        path.push(
            'a',
            this.CORNER_RADIUS,
            this.CORNER_RADIUS,
            0,
            0,
            atRight ? 0 : 1,
            atRight ? -this.CORNER_RADIUS : this.CORNER_RADIUS,
            this.CORNER_RADIUS,
        );
        // Side closest to workspace.
        path.push('v', Math.max(0, height));
        // Rounded corner.
        path.push(
            'a',
            this.CORNER_RADIUS,
            this.CORNER_RADIUS,
            0,
            0,
            atRight ? 0 : 1,
            atRight ? this.CORNER_RADIUS : -this.CORNER_RADIUS,
            this.CORNER_RADIUS,
        );
        // Bottom.
        path.push('h', atRight ? width : -width);
        path.push('z');
        this.svgBackground_!.setAttribute('d', path.join(' '));
    }

    /**
     * Calculates the x coordinate for the flyout position.
     *
     * @returns X coordinate.
     */
    getX(): number {
        return this.x;
    }

    /**
     * Calculates the y coordinate for the flyout position.
     *
     * @returns Y coordinate.
     */
    getY(): number {
        return this.y;
    }
}

export class FieldFlydown extends Blockly.FieldTextInput {
    /**
     * Milliseconds to wait before showing flydown after mouseover event on flydown
     * field.
     * @type {number}
     * @const
     */
    static TIME_OUT = 500;


    private displayLocation_: FlydownLocation;
    protected fieldCSSClassName: string = 'blocklyFlydownField';

    private flydown_: CustomFlyout | null = null;
    private boundMouseOverHandler_: (e: Event) => void;
    private boundMouseOutHandler_: (e: Event) => void;
    private showTimeout_: number | null = null;
    private hideTimeout_: number | null = null;

    constructor(value: string, isEditable: boolean, displayLocation: FlydownLocation = FlydownLocation.DISPLAY_BELOW) {
        super(value);
        this.EDITABLE = isEditable;
        this.displayLocation_ = displayLocation;

        // Bind the handlers
        this.boundMouseOverHandler_ = this.onMouseOver_.bind(this);
        this.boundMouseOutHandler_ = this.onMouseOut_.bind(this);
    }

    protected override showEditor_() {
        if (!this.EDITABLE) {
            return;
        }
        super.showEditor_();
    }
    override init(): void {
        super.init();
        //       Blockly.utils.dom.addClass(this.fieldGroup_, this.fieldCSSClassName);
    }

    public override initView() {
        super.initView();

        // Add event listeners instead of using mouseOverWrapper_
        if (this.getClickTarget_()) {
            this.getClickTarget_()!.addEventListener('mouseover', this.boundMouseOverHandler_);
            this.getClickTarget_()!.addEventListener('mouseout', this.boundMouseOutHandler_);
        }
    }

    private onMouseOver_(e: Event) {
        // Clear any pending hide timeout
        if (this.hideTimeout_) {
            clearTimeout(this.hideTimeout_);
            this.hideTimeout_ = null;
        }

        // Add small delay to prevent flickering
        this.showTimeout_ = window.setTimeout(() => {
            this.showFlydown_();
        }, 250); // 250ms delay

        // This event has been handled.  No need to bubble up to the document.
        e.stopPropagation();
    }

    private onMouseOut_(e: Event) {
        // Clear any pending show timeout
        if (this.showTimeout_) {
            clearTimeout(this.showTimeout_);
            this.showTimeout_ = null;
        }

        // Add delay before hiding to allow moving to flydown
        this.hideTimeout_ = window.setTimeout(() => {
            this.hideFlydown_();
        }, FieldFlydown.TIME_OUT);
    }
    private createFlydown_(mainWorkspace: Blockly.WorkspaceSvg) {
        if (this.flydown_) return;

        try {
            // Use the workspace's flyout as a template
            const existingFlyout = mainWorkspace.getFlyout?.();

            if (existingFlyout) {
                // Clone the existing flyout's options
                this.flydown_ = new CustomFlyout(existingFlyout.getWorkspace().options);
            } else {
                // Fallback to creating a new flyout if no existing one is found
                this.flydown_ = new CustomFlyout(mainWorkspace.options);
            }
            Blockly.utils.dom.insertAfter(
                this.flydown_.createDom("svg")!,
                mainWorkspace.getParentSvg(),
            );


            this.flydown_.init(mainWorkspace);

            const fieldElement = this.getClickTarget_();
            if (!fieldElement) return;

            const fieldRect = fieldElement.getBoundingClientRect();
            const workspaceRect = mainWorkspace.getParentSvg().getBoundingClientRect();

            const x = fieldRect.right - workspaceRect.left;
            const y = fieldRect.top - workspaceRect.top;


            // Set flydown position
            this.flydown_.setPosition(x, y);
            // Create the flydown without explicit DOM manipulation
            this.flydown_.setVisible(true);

        } catch (error) {
            console.error('Failed to create flydown:', error);
        }
    }

    private showFlydown_() {
        if (this.flydown_ && this.flydown_.isVisible()) {
            return; // Already showing
        }

        const workspace = this.getSourceBlock()?.workspace;
        if (!workspace) return;

        const mainWorkspace = workspace.isFlyout ?
            Blockly.getMainWorkspace() as Blockly.WorkspaceSvg : workspace as Blockly.WorkspaceSvg;

        // Create flydown if it doesn't exist
        if (!this.flydown_) {
            this.createFlydown_(mainWorkspace);
        }
        if (this.flydown_) {
            const fieldElement = this.getClickTarget_();

            const fieldRect = fieldElement!.getBoundingClientRect();
            const workspaceRect = mainWorkspace.getParentSvg().getBoundingClientRect();

            const x = fieldRect.right - workspaceRect.left;
            const y = fieldRect.top - workspaceRect.top;

            // Set flydown position
            this.flydown_.setPosition(x, y);
            // Show the flydown with your blocks
            this.flydown_.show(this.getBlocksForFlydown_());

            // Add hover listeners to flydown to keep it open
            this.addFlydownHoverListeners_();
        }
    }
    private getBlocksForFlydown_() {
        const name = this.getText();
        return {
            contents: [
                {
                    kind: 'block',
                    type: 'mrc_get_parameter',
                    fields: {
                        PARAMETER_NAME: name,
                    },
                },
            ]
        };
    }


    private addFlydownHoverListeners_() {
        if (!this.flydown_) return;

        const flydownSvg = this.flydown_.getWorkspace()?.getParentSvg();
        if (flydownSvg) {
            flydownSvg.addEventListener('mouseenter', () => {
                if (this.hideTimeout_) {
                    clearTimeout(this.hideTimeout_);
                    this.hideTimeout_ = null;
                }
            });

            flydownSvg.addEventListener('mouseleave', () => {
                this.hideTimeout_ = window.setTimeout(() => {
                    this.hideFlydown_();
                }, FieldFlydown.TIME_OUT);
            });
        }
    }

    private hideFlydown_() {
        if (this.flydown_) {
            this.flydown_.hide();
        }
    }


    override dispose() {
        // Clear timeouts
        if (this.showTimeout_) {
            clearTimeout(this.showTimeout_);
        }
        if (this.hideTimeout_) {
            clearTimeout(this.hideTimeout_);
        }

        // Remove event listeners
        const clickTarget = this.getClickTarget_();
        if (clickTarget) {
            clickTarget.removeEventListener('mouseenter', this.boundMouseOverHandler_);
            clickTarget.removeEventListener('mouseleave', this.boundMouseOutHandler_);
        }

        if (this.flydown_) {
            this.flydown_.dispose();
            this.flydown_ = null;
        }
        super.dispose();
    }

}

export function createFieldFlydown(label: string, isEditable: boolean): Blockly.Field {
    return new FieldFlydown(label, isEditable);
}