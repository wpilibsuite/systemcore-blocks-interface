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
import { Order, PythonGenerator } from 'blockly/python';
import { createGeneratorContext, GeneratorContext } from './generator_context';
import * as mechanismContainerHolder from '../blocks/mrc_mechanism_component_holder';
import * as eventHandler from '../blocks/mrc_event_handler';
import { STEPS_METHOD_NAME } from '../blocks/mrc_steps';

import {
    MODULE_NAME_BLOCKS_BASE_CLASSES,
    TELEOP_DECORATOR_CLASS,
    AUTO_DECORATOR_CLASS,
    TEST_DECORATOR_CLASS,
    NAME_DECORATOR_CLASS,
    GROUP_DECORATOR_CLASS,
    START_METHOD_NAME,
    PERIODIC_METHOD_NAME,
    END_METHOD_NAME,
    getClassData,
} from '../blocks/utils/python';
import * as storageModule from '../storage/module';

type BlockExecutionDetails = {
  className: string,
  blockId: string,
  blockType: string,
  blockLabel: string,
};

export class OpModeDetails {
  constructor(private name: string, private group: string, private enabled: boolean, private type: string) {}
  generateDecorators(generator: ExtendedPythonGenerator, className: string): string {
    let code = '';

    if (this.enabled) {
      let typeDecoratorClass: string = '';
      switch (this.type) {
        case 'Teleop':
          typeDecoratorClass = TELEOP_DECORATOR_CLASS;
          break;
        case 'Auto':
          typeDecoratorClass = AUTO_DECORATOR_CLASS;
          break;
        case 'Test':
          typeDecoratorClass = TEST_DECORATOR_CLASS;
          break;
      }
      // Import the module for the decorator, not the decorator class itself
      // because otherwise the Teleop decorator collides with the class name of
      // the OpMode module that is created automatically when a new project is
      // created. Similarly, it is likely that the user might make an opmode
      // named Test or Auto.
      const lastDot = typeDecoratorClass.lastIndexOf('.');
      if (lastDot === -1) {
        throw new Error(`The decorator class ${typeDecoratorClass} should contain a '.'`);
      }
      const moduleName = typeDecoratorClass.substring(0, lastDot);
      generator.importModule(moduleName);
      code += `@${typeDecoratorClass}\n`;

      if (this.name) {
        const nameDecorator = generator.importModuleDotClass(NAME_DECORATOR_CLASS);
        code += `@${nameDecorator}(${className}, '${this.name}')\n`;
      }
      if (this.group) {
        const groupDecorator = generator.importModuleDotClass(GROUP_DECORATOR_CLASS);
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
  private mechanismInitArgNames: string[] = [];

  // Has event handlers (ie, needs to call self.register_event_handlers in __init__)
  private hasAnyEventHandlers = false;

  private classMethods: {[key: string]: string} = Object.create(null);
  private registerEventHandlerStatements: string[] = [];

  private importedNames: {[name: string]: string} = Object.create(null); // value is an import statement
  private fromModuleImportNames: {[module: string]: string[]} = Object.create(null); // value is an array of names being imported from the module.

  // Opmode details
  private opModeDetails: OpModeDetails | null  = null;

  private generateErrorHandling: boolean = false;

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

  addErrorHandlingCode(block: Blockly.Block, blockLabel: string, originalCode: string | [string, number]): string | [string, number] {
    if (!this.generateErrorHandling) {
      return originalCode;
    }

    const blockExecutionDetails: BlockExecutionDetails = {
      className: this.context.getClassName(),
      blockId: block.id,
      blockType: block.type,
      blockLabel: blockLabel,
    };
    const startBlockExecution = 'BlockExecution.startBlockExecution(' +
        "'" + JSON.stringify(blockExecutionDetails) + "')";

    // originalCode might be an array, for value blocks, or a string, for statement blocks.
    if (Array.isArray(originalCode)) {
      // Handle value blocks, where originalCode[0] is the generated code.

      // BlockExecution.startBlockExecution always returns True and
      // BlockExecution.endBlockExecution returns whatever is passed to it.
      // This allows us to wrap the original code, which is a value, not a
      // statement.
      const code = '(BlockExecution.endBlockExecution(' + originalCode[0] + ') ' +
          'if ' + startBlockExecution + ' else None)';
      return [code, Order.CONDITIONAL];
    } else {
      // Handle statement blocks, where originalCode is the generated code.
      return startBlockExecution + '\n' +
          originalCode +
          'BlockExecution.endBlockExecution(None)\n';
    }
  }

  /*
   * This is called from the python generator for the mrc_class_method_def for the
   * init method
   */
  generateInitStatements(): string {
    let initStatements = '';

    switch (this.getModuleType()) {
      case storageModule.ModuleType.ROBOT:
        initStatements += this.INDENT + 'self.mechanisms = []\n';
        initStatements += this.INDENT + 'self.event_handlers = {}\n';
        initStatements += this.INDENT + 'self.define_hardware()\n';
        break;
      case storageModule.ModuleType.MECHANISM:
        if (this.hasAnyComponents) {
          initStatements += this.INDENT + 'self.define_hardware(' +
              this.mechanismInitArgNames.join(', ') + ')\n';
        }
        break;
      case storageModule.ModuleType.OPMODE:
        initStatements += this.INDENT + 'self.robot = robot\n';
        break;
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

  mrcWorkspaceToCode(workspace: Blockly.Workspace, module: storageModule.Module, opt_generateErrorHandling?: boolean): string {
    this.workspace = workspace;

    this.context.setModule(module);
    if (opt_generateErrorHandling) {
      this.generateErrorHandling = true;
      this.fromModuleImportName(MODULE_NAME_BLOCKS_BASE_CLASSES, 'BlockExecution');
    }
    this.init(workspace);

    if (this.getModuleType() ===  storageModule.ModuleType.MECHANISM) {
      this.hasAnyComponents = mechanismContainerHolder.hasAnyComponents(workspace);
      mechanismContainerHolder.getMechanismInitArgNames(workspace, this.mechanismInitArgNames);
    }
    this.hasAnyEventHandlers = eventHandler.getHasAnyEnabledEventHandlers(workspace);

    const code = super.workspaceToCode(workspace);

    // Clean up.
    this.context.setModule(null);
    this.workspace = null;
    this.hasAnyComponents = false;
    this.mechanismInitArgNames = [];
    this.hasAnyEventHandlers = false;
    this.classMethods = Object.create(null);
    this.registerEventHandlerStatements = [];
    this.importedNames = Object.create(null);
    this.fromModuleImportNames = Object.create(null);
    this.opModeDetails = null;
    this.generateErrorHandling = false;

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

  importModuleDotClass(moduleDotClass: string): string {
    const lastDot = moduleDotClass.lastIndexOf('.');
    if (lastDot !== -1) {
      const moduleName = moduleDotClass.substring(0, lastDot);
      const className = moduleDotClass.substring(lastDot + 1);
      if (this.fromModuleImportName(moduleName, className)) {
        return className;
      }
      this.importModule(moduleName);
    }
    return moduleDotClass;
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

  getMechanismInitArgNames(): string[] {
    return this.mechanismInitArgNames;
  }

  finish(code: string): string {
    if (this.workspace) {
      const className = this.context.getClassName();
      const decorators = this.opModeDetails
          ? this.opModeDetails.generateDecorators(this, className)
          : '';

      let baseClassName = this.context.getBaseClassName();
      baseClassName = this.importModuleDotClass(baseClassName);

      code = decorators + 'class ' + className + '(' + baseClassName + '):\n';

      if (this.getModuleType() === storageModule.ModuleType.ROBOT) {
        // Define methods that we use for blocks, but are not in wpilib.OpModeRobot.
        this.fromModuleImportName('typing', 'Callable');
        this.classMethods['register_event_handler'] = (
            'def register_event_handler(self, event_name: str, event_handler: Callable) -> None:\n' +
            this.INDENT + 'if event_name in self.event_handlers:\n' +
            this.INDENT.repeat(2) + 'self.event_handlers[event_name].append(event_handler)\n' +
            this.INDENT + 'else:\n' +
            this.INDENT.repeat(2) + 'self.event_handlers[event_name] = [event_handler]\n'
        );
        this.classMethods['unregister_event_handler'] = (
            'def unregister_event_handler(self, event_name: str, event_handler: Callable) -> None:\n' +
            this.INDENT + 'if event_name in self.event_handlers:\n' +
            this.INDENT.repeat(2) + 'if event_handler in self.event_handlers[event_name]:\n' +
            this.INDENT.repeat(3) + 'self.event_handlers[event_name].remove(event_handler)\n' +
            this.INDENT.repeat(3) + 'if not self.event_handlers[event_name]:\n' +
            this.INDENT.repeat(4) + 'del self.event_handlers[event_name]\n'
        )
        this.classMethods['fire_event'] = (
            'def fire_event(self, event_name: str, *args) -> None:\n' +
            this.INDENT + 'if event_name in self.event_handlers:\n' +
            this.INDENT.repeat(2) + 'for event_handler in self.event_handlers[event_name]:\n' +
            this.INDENT.repeat(3) + 'event_handler(*args)\n'
        )
        this.classMethods['opmode_start'] = (
            'def opmode_start(self) -> None:\n' +
            this.INDENT + 'for mechanism in self.mechanisms:\n' +
            this.INDENT.repeat(2) + 'mechanism.opmode_start()\n'
        );
        this.classMethods['opmode_periodic'] = (
            'def opmode_periodic(self) -> None:\n' +
            this.INDENT + 'for mechanism in self.mechanisms:\n' +
            this.INDENT.repeat(2) + 'mechanism.opmode_periodic()\n'
        );
        this.classMethods['opmode_end'] = (
            'def opmode_end(self) -> None:\n' +
            this.INDENT + 'for mechanism in self.mechanisms:\n' +
            this.INDENT.repeat(2) + 'mechanism.opmode_end()\n'
        );
      }

      if (this.getModuleType() === storageModule.ModuleType.OPMODE) {
        // Add code to the Start method to call robot.opmode_start.
        this.classMethods[START_METHOD_NAME] = this.insertCodeToCallRobot(START_METHOD_NAME, 'opmode_start');

        // Add code to the Periodic method to call robot.opmode_periodic.
        let periodicCode = this.insertCodeToCallRobot(PERIODIC_METHOD_NAME, 'opmode_periodic');
        if (STEPS_METHOD_NAME in this.classMethods) {
          // Generate code to call the steps method after the user's code.
          periodicCode += this.INDENT + `self.${STEPS_METHOD_NAME}()\n`;
        }
        this.classMethods[PERIODIC_METHOD_NAME] = periodicCode;

        // Add code to the End method to call robot.opmode_end.
        this.classMethods[END_METHOD_NAME] = this.insertCodeToCallRobot(END_METHOD_NAME, 'opmode_end');
      }

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

  private insertCodeToCallRobot(methodName: string, robotMethodName: string): string {
    const defAndSuper = `def ${methodName}(self):\n` + this.INDENT + `super().${methodName}()\n`;
    let code: string;
    if (methodName in this.classMethods) {
      code = this.classMethods[methodName];
      // Make sure code starts with defAndSuper.
      if (!code.startsWith(defAndSuper)) {
        throw new Error(`The generated code for the ${methodName} method should start with ${defAndSuper}`);
      }
      code = code.substring(defAndSuper.length);
    } else {
      // The user has not defined the method. We will define it now.
      code = '';
    }
    // Generate code to call the robot method immediately after calling the superclass method.
    return defAndSuper + this.INDENT + `self.robot.${robotMethodName}()\n` + code;
  }

  setOpModeDetails(opModeDetails: OpModeDetails) {
    this.opModeDetails = opModeDetails;
  }

  getSuperInitParameters(): string {
    // wpilib.OpModeRobot, Mechanism, and wpilib.PeriodicOpMode all have no argument __init__ methods.
    return '';
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
      if (classData) {
        classData.instanceMethods.forEach(functionData => {
            methodNames.push(functionData.functionName);
        });
      } else {
        console.error('ClassData not found for ' + baseClassName);
      }
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
