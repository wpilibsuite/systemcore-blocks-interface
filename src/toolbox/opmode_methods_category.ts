import { MRC_STYLE_CLASS_BLOCKS } from '../themes/styles'
export const category =
{
    kind: 'category',
    style: MRC_STYLE_CLASS_BLOCKS,
    name: 'Methods',
    contents: [
        {
            kind: 'block',
            type: 'mrc_class_method_def',    
            fields: {NAME: "init"},
            extraState: {
                canChangeSignature: false,
                canDelete: false,
                returnType: 'None',
                pythonMethodName: '__init__',
                params: []
            },   
        },    
        {
            kind: 'block',
            type: 'mrc_class_method_def',    
            fields: {NAME: "start"},
            extraState: {
                canChangeSignature: false,
                canDelete: true,
                returnType: 'None',
                params: []
            },    
        },        
        {
            kind: 'block',
            type: 'mrc_class_method_def',    
            fields: {NAME: "loop"},
            extraState: {
                canChangeSignature: false,
                canDelete: false,
                returnType: 'None',
                params: []
            },    
        },    
        {
            kind: 'block',
            type: 'mrc_class_method_def',    
            fields: {NAME: "stop"},
            extraState: {
                canChangeSignature: false,
                canDelete: true,
                returnType: 'None',
                params: []
            },    
        },    
        {
            kind: 'block',
            type: 'mrc_class_method_def',    
            fields: {NAME: "my_method"},
            extraState: {
                canChangeSignature: true,
                canDelete: true,
                returnType: 'None',
                params: []
            }     
        },
    ],
}