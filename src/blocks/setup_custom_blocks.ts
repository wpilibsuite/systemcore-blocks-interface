
import * as CallPythonFunction from './mrc_call_python_function';
import * as ClassMethodDef from './mrc_class_method_def';
import * as Component from './mrc_component';
import * as Event from './mrc_event';
import * as EventHandler from './mrc_event_handler';
import * as GetParameter from './mrc_get_parameter';
import * as GetPythonEnumValue from './mrc_get_python_enum_value';
import * as GetPythonVariable from './mrc_get_python_variable';
import * as ListAddItem from './mrc_list_add_item';
import * as MathMinMax from './mrc_math_min_max';
import * as Mechanism from './mrc_mechanism';
import * as MechanismComponentHolder from './mrc_mechanism_component_holder';
import * as MiscComment from './mrc_misc_comment';
import * as MiscEvaluateButIgnoreResult from './mrc_misc_evaluate_but_ignore_result';
import * as None from './mrc_none';
import * as OpModeDetails from './mrc_opmode_details';
import * as ParameterMutator from './mrc_param_container'
import * as Port from './mrc_port';
import * as SetPythonVariable from './mrc_set_python_variable';

const customBlocks = [
  CallPythonFunction,
  ClassMethodDef,
  Component,
  Event,
  EventHandler,
  GetParameter,
  GetPythonEnumValue,
  GetPythonVariable,
  ListAddItem,
  MathMinMax,
  Mechanism,
  MechanismComponentHolder,
  MiscComment,
  MiscEvaluateButIgnoreResult,
  None,
  OpModeDetails,
  ParameterMutator,
  Port,
  SetPythonVariable,
];

export const setup = function(forBlock: any) {
  customBlocks.forEach(block => {
    block.setup();
    const maybeBlock = block as { pythonFromBlock?: any; BLOCK_NAME?: string };
    if (maybeBlock.pythonFromBlock && maybeBlock.BLOCK_NAME) {
      forBlock[maybeBlock.BLOCK_NAME] = maybeBlock.pythonFromBlock;
    }
  });
};
