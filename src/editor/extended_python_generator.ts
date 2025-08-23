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
import * as mechanismContainerHolder from '../blocks/mrc_mechanism_component_holder';
import * as eventHandler from '../blocks/mrc_event_handler';
import {
    MODULE_NAME_BLOCKS_BASE_CLASSES,
    CLASS_NAME_OPMODE,
    getClassData,
} from '../blocks/utils/python';
import * as storageModule from '../storage/module';

export class OpModeDetails {
  constructor(private name: string, private group : string, private enabled : boolean, private type : string) {}
  decorations(className : string) : string{
    let code = '';

    if (this.enabled){
      code += '@' + this.type + "\n";

      if (this.name){
        code += '@Name(' + className + ', "' + this.name + '")\n';
      }
      if (this.group){
        code += '@Group(' + className + ', "' + this.group + '")\n';
      }
    }
    return code;
  }
  imports() : string{
    let code = '';
    if (this.enabled){
      code += 'from ' + MODULE_NAME_BLOCKS_BASE_CLASSES + ' import ' + this.type;
      if (this.name){
        code += ', Name';
      }
      if (this.group){
        code += ', Group';
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

  // Fields related to generating the __init__ for a mechanism.
  private hasAnyComponents = false;
  private componentPorts: {[key: string]: string} = Object.create(null);

  // Has event handlers (ie, needs to call self.register_event_handlers in __init__)
  private hasAnyEventHandlers = false;

  private classMethods: {[key: string]: string} = Object.create(null);
  private registerEventHandlerStatements: string[] = [];
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
  generateInitStatements() : string {
    let initStatements = '';

    if (this.getModuleType() === storageModule.ModuleType.MECHANISM && this.hasAnyComponents) {
      initStatements += this.INDENT + 'self.define_hardware(' +
          this.getComponentPortParameters().join(', ') + ')\n';
    }

    if (this.hasAnyEventHandlers) {
      initStatements += this.INDENT + "self.register_event_handlers()\n";
    }

    return initStatements;
  }

  getVariableName(nameOrId: string): string {
    const varName = super.getVariableName(nameOrId);
    return "self." + varName;
  }

  mrcWorkspaceToCode(workspace: Blockly.Workspace, context: GeneratorContext): string {
    this.workspace = workspace;
    this.context = context;

    this.hasAnyComponents = false;
    this.componentPorts = Object.create(null);
    if (this.getModuleType() ===  storageModule.ModuleType.MECHANISM) {
      this.hasAnyComponents = mechanismContainerHolder.hasAnyComponents(this.workspace);
      mechanismContainerHolder.getComponentPorts(this.workspace, this.componentPorts);
    }
    this.hasAnyEventHandlers = eventHandler.getHasAnyEnabledEventHandlers(this.workspace);

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
   * If the given moduleOrClass is in the blocks_base_classes package, the simple name is returned.
   */
  addImport(moduleOrClass: string): string {
    const key = 'import_' + moduleOrClass;

    if (moduleOrClass.startsWith(MODULE_NAME_BLOCKS_BASE_CLASSES + '.') &&
        moduleOrClass.lastIndexOf('.') == MODULE_NAME_BLOCKS_BASE_CLASSES.length) {
      const simpleName = moduleOrClass.substring(MODULE_NAME_BLOCKS_BASE_CLASSES.length + 1);
      this.definitions_[key] = 'from ' + MODULE_NAME_BLOCKS_BASE_CLASSES + ' import ' + simpleName;
      return simpleName;
    }

    this.definitions_[key] = 'import ' + moduleOrClass;
    return '';
  }

  /**
   * Add a class method definition.
   */
  addClassMethodDefinition(methodName: string, code: string): void {
    this.classMethods[methodName] = code;
  }

  addRegisterEventHandlerStatement(registerEventHandlerStatement: string): void {
    this.registerEventHandlerStatements.push(registerEventHandlerStatement);
  }

  getComponentPortParameters(): string[] {
    const ports: string[] = []
    for (const port in this.componentPorts) {
      ports.push(port);
    }
    return ports;
  }

  finish(code: string): string {
    if (this.context && this.workspace) {
      const className = this.context.getClassName();
      const baseClassName = this.context.getBaseClassName();
      const decorations = this.details?.decorations(className);
      const import_decorations = this.details?.imports();

      if (import_decorations) {
        this.definitions_['import_decorations'] = import_decorations;
      }

      const simpleBaseClassName = this.addImport(baseClassName);
      if (!simpleBaseClassName) {
        throw new Error('addImport for ' + baseClassName + ' did not return a valid simple name')
      }

      const classDef = 'class ' + className + '(' + simpleBaseClassName + '):\n';
      const classMethods = [];

      if (this.registerEventHandlerStatements && this.registerEventHandlerStatements.length > 0) {
        let code = 'def register_event_handlers(self):\n';
        for (const registerEventHandlerStatement of this.registerEventHandlerStatements) {
          code += this.INDENT + registerEventHandlerStatement;
        }
        classMethods.push(code);
      }
      // Generate the __init__ method first.
      if ('__init__' in this.classMethods) {
        classMethods.push(this.classMethods['__init__'])
      }
      for (const name in this.classMethods) {
        if (name === '__init__') {
          continue;
        }
        classMethods.push(this.classMethods[name])
      }
      this.classMethods = Object.create(null);
      this.registerEventHandlerStatements = [];
      this.componentPorts = Object.create(null);
      code = classDef + this.prefixLines(classMethods.join('\n\n'), this.INDENT);
      if (decorations){
        code = decorations + code;
      }
      this.details = null;
    }

    return super.finish(code);
  }

  setOpModeDetails(details : OpModeDetails) {
    this.details = details;
  }

  getClassSpecificForInit() : string{
    if (this.context?.getBaseClassName() == CLASS_NAME_OPMODE) {
      return 'robot'
    }
    return ''
  }

  /**
   * This returns the list of methods that are derived from so that mrc_class_method_def
   * knows whether to call super() or not.
   * @returns list of method names
   */
  getBaseClassMethods() : string[] {
    const methodNames: string[] = [];

    const baseClassName = this.context?.getBaseClassName();
    if (baseClassName) {
      const classData = getClassData(baseClassName);
      if (!classData) {
        throw new Error('ClassData not found for ' + baseClassName);
      }
      classData.instanceMethods.forEach(functionData => {
          methodNames.push(functionData.functionName);
      });
    }

    return methodNames;
  }

  /**
   * Returns true if the method is in the base class.
   * @param methodName the name of the method to check
   */
  inBaseClassMethod(methodName: string): boolean {
    const baseMethods = this.getBaseClassMethods();
    return baseMethods.includes(methodName);
  }
}

export const extendedPythonGenerator = new ExtendedPythonGenerator();
