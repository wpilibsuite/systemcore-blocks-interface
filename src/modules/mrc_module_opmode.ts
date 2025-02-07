import * as Blockly from 'blockly';
import { BLOCK_NAME as MRC_CLASS_METHOD_DEF } from '../blocks/mrc_class_method_def'

export function create(workspace : Blockly.Workspace, render: boolean) {
    let initBlock = workspace.newBlock(MRC_CLASS_METHOD_DEF);
    initBlock.setFieldValue('init', 'NAME');
    const extra = {
        canChangeSignature: false,
        canDelete: false,
        returnType: 'None',
        pythonMethodName: '__init__',
        params: []
    };  
    if (initBlock.loadExtraState){
        initBlock.loadExtraState(extra);
    }
    if (render) {
        (initBlock as Blockly.BlockSvg).initSvg();
        (initBlock as Blockly.BlockSvg).render();
    }
}
