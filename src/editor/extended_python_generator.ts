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
import { createGeneratorContext, GeneratorContext } from './generator_context';
import * as mechanismContainerHolder from '../blocks/mrc_mechanism_component_holder';
import * as eventHandler from '../blocks/mrc_event_handler';
import {
    MODULE_NAME_BLOCKS_BASE_CLASSES,
    CLASS_NAME_OPMODE,
    getClassData,
} from '../blocks/utils/python';
import * as storageModule from '../storage/module';

export class OpModeDetails {
  constructor(private name: string, private group: string, private enabled: boolean, private type: string) {}
  generateDecorators(generator: ExtendedPythonGenerator, className: string): string {
    let code = '';

    if (this.enabled) {
      const typeDecorator = generator.importModuleName(MODULE_NAME_BLOCKS_BASE_CLASSES, this.type);
      code += `@${typeDecorator}\n`;

      if (this.name) {
        const nameDecorator = generator.importModuleName(MODULE_NAME_BLOCKS_BASE_CLASSES, 'Name');
        code += `@${nameDecorator}(${className}, '${this.name}')\n`;
      }
      if (this.group) {
        const groupDecorator = generator.importModuleName(MODULE_NAME_BLOCKS_BASE_CLASSES, 'Group');
        code += `@${groupDecorator}(${className}, '${this.group}')\n`;
      }
    }

    return code;
  }
}

// Extends the python generator to collect some information about functions and
// variables that have been defined so they can be used in other modules.

export class ExtendedPythonGenerator extends PythonGenerator {
  private readonly context: GeneratorContext;
  private workspace: Blockly.Workspace | null = null;

  // Fields related to generating the __init__ for a mechanism.
  private hasAnyComponents = false;
  private componentPorts: {[key: string]: string} = Object.create(null);

  // Has event handlers (ie, needs to call self.register_event_handlers in __init__)
  private hasAnyEventHandlers = false;

  private classMethods: {[key: string]: string} = Object.create(null);
  private registerEventHandlerStatements: string[] = [];

  private importedNames: {[name: string]: string} = Object.create(null); // value is an import statement
  private fromModuleImportNames: {[module: string]: string[]} = Object.create(null); // value is an array of names being imported from the module.

  // Opmode details
  private opModeDetails: OpModeDetails | null  = null;

  constructor() {
    super('Python');
    this.context = createGeneratorContext();
  }

