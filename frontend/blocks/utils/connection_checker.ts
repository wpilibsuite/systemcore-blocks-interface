// Copyright (c) FIRST and other WPILib contributors.

/**
 * @fileoverview A Blockly plugin that makes connection type checks include methods
 * @author alan@porpoiseful.com (Alan Smith)
 */
import * as Blockly from 'blockly/core';
import { OUTPUT_NAME as MECHANISM_OUTPUT } from '../mrc_mechanism';
import { OUTPUT_NAME as COMPONENT_OUTPUT } from '../mrc_component';
import { OUTPUT_NAME as EVENT_OUTPUT } from '../mrc_event';

export class MethodConnectionChecker extends Blockly.ConnectionChecker {
  /**
   * Constructor for the connection checker.
   */
  constructor() {
    super();
  }

  /**
   * Type check arrays must either intersect or both be null.
   * @override
   */
  doTypeChecks(a : Blockly.Connection, b: Blockly.Connection) {
    const checkArrayOne = a.getCheck();
    const checkArrayTwo = b.getCheck();

    if (!checkArrayOne || !checkArrayTwo) {
      // if either one has mrc_component, they must match
      if ((checkArrayOne && (checkArrayOne.indexOf(COMPONENT_OUTPUT) != -1)) ||
        (checkArrayTwo && (checkArrayTwo.indexOf(COMPONENT_OUTPUT) != -1))){
         return false;
      }
      // if either one has mrc_mechanism, they must match
      if ((checkArrayOne && (checkArrayOne.indexOf(MECHANISM_OUTPUT) != -1)) ||
        (checkArrayTwo && (checkArrayTwo.indexOf(MECHANISM_OUTPUT) != -1))){
         return false;
      }
      // if either one has mrc_event, they must match
      if ((checkArrayOne && (checkArrayOne.indexOf(EVENT_OUTPUT) != -1)) ||
        (checkArrayTwo && (checkArrayTwo.indexOf(EVENT_OUTPUT) != -1))){
         return false;
      }
      return true;
    }

    // Find any intersection in the check lists.
    for (let i = 0; i < checkArrayOne.length; i++) {
      if (checkArrayTwo.indexOf(checkArrayOne[i]) != -1) {
        return true;
      }
    }
    // No intersection.

    return false;
  }
}

export const registrationType = Blockly.registry.Type.CONNECTION_CHECKER;
export const registrationName = 'HardwareConnectionChecker';

Blockly.registry.register(
  registrationType,
  registrationName,
  MethodConnectionChecker,
);

export const pluginInfo = {
  [registrationType as any]: registrationName,
};