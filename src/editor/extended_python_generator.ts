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

import * as Blockly from 'blockly/core';
import { PythonGenerator } from 'blockly/python';
import { GeneratorContext } from './generator_context';
import * as MechanismContainerHolder from '../blocks/mrc_mechanism_component_holder';

export class OpModeDetails {
  constructor(private name: string, private group : string, private enabled : boolean, private type : string) {}
  annotations() : string{
    let code = '';

    if (this.enabled){
      code += '@' + this.type + "\n";
      if (this.name){
        code += '@name("' + this.name + '")\n';
      }
      if (this.group){
        code += '@group("' + this.group + '")\n';
      }
    }
    return code;
  }
}

// Extends the python generator to collect some information about functions and
// variables that have been defined so they can be used in other modules.

export class ExtendedPythonGenerator extends PythonGenerator {
  private workspace: Blockly.Workspace | null = null;
  private context: GeneratorContext | null = null;

  private classMethods: {[key: string]: string} = Object.create(null);
  private events: {[key: string]: {sender: string, eventName: string}} = Object.create(null);
  private ports: {[key: string]: string} = Object.create(null);
    // Opmode details
  private details : OpModeDetails | null  = null;
  
  constructor() {
    super('Python');
  }

  init(workspace: Blockly.Workspace){
    super.init(workspace);

    // super.init will have put all variables in this.definitions_['variables'] but we need to make
    // it contain only the developer variables.
    delete this.definitions_['variables'];
    const defvars = [];
    // Add developer variables (not created or named by the user).
    const devVarList = Blockly.Variables.allDeveloperVariables(workspace);
    for (let i = 0; i < devVarList.length; i++) {
      defvars.push(
        this.nameDB_!.getName(devVarList[i], Blockly.Names.DEVELOPER_VARIABLE_TYPE) + ' = None',
      );
    }
    this.definitions_['variables'] = defvars.join('\n');
  }

  /*
   * This is called from the python generator for the mrc_class_method_def for the
   * init method
   */
  defineClassVariables() : string {
    let variableDefinitions = '';

    if (this.context?.getHasHardware()) {
      variableDefinitions += this.INDENT + "self.define_hardware(";
      variableDefinitions += this.getListOfPorts(true);
      variableDefinitions += ')\n';
      if (this.events && Object.keys(this.events).length > 0){
        variableDefinitions += this.INDENT + "self.register_events()\n";
      }
    }

    return variableDefinitions;
  }
  getVariableName(nameOrId: string): string {
    const varName = super.getVariableName(nameOrId);
    return "self." + varName;
  }
  setHasHardware() : void{
    this.context?.setHasHardware();
  }

  mrcWorkspaceToCode(workspace: Blockly.Workspace, context: GeneratorContext): string {
    this.workspace = workspace;
    this.context = context;
    this.context.clear();

    if (this.workspace.getBlocksByType(MechanismContainerHolder.BLOCK_NAME).length > 0){
      this.setHasHardware();
    }

    const code = super.workspaceToCode(workspace);

    this.workspace = workspace;
    this.context = null;
    return code;
  }

  getModuleType(): string | null {
    if (this.context) {
      return this.context.getModuleType();
    }
    return null;
  }

  /**
   * Add an import statement for a python module.
   */
  addImport(importModule: string): void {
    this.definitions_['import_' + importModule] = 'import ' + importModule;
  }

  /**
   * Add a class method definition.
   */
  addClassMethodDefinition(methodName: string, code: string): void {
    this.classMethods[methodName] = code;
  }

  addEventHandler(sender: string, eventName: string, funcName: string): void {
    this.events[funcName] = {
      'sender': sender,
      'eventName': eventName,}
    }    

  /**
   * Add a Hardware Port
   */
  addHardwarePort(portName: string, type: string): void{
    this.ports[portName] = type;
  }

  getListOfPorts(startWithFirst: boolean): string{
    let returnString = ''
    let firstPort = startWithFirst;
    for (const port in this.ports) {
      if (!firstPort){
        returnString += ', ';
      }
      else{
        firstPort = false;
      }
      returnString += port;
    }
    return returnString;
  }

  finish(code: string): string {
    if (this.context && this.workspace) {
      const className = this.context.getClassName();
      const classParent = this.context.getClassParent();
      const annotations = this.details?.annotations();
      this.addImport(classParent);

      const classDef = 'class ' + className + '(' + classParent + '):\n';
      const classMethods = [];

      if (this.events && Object.keys(this.events).length > 0) {
        let code = 'def register_events(self):\n';
        for (const eventName in this.events) {
          const event = this.events[eventName];
          code += this.INDENT + 'self.' + event.sender + '.register_event("' + event.eventName + '", self.' + eventName + ')\n';
        }
        classMethods.push(code);
      }
      for (const name in this.classMethods) {
        classMethods.push(this.classMethods[name])
      }
      this.events = Object.create(null);
      this.classMethods = Object.create(null);
      this.ports = Object.create(null);
      code = classDef + this.prefixLines(classMethods.join('\n\n'), this.INDENT);
      if (annotations){
        code = annotations + code;
      }
      this.details = null;
    }

    return super.finish(code);
  }

  setOpModeDetails(details : OpModeDetails) {
    this.details = details;
  }

  getClassSpecificForInit() : string{
    let classParent = this.context?.getClassParent();
    if (classParent == 'OpMode'){
      return 'robot'
    }
    return ''
  }
}

export const extendedPythonGenerator = new ExtendedPythonGenerator();