  init(workspace: Blockly.Workspace) {
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
  generateInitStatements(): string {
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

  mrcWorkspaceToCode(workspace: Blockly.Workspace, module: storageModule.Module): string {
    this.workspace = workspace;

    this.context.setModule(module);
    this.init(workspace);

    if (this.getModuleType() ===  storageModule.ModuleType.MECHANISM) {
      this.hasAnyComponents = mechanismContainerHolder.hasAnyComponents(workspace);
      mechanismContainerHolder.getComponentPorts(workspace, this.componentPorts);
    }
    this.hasAnyEventHandlers = eventHandler.getHasAnyEnabledEventHandlers(workspace);

    const code = super.workspaceToCode(workspace);

    // Clean up.
    this.context.setModule(null);
    this.workspace = null;
    this.hasAnyComponents = false;
    this.componentPorts = Object.create(null);
    this.hasAnyEventHandlers = false;
    this.classMethods = Object.create(null);
    this.registerEventHandlerStatements = [];
    this.importedNames = Object.create(null);
    this.fromModuleImportNames = Object.create(null);
    this.opModeDetails = null;

    return code;
  }

  getModuleType(): storageModule.ModuleType | null {
    if (this.context) {
      return this.context.getModuleType();
    }
    return null;
  }

  /**
   * Import a python module.
   */
  importModule(module: string): void {
    const key = 'import_' + module;
    const importStatement = 'import ' + module;
    // Note(lizlooney): We can't really handle name collisions for "import <module>" statements.
    // For the user's code, we could try to do "import <module> as <unique name>", but that would be
    // more difficulat to do for robotpy modules.
    this.definitions_[key] = importStatement;
    this.importedNames[module] = importStatement;
  }

  /**
   * Add an import statement of the form "from <module> import <name>".
   * Returns true if successful.
   */
  private fromModuleImportName(module: string, name: string): boolean {
    const importStatement = 'from ' + module + ' import ' + name;
    if (name in this.importedNames) {
      // This name is already in the importedNames map.
      // If the previously stored value is the same import statement, we don't need to do anything; return true.
      // Otherwise, we can't import this because the name will collide; return false.
      return (this.importedNames[name] === importStatement);
    }
    this.importedNames[name] = importStatement;

    if (!(module in this.fromModuleImportNames)) {
      this.fromModuleImportNames[module] = [];
    }
    this.fromModuleImportNames[module].push(name);

    return true;
  }

  /**
   * Import a name from a python module.
   * If possible, a "from <module> import <name>" import will be used, otherwise a "import <module>"
   * import will be used.
   * Returns the name, which may be qualified with the module, that can be used in generated python
   * code.
   */
  importModuleName(module: string, name: string): string {
    if (this.fromModuleImportName(module, name)) {
      return name;
    }
    this.importModule(module);
    return module + '.' + name;
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
    if (this.workspace) {
      const className = this.context.getClassName();
      const decorators = this.opModeDetails
          ? this.opModeDetails.generateDecorators(this, className)
          : '';

      let baseClassName = this.context.getBaseClassName();
      if (baseClassName.startsWith(MODULE_NAME_BLOCKS_BASE_CLASSES + '.') &&
          baseClassName.lastIndexOf('.') == MODULE_NAME_BLOCKS_BASE_CLASSES.length) {
        const simpleName = baseClassName.substring(MODULE_NAME_BLOCKS_BASE_CLASSES.length + 1);
        if (this.fromModuleImportName(MODULE_NAME_BLOCKS_BASE_CLASSES, simpleName)) {
          baseClassName = simpleName;
        } else {
          this.importModule(MODULE_NAME_BLOCKS_BASE_CLASSES);
        }
      }

      code = decorators + 'class ' + className + '(' + baseClassName + '):\n';

      const classMethods = [];

      // Generate the __init__ method first.
      if ('__init__' in this.classMethods) {
        classMethods.push(this.classMethods['__init__'])
      }

      // Generate the define_hardware method next.
      if ('define_hardware' in this.classMethods) {
        classMethods.push(this.classMethods['define_hardware'])
      }

      // Generate the register_event_handlers method next.
      if (this.registerEventHandlerStatements && this.registerEventHandlerStatements.length > 0) {
        let registerEventHandlers = 'def register_event_handlers(self):\n';
        for (const registerEventHandlerStatement of this.registerEventHandlerStatements) {
          registerEventHandlers += this.INDENT + registerEventHandlerStatement;
        }
        classMethods.push(registerEventHandlers);
      }

      // Generate the remaining methods.
      for (const name in this.classMethods) {
        if (name === '__init__' || name === 'define_hardware') {
          continue;
        }
        classMethods.push(this.classMethods[name])
      }

      code += this.prefixLines(classMethods.join('\n\n'), this.INDENT);
    }

    // Process the fromModuleImportNames to generate "from <module> import <name1>, <name2>, ..." statements.
    for (const module in this.fromModuleImportNames) {
      const names = this.fromModuleImportNames[module];
      const key = 'import_from_' + module;
      const importStatement = 'from ' + module + ' import ' + names.sort().join(', ');
      this.definitions_[key] = importStatement;
    }

    return super.finish(code);
  }

  setOpModeDetails(opModeDetails: OpModeDetails) {
    this.opModeDetails = opModeDetails;
  }

  getClassSpecificForInit(): string {
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
  getBaseClassMethods(): string[] {
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
