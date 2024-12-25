// This file was generated. Do not edit!

import * as hal from '../../blocks/generated/module_hal.js';
import * as hal_AddressableLEDData from '../../blocks/generated/class_hal.AddressableLEDData.js';
import * as hal_CANStreamMessage from '../../blocks/generated/class_hal.CANStreamMessage.js';
import * as hal_ControlWord from '../../blocks/generated/class_hal.ControlWord.js';
import * as hal_JoystickAxes from '../../blocks/generated/class_hal.JoystickAxes.js';
import * as hal_JoystickButtons from '../../blocks/generated/class_hal.JoystickButtons.js';
import * as hal_JoystickDescriptor from '../../blocks/generated/class_hal.JoystickDescriptor.js';
import * as hal_JoystickPOVs from '../../blocks/generated/class_hal.JoystickPOVs.js';
import * as hal_MatchInfo from '../../blocks/generated/class_hal.MatchInfo.js';
import * as hal_PowerDistributionFaults from '../../blocks/generated/class_hal.PowerDistributionFaults.js';
import * as hal_PowerDistributionStickyFaults from '../../blocks/generated/class_hal.PowerDistributionStickyFaults.js';
import * as hal_PowerDistributionVersion from '../../blocks/generated/class_hal.PowerDistributionVersion.js';
import * as hal_REVPHCompressorConfig from '../../blocks/generated/class_hal.REVPHCompressorConfig.js';
import * as hal_REVPHFaults from '../../blocks/generated/class_hal.REVPHFaults.js';
import * as hal_REVPHStickyFaults from '../../blocks/generated/class_hal.REVPHStickyFaults.js';
import * as hal_REVPHVersion from '../../blocks/generated/class_hal.REVPHVersion.js';
import * as hal_SimBoolean from '../../blocks/generated/class_hal.SimBoolean.js';
import * as hal_SimDevice from '../../blocks/generated/class_hal.SimDevice.js';
import * as hal_SimDouble from '../../blocks/generated/class_hal.SimDouble.js';
import * as hal_SimEnum from '../../blocks/generated/class_hal.SimEnum.js';
import * as hal_SimInt from '../../blocks/generated/class_hal.SimInt.js';
import * as hal_SimLong from '../../blocks/generated/class_hal.SimLong.js';
import * as hal_SimValue from '../../blocks/generated/class_hal.SimValue.js';
import * as hal_Value from '../../blocks/generated/class_hal.Value.js';
import * as hal_simulation from '../../blocks/generated/module_hal.simulation.js';
import * as hal_simulation_NotifierInfo from '../../blocks/generated/class_hal.simulation.NotifierInfo.js';
import * as hal_simulation_SimCB from '../../blocks/generated/class_hal.simulation.SimCB.js';
import * as hal_simulation_SimValueCB from '../../blocks/generated/class_hal.simulation.SimValueCB.js';
import * as wpilib from '../../blocks/generated/module_wpilib.js';
import * as wpilib_ADIS16448_IMU from '../../blocks/generated/class_wpilib.ADIS16448_IMU.js';
import * as wpilib_ADIS16470_IMU from '../../blocks/generated/class_wpilib.ADIS16470_IMU.js';
import * as wpilib_ADXL345_I2C from '../../blocks/generated/class_wpilib.ADXL345_I2C.js';
import * as wpilib_ADXL345_I2C_AllAxes from '../../blocks/generated/class_wpilib.ADXL345_I2C.AllAxes.js';
import * as wpilib_ADXL345_SPI from '../../blocks/generated/class_wpilib.ADXL345_SPI.js';
import * as wpilib_ADXL345_SPI_AllAxes from '../../blocks/generated/class_wpilib.ADXL345_SPI.AllAxes.js';
import * as wpilib_ADXL362 from '../../blocks/generated/class_wpilib.ADXL362.js';
import * as wpilib_ADXL362_AllAxes from '../../blocks/generated/class_wpilib.ADXL362.AllAxes.js';
import * as wpilib_ADXRS450_Gyro from '../../blocks/generated/class_wpilib.ADXRS450_Gyro.js';
import * as wpilib_AddressableLED from '../../blocks/generated/class_wpilib.AddressableLED.js';
import * as wpilib_AddressableLED_LEDData from '../../blocks/generated/class_wpilib.AddressableLED.LEDData.js';
import * as wpilib_AnalogAccelerometer from '../../blocks/generated/class_wpilib.AnalogAccelerometer.js';
import * as wpilib_AnalogEncoder from '../../blocks/generated/class_wpilib.AnalogEncoder.js';
import * as wpilib_AnalogGyro from '../../blocks/generated/class_wpilib.AnalogGyro.js';
import * as wpilib_AnalogInput from '../../blocks/generated/class_wpilib.AnalogInput.js';
import * as wpilib_AnalogOutput from '../../blocks/generated/class_wpilib.AnalogOutput.js';
import * as wpilib_AnalogPotentiometer from '../../blocks/generated/class_wpilib.AnalogPotentiometer.js';
import * as wpilib_AnalogTrigger from '../../blocks/generated/class_wpilib.AnalogTrigger.js';
import * as wpilib_AnalogTriggerOutput from '../../blocks/generated/class_wpilib.AnalogTriggerOutput.js';
import * as wpilib_BuiltInAccelerometer from '../../blocks/generated/class_wpilib.BuiltInAccelerometer.js';
import * as wpilib_CAN from '../../blocks/generated/class_wpilib.CAN.js';
import * as wpilib_CANData from '../../blocks/generated/class_wpilib.CANData.js';
import * as wpilib_CANStatus from '../../blocks/generated/class_wpilib.CANStatus.js';
import * as wpilib_Color from '../../blocks/generated/class_wpilib.Color.js';
import * as wpilib_Color8Bit from '../../blocks/generated/class_wpilib.Color8Bit.js';
import * as wpilib_Compressor from '../../blocks/generated/class_wpilib.Compressor.js';
import * as wpilib_Counter from '../../blocks/generated/class_wpilib.Counter.js';
import * as wpilib_DMC60 from '../../blocks/generated/class_wpilib.DMC60.js';
import * as wpilib_DSControlWord from '../../blocks/generated/class_wpilib.DSControlWord.js';
import * as wpilib_DataLogManager from '../../blocks/generated/class_wpilib.DataLogManager.js';
import * as wpilib_DigitalGlitchFilter from '../../blocks/generated/class_wpilib.DigitalGlitchFilter.js';
import * as wpilib_DigitalInput from '../../blocks/generated/class_wpilib.DigitalInput.js';
import * as wpilib_DigitalOutput from '../../blocks/generated/class_wpilib.DigitalOutput.js';
import * as wpilib_DigitalSource from '../../blocks/generated/class_wpilib.DigitalSource.js';
import * as wpilib_DoubleSolenoid from '../../blocks/generated/class_wpilib.DoubleSolenoid.js';
import * as wpilib_DriverStation from '../../blocks/generated/class_wpilib.DriverStation.js';
import * as wpilib_DutyCycle from '../../blocks/generated/class_wpilib.DutyCycle.js';
import * as wpilib_DutyCycleEncoder from '../../blocks/generated/class_wpilib.DutyCycleEncoder.js';
import * as wpilib_Encoder from '../../blocks/generated/class_wpilib.Encoder.js';
import * as wpilib_Field2d from '../../blocks/generated/class_wpilib.Field2d.js';
import * as wpilib_FieldObject2d from '../../blocks/generated/class_wpilib.FieldObject2d.js';
import * as wpilib_I2C from '../../blocks/generated/class_wpilib.I2C.js';
import * as wpilib_IterativeRobotBase from '../../blocks/generated/class_wpilib.IterativeRobotBase.js';
import * as wpilib_Jaguar from '../../blocks/generated/class_wpilib.Jaguar.js';
import * as wpilib_Joystick from '../../blocks/generated/class_wpilib.Joystick.js';
import * as wpilib_LiveWindow from '../../blocks/generated/class_wpilib.LiveWindow.js';
import * as wpilib_Mechanism2d from '../../blocks/generated/class_wpilib.Mechanism2d.js';
import * as wpilib_MechanismLigament2d from '../../blocks/generated/class_wpilib.MechanismLigament2d.js';
import * as wpilib_MechanismObject2d from '../../blocks/generated/class_wpilib.MechanismObject2d.js';
import * as wpilib_MechanismRoot2d from '../../blocks/generated/class_wpilib.MechanismRoot2d.js';
import * as wpilib_MotorControllerGroup from '../../blocks/generated/class_wpilib.MotorControllerGroup.js';
import * as wpilib_MotorSafety from '../../blocks/generated/class_wpilib.MotorSafety.js';
import * as wpilib_NidecBrushless from '../../blocks/generated/class_wpilib.NidecBrushless.js';
import * as wpilib_Notifier from '../../blocks/generated/class_wpilib.Notifier.js';
import * as wpilib_PS4Controller from '../../blocks/generated/class_wpilib.PS4Controller.js';
import * as wpilib_PS4Controller_Axis from '../../blocks/generated/class_wpilib.PS4Controller.Axis.js';
import * as wpilib_PS4Controller_Button from '../../blocks/generated/class_wpilib.PS4Controller.Button.js';
import * as wpilib_PS5Controller from '../../blocks/generated/class_wpilib.PS5Controller.js';
import * as wpilib_PS5Controller_Axis from '../../blocks/generated/class_wpilib.PS5Controller.Axis.js';
import * as wpilib_PS5Controller_Button from '../../blocks/generated/class_wpilib.PS5Controller.Button.js';
import * as wpilib_PWM from '../../blocks/generated/class_wpilib.PWM.js';
import * as wpilib_PWMMotorController from '../../blocks/generated/class_wpilib.PWMMotorController.js';
import * as wpilib_PWMSparkFlex from '../../blocks/generated/class_wpilib.PWMSparkFlex.js';
import * as wpilib_PWMSparkMax from '../../blocks/generated/class_wpilib.PWMSparkMax.js';
import * as wpilib_PWMTalonFX from '../../blocks/generated/class_wpilib.PWMTalonFX.js';
import * as wpilib_PWMTalonSRX from '../../blocks/generated/class_wpilib.PWMTalonSRX.js';
import * as wpilib_PWMVenom from '../../blocks/generated/class_wpilib.PWMVenom.js';
import * as wpilib_PWMVictorSPX from '../../blocks/generated/class_wpilib.PWMVictorSPX.js';
import * as wpilib_PneumaticHub from '../../blocks/generated/class_wpilib.PneumaticHub.js';
import * as wpilib_PneumaticHub_Faults from '../../blocks/generated/class_wpilib.PneumaticHub.Faults.js';
import * as wpilib_PneumaticHub_StickyFaults from '../../blocks/generated/class_wpilib.PneumaticHub.StickyFaults.js';
import * as wpilib_PneumaticHub_Version from '../../blocks/generated/class_wpilib.PneumaticHub.Version.js';
import * as wpilib_PneumaticsBase from '../../blocks/generated/class_wpilib.PneumaticsBase.js';
import * as wpilib_PneumaticsControlModule from '../../blocks/generated/class_wpilib.PneumaticsControlModule.js';
import * as wpilib_PowerDistribution from '../../blocks/generated/class_wpilib.PowerDistribution.js';
import * as wpilib_PowerDistribution_Faults from '../../blocks/generated/class_wpilib.PowerDistribution.Faults.js';
import * as wpilib_PowerDistribution_StickyFaults from '../../blocks/generated/class_wpilib.PowerDistribution.StickyFaults.js';
import * as wpilib_PowerDistribution_Version from '../../blocks/generated/class_wpilib.PowerDistribution.Version.js';
import * as wpilib_Preferences from '../../blocks/generated/class_wpilib.Preferences.js';
import * as wpilib_Relay from '../../blocks/generated/class_wpilib.Relay.js';
import * as wpilib_RobotBase from '../../blocks/generated/class_wpilib.RobotBase.js';
import * as wpilib_RobotController from '../../blocks/generated/class_wpilib.RobotController.js';
import * as wpilib_RobotState from '../../blocks/generated/class_wpilib.RobotState.js';
import * as wpilib_SD540 from '../../blocks/generated/class_wpilib.SD540.js';
import * as wpilib_SPI from '../../blocks/generated/class_wpilib.SPI.js';
import * as wpilib_SendableBuilderImpl from '../../blocks/generated/class_wpilib.SendableBuilderImpl.js';
import * as wpilib_SendableChooser from '../../blocks/generated/class_wpilib.SendableChooser.js';
import * as wpilib_SendableChooserBase from '../../blocks/generated/class_wpilib.SendableChooserBase.js';
import * as wpilib_SensorUtil from '../../blocks/generated/class_wpilib.SensorUtil.js';
import * as wpilib_SerialPort from '../../blocks/generated/class_wpilib.SerialPort.js';
import * as wpilib_Servo from '../../blocks/generated/class_wpilib.Servo.js';
import * as wpilib_SmartDashboard from '../../blocks/generated/class_wpilib.SmartDashboard.js';
import * as wpilib_Solenoid from '../../blocks/generated/class_wpilib.Solenoid.js';
import * as wpilib_Spark from '../../blocks/generated/class_wpilib.Spark.js';
import * as wpilib_StadiaController from '../../blocks/generated/class_wpilib.StadiaController.js';
import * as wpilib_StadiaController_Axis from '../../blocks/generated/class_wpilib.StadiaController.Axis.js';
import * as wpilib_StadiaController_Button from '../../blocks/generated/class_wpilib.StadiaController.Button.js';
import * as wpilib_SynchronousInterrupt from '../../blocks/generated/class_wpilib.SynchronousInterrupt.js';
import * as wpilib_Talon from '../../blocks/generated/class_wpilib.Talon.js';
import * as wpilib_TimedRobot from '../../blocks/generated/class_wpilib.TimedRobot.js';
import * as wpilib_Timer from '../../blocks/generated/class_wpilib.Timer.js';
import * as wpilib_TimesliceRobot from '../../blocks/generated/class_wpilib.TimesliceRobot.js';
import * as wpilib_Tracer from '../../blocks/generated/class_wpilib.Tracer.js';
import * as wpilib_Ultrasonic from '../../blocks/generated/class_wpilib.Ultrasonic.js';
import * as wpilib_Victor from '../../blocks/generated/class_wpilib.Victor.js';
import * as wpilib_VictorSP from '../../blocks/generated/class_wpilib.VictorSP.js';
import * as wpilib_Watchdog from '../../blocks/generated/class_wpilib.Watchdog.js';
import * as wpilib_XboxController from '../../blocks/generated/class_wpilib.XboxController.js';
import * as wpilib_XboxController_Axis from '../../blocks/generated/class_wpilib.XboxController.Axis.js';
import * as wpilib_XboxController_Button from '../../blocks/generated/class_wpilib.XboxController.Button.js';
import * as wpilib_counter from '../../blocks/generated/module_wpilib.counter.js';
import * as wpilib_counter_ExternalDirectionCounter from '../../blocks/generated/class_wpilib.counter.ExternalDirectionCounter.js';
import * as wpilib_counter_Tachometer from '../../blocks/generated/class_wpilib.counter.Tachometer.js';
import * as wpilib_counter_UpDownCounter from '../../blocks/generated/class_wpilib.counter.UpDownCounter.js';
import * as wpilib_drive_DifferentialDrive from '../../blocks/generated/class_wpilib.drive.DifferentialDrive.js';
import * as wpilib_drive_DifferentialDrive_WheelSpeeds from '../../blocks/generated/class_wpilib.drive.DifferentialDrive.WheelSpeeds.js';
import * as wpilib_drive_MecanumDrive from '../../blocks/generated/class_wpilib.drive.MecanumDrive.js';
import * as wpilib_drive_MecanumDrive_WheelSpeeds from '../../blocks/generated/class_wpilib.drive.MecanumDrive.WheelSpeeds.js';
import * as wpilib_drive_RobotDriveBase from '../../blocks/generated/class_wpilib.drive.RobotDriveBase.js';
import * as wpilib_event_BooleanEvent from '../../blocks/generated/class_wpilib.event.BooleanEvent.js';
import * as wpilib_event_EventLoop from '../../blocks/generated/class_wpilib.event.EventLoop.js';
import * as wpilib_event_NetworkBooleanEvent from '../../blocks/generated/class_wpilib.event.NetworkBooleanEvent.js';
import * as wpilib_interfaces_Accelerometer from '../../blocks/generated/class_wpilib.interfaces.Accelerometer.js';
import * as wpilib_interfaces_CounterBase from '../../blocks/generated/class_wpilib.interfaces.CounterBase.js';
import * as wpilib_interfaces_GenericHID from '../../blocks/generated/class_wpilib.interfaces.GenericHID.js';
import * as wpilib_interfaces_Gyro from '../../blocks/generated/class_wpilib.interfaces.Gyro.js';
import * as wpilib_interfaces_MotorController from '../../blocks/generated/class_wpilib.interfaces.MotorController.js';
import * as wpilib_shuffleboard from '../../blocks/generated/module_wpilib.shuffleboard.js';
import * as wpilib_shuffleboard_ComplexWidget from '../../blocks/generated/class_wpilib.shuffleboard.ComplexWidget.js';
import * as wpilib_shuffleboard_LayoutType from '../../blocks/generated/class_wpilib.shuffleboard.LayoutType.js';
import * as wpilib_shuffleboard_Shuffleboard from '../../blocks/generated/class_wpilib.shuffleboard.Shuffleboard.js';
import * as wpilib_shuffleboard_ShuffleboardComponentBase from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardComponentBase.js';
import * as wpilib_shuffleboard_ShuffleboardContainer from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardContainer.js';
import * as wpilib_shuffleboard_ShuffleboardLayout from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardLayout.js';
import * as wpilib_shuffleboard_ShuffleboardTab from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardTab.js';
import * as wpilib_shuffleboard_ShuffleboardValue from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardValue.js';
import * as wpilib_shuffleboard_SimpleWidget from '../../blocks/generated/class_wpilib.shuffleboard.SimpleWidget.js';
import * as wpilib_shuffleboard_SuppliedBoolListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedBoolListValueWidget.js';
import * as wpilib_shuffleboard_SuppliedBoolValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedBoolValueWidget.js';
import * as wpilib_shuffleboard_SuppliedDoubleListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedDoubleListValueWidget.js';
import * as wpilib_shuffleboard_SuppliedDoubleValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedDoubleValueWidget.js';
import * as wpilib_shuffleboard_SuppliedFloatListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedFloatListValueWidget.js';
import * as wpilib_shuffleboard_SuppliedFloatValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedFloatValueWidget.js';
import * as wpilib_shuffleboard_SuppliedIntListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedIntListValueWidget.js';
import * as wpilib_shuffleboard_SuppliedIntegerValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedIntegerValueWidget.js';
import * as wpilib_shuffleboard_SuppliedRawValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedRawValueWidget.js';
import * as wpilib_shuffleboard_SuppliedStringListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedStringListValueWidget.js';
import * as wpilib_shuffleboard_SuppliedStringValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedStringValueWidget.js';
import * as wpilib_shuffleboard_WidgetType from '../../blocks/generated/class_wpilib.shuffleboard.WidgetType.js';
import * as wpilib_shuffleboard__ComplexComponent from '../../blocks/generated/class_wpilib.shuffleboard._ComplexComponent.js';
import * as wpilib_shuffleboard__ComplexWidget from '../../blocks/generated/class_wpilib.shuffleboard._ComplexWidget.js';
import * as wpilib_shuffleboard__LayoutComponent from '../../blocks/generated/class_wpilib.shuffleboard._LayoutComponent.js';
import * as wpilib_shuffleboard__SimpleComponent from '../../blocks/generated/class_wpilib.shuffleboard._SimpleComponent.js';
import * as wpilib_shuffleboard__SimpleWidget from '../../blocks/generated/class_wpilib.shuffleboard._SimpleWidget.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_bool from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_bool.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_double from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_double.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_float from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_float.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_integer from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_integer.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_string from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_string.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_bool from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_bool.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_double from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_double.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_float from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_float.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_int from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_int.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_raw from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_raw.js';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_string from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_string.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_bool from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_bool.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_double from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_double.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_float from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_float.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_integer from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_integer.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_string from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_string.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_bool from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_bool.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_double from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_double.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_float from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_float.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_int from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_int.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_raw from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_raw.js';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_string from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_string.js';
import * as wpilib_simulation from '../../blocks/generated/module_wpilib.simulation.js';
import * as wpilib_simulation_ADIS16448_IMUSim from '../../blocks/generated/class_wpilib.simulation.ADIS16448_IMUSim.js';
import * as wpilib_simulation_ADIS16470_IMUSim from '../../blocks/generated/class_wpilib.simulation.ADIS16470_IMUSim.js';
import * as wpilib_simulation_ADXL345Sim from '../../blocks/generated/class_wpilib.simulation.ADXL345Sim.js';
import * as wpilib_simulation_ADXL362Sim from '../../blocks/generated/class_wpilib.simulation.ADXL362Sim.js';
import * as wpilib_simulation_ADXRS450_GyroSim from '../../blocks/generated/class_wpilib.simulation.ADXRS450_GyroSim.js';
import * as wpilib_simulation_AddressableLEDSim from '../../blocks/generated/class_wpilib.simulation.AddressableLEDSim.js';
import * as wpilib_simulation_AnalogEncoderSim from '../../blocks/generated/class_wpilib.simulation.AnalogEncoderSim.js';
import * as wpilib_simulation_AnalogGyroSim from '../../blocks/generated/class_wpilib.simulation.AnalogGyroSim.js';
import * as wpilib_simulation_AnalogInputSim from '../../blocks/generated/class_wpilib.simulation.AnalogInputSim.js';
import * as wpilib_simulation_AnalogOutputSim from '../../blocks/generated/class_wpilib.simulation.AnalogOutputSim.js';
import * as wpilib_simulation_AnalogTriggerSim from '../../blocks/generated/class_wpilib.simulation.AnalogTriggerSim.js';
import * as wpilib_simulation_BatterySim from '../../blocks/generated/class_wpilib.simulation.BatterySim.js';
import * as wpilib_simulation_BuiltInAccelerometerSim from '../../blocks/generated/class_wpilib.simulation.BuiltInAccelerometerSim.js';
import * as wpilib_simulation_CTREPCMSim from '../../blocks/generated/class_wpilib.simulation.CTREPCMSim.js';
import * as wpilib_simulation_CallbackStore from '../../blocks/generated/class_wpilib.simulation.CallbackStore.js';
import * as wpilib_simulation_DCMotorSim from '../../blocks/generated/class_wpilib.simulation.DCMotorSim.js';
import * as wpilib_simulation_DIOSim from '../../blocks/generated/class_wpilib.simulation.DIOSim.js';
import * as wpilib_simulation_DifferentialDrivetrainSim from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim.js';
import * as wpilib_simulation_DifferentialDrivetrainSim_KitbotGearing from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing.js';
import * as wpilib_simulation_DifferentialDrivetrainSim_KitbotMotor from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor.js';
import * as wpilib_simulation_DifferentialDrivetrainSim_KitbotWheelSize from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize.js';
import * as wpilib_simulation_DifferentialDrivetrainSim_State from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim.State.js';
import * as wpilib_simulation_DigitalPWMSim from '../../blocks/generated/class_wpilib.simulation.DigitalPWMSim.js';
import * as wpilib_simulation_DoubleSolenoidSim from '../../blocks/generated/class_wpilib.simulation.DoubleSolenoidSim.js';
import * as wpilib_simulation_DriverStationSim from '../../blocks/generated/class_wpilib.simulation.DriverStationSim.js';
import * as wpilib_simulation_DutyCycleEncoderSim from '../../blocks/generated/class_wpilib.simulation.DutyCycleEncoderSim.js';
import * as wpilib_simulation_DutyCycleSim from '../../blocks/generated/class_wpilib.simulation.DutyCycleSim.js';
import * as wpilib_simulation_ElevatorSim from '../../blocks/generated/class_wpilib.simulation.ElevatorSim.js';
import * as wpilib_simulation_EncoderSim from '../../blocks/generated/class_wpilib.simulation.EncoderSim.js';
import * as wpilib_simulation_FlywheelSim from '../../blocks/generated/class_wpilib.simulation.FlywheelSim.js';
import * as wpilib_simulation_GenericHIDSim from '../../blocks/generated/class_wpilib.simulation.GenericHIDSim.js';
import * as wpilib_simulation_JoystickSim from '../../blocks/generated/class_wpilib.simulation.JoystickSim.js';
import * as wpilib_simulation_LinearSystemSim_1_1_1 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_1_1_1.js';
import * as wpilib_simulation_LinearSystemSim_1_1_2 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_1_1_2.js';
import * as wpilib_simulation_LinearSystemSim_2_1_1 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_2_1_1.js';
import * as wpilib_simulation_LinearSystemSim_2_1_2 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_2_1_2.js';
import * as wpilib_simulation_LinearSystemSim_2_2_1 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_2_2_1.js';
import * as wpilib_simulation_LinearSystemSim_2_2_2 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_2_2_2.js';
import * as wpilib_simulation_PS4ControllerSim from '../../blocks/generated/class_wpilib.simulation.PS4ControllerSim.js';
import * as wpilib_simulation_PS5ControllerSim from '../../blocks/generated/class_wpilib.simulation.PS5ControllerSim.js';
import * as wpilib_simulation_PWMSim from '../../blocks/generated/class_wpilib.simulation.PWMSim.js';
import * as wpilib_simulation_PneumaticsBaseSim from '../../blocks/generated/class_wpilib.simulation.PneumaticsBaseSim.js';
import * as wpilib_simulation_PowerDistributionSim from '../../blocks/generated/class_wpilib.simulation.PowerDistributionSim.js';
import * as wpilib_simulation_REVPHSim from '../../blocks/generated/class_wpilib.simulation.REVPHSim.js';
import * as wpilib_simulation_RelaySim from '../../blocks/generated/class_wpilib.simulation.RelaySim.js';
import * as wpilib_simulation_RoboRioSim from '../../blocks/generated/class_wpilib.simulation.RoboRioSim.js';
import * as wpilib_simulation_SPIAccelerometerSim from '../../blocks/generated/class_wpilib.simulation.SPIAccelerometerSim.js';
import * as wpilib_simulation_SimDeviceSim from '../../blocks/generated/class_wpilib.simulation.SimDeviceSim.js';
import * as wpilib_simulation_SingleJointedArmSim from '../../blocks/generated/class_wpilib.simulation.SingleJointedArmSim.js';
import * as wpilib_simulation_SolenoidSim from '../../blocks/generated/class_wpilib.simulation.SolenoidSim.js';
import * as wpilib_simulation_UltrasonicSim from '../../blocks/generated/class_wpilib.simulation.UltrasonicSim.js';
import * as wpilib_simulation_XboxControllerSim from '../../blocks/generated/class_wpilib.simulation.XboxControllerSim.js';
import * as wpilib_sysid_SysIdRoutineLog from '../../blocks/generated/class_wpilib.sysid.SysIdRoutineLog.js';
import * as wpilib_sysid_SysIdRoutineLog_MotorLog from '../../blocks/generated/class_wpilib.sysid.SysIdRoutineLog.MotorLog.js';
import * as wpimath from '../../blocks/generated/module_wpimath.js';
import * as wpimath_controller_ArmFeedforward from '../../blocks/generated/class_wpimath.controller.ArmFeedforward.js';
import * as wpimath_controller_BangBangController from '../../blocks/generated/class_wpimath.controller.BangBangController.js';
import * as wpimath_controller_ControlAffinePlantInversionFeedforward_1_1 from '../../blocks/generated/class_wpimath.controller.ControlAffinePlantInversionFeedforward_1_1.js';
import * as wpimath_controller_ControlAffinePlantInversionFeedforward_2_1 from '../../blocks/generated/class_wpimath.controller.ControlAffinePlantInversionFeedforward_2_1.js';
import * as wpimath_controller_ControlAffinePlantInversionFeedforward_2_2 from '../../blocks/generated/class_wpimath.controller.ControlAffinePlantInversionFeedforward_2_2.js';
import * as wpimath_controller_DifferentialDriveAccelerationLimiter from '../../blocks/generated/class_wpimath.controller.DifferentialDriveAccelerationLimiter.js';
import * as wpimath_controller_DifferentialDriveWheelVoltages from '../../blocks/generated/class_wpimath.controller.DifferentialDriveWheelVoltages.js';
import * as wpimath_controller_ElevatorFeedforward from '../../blocks/generated/class_wpimath.controller.ElevatorFeedforward.js';
import * as wpimath_controller_HolonomicDriveController from '../../blocks/generated/class_wpimath.controller.HolonomicDriveController.js';
import * as wpimath_controller_ImplicitModelFollower_1_1 from '../../blocks/generated/class_wpimath.controller.ImplicitModelFollower_1_1.js';
import * as wpimath_controller_ImplicitModelFollower_2_1 from '../../blocks/generated/class_wpimath.controller.ImplicitModelFollower_2_1.js';
import * as wpimath_controller_ImplicitModelFollower_2_2 from '../../blocks/generated/class_wpimath.controller.ImplicitModelFollower_2_2.js';
import * as wpimath_controller_LTVDifferentialDriveController from '../../blocks/generated/class_wpimath.controller.LTVDifferentialDriveController.js';
import * as wpimath_controller_LTVUnicycleController from '../../blocks/generated/class_wpimath.controller.LTVUnicycleController.js';
import * as wpimath_controller_LinearPlantInversionFeedforward_1_1 from '../../blocks/generated/class_wpimath.controller.LinearPlantInversionFeedforward_1_1.js';
import * as wpimath_controller_LinearPlantInversionFeedforward_2_1 from '../../blocks/generated/class_wpimath.controller.LinearPlantInversionFeedforward_2_1.js';
import * as wpimath_controller_LinearPlantInversionFeedforward_2_2 from '../../blocks/generated/class_wpimath.controller.LinearPlantInversionFeedforward_2_2.js';
import * as wpimath_controller_LinearPlantInversionFeedforward_3_2 from '../../blocks/generated/class_wpimath.controller.LinearPlantInversionFeedforward_3_2.js';
import * as wpimath_controller_LinearQuadraticRegulator_1_1 from '../../blocks/generated/class_wpimath.controller.LinearQuadraticRegulator_1_1.js';
import * as wpimath_controller_LinearQuadraticRegulator_2_1 from '../../blocks/generated/class_wpimath.controller.LinearQuadraticRegulator_2_1.js';
import * as wpimath_controller_LinearQuadraticRegulator_2_2 from '../../blocks/generated/class_wpimath.controller.LinearQuadraticRegulator_2_2.js';
import * as wpimath_controller_LinearQuadraticRegulator_3_2 from '../../blocks/generated/class_wpimath.controller.LinearQuadraticRegulator_3_2.js';
import * as wpimath_controller_PIDController from '../../blocks/generated/class_wpimath.controller.PIDController.js';
import * as wpimath_controller_ProfiledPIDController from '../../blocks/generated/class_wpimath.controller.ProfiledPIDController.js';
import * as wpimath_controller_ProfiledPIDControllerRadians from '../../blocks/generated/class_wpimath.controller.ProfiledPIDControllerRadians.js';
import * as wpimath_controller_RamseteController from '../../blocks/generated/class_wpimath.controller.RamseteController.js';
import * as wpimath_controller_SimpleMotorFeedforwardMeters from '../../blocks/generated/class_wpimath.controller.SimpleMotorFeedforwardMeters.js';
import * as wpimath_controller_SimpleMotorFeedforwardRadians from '../../blocks/generated/class_wpimath.controller.SimpleMotorFeedforwardRadians.js';
import * as wpimath_estimator_DifferentialDrivePoseEstimator from '../../blocks/generated/class_wpimath.estimator.DifferentialDrivePoseEstimator.js';
import * as wpimath_estimator_DifferentialDrivePoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.DifferentialDrivePoseEstimatorBase.js';
import * as wpimath_estimator_ExtendedKalmanFilter_1_1_1 from '../../blocks/generated/class_wpimath.estimator.ExtendedKalmanFilter_1_1_1.js';
import * as wpimath_estimator_ExtendedKalmanFilter_2_1_1 from '../../blocks/generated/class_wpimath.estimator.ExtendedKalmanFilter_2_1_1.js';
import * as wpimath_estimator_ExtendedKalmanFilter_2_2_2 from '../../blocks/generated/class_wpimath.estimator.ExtendedKalmanFilter_2_2_2.js';
import * as wpimath_estimator_KalmanFilter_1_1_1 from '../../blocks/generated/class_wpimath.estimator.KalmanFilter_1_1_1.js';
import * as wpimath_estimator_KalmanFilter_2_1_1 from '../../blocks/generated/class_wpimath.estimator.KalmanFilter_2_1_1.js';
import * as wpimath_estimator_KalmanFilter_2_2_2 from '../../blocks/generated/class_wpimath.estimator.KalmanFilter_2_2_2.js';
import * as wpimath_estimator_KalmanFilter_3_2_3 from '../../blocks/generated/class_wpimath.estimator.KalmanFilter_3_2_3.js';
import * as wpimath_estimator_MecanumDrivePoseEstimator from '../../blocks/generated/class_wpimath.estimator.MecanumDrivePoseEstimator.js';
import * as wpimath_estimator_MecanumDrivePoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.MecanumDrivePoseEstimatorBase.js';
import * as wpimath_estimator_SwerveDrive2PoseEstimator from '../../blocks/generated/class_wpimath.estimator.SwerveDrive2PoseEstimator.js';
import * as wpimath_estimator_SwerveDrive2PoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive2PoseEstimatorBase.js';
import * as wpimath_estimator_SwerveDrive3PoseEstimator from '../../blocks/generated/class_wpimath.estimator.SwerveDrive3PoseEstimator.js';
import * as wpimath_estimator_SwerveDrive3PoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive3PoseEstimatorBase.js';
import * as wpimath_estimator_SwerveDrive4PoseEstimator from '../../blocks/generated/class_wpimath.estimator.SwerveDrive4PoseEstimator.js';
import * as wpimath_estimator_SwerveDrive4PoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive4PoseEstimatorBase.js';
import * as wpimath_estimator_SwerveDrive6PoseEstimator from '../../blocks/generated/class_wpimath.estimator.SwerveDrive6PoseEstimator.js';
import * as wpimath_estimator_SwerveDrive6PoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive6PoseEstimatorBase.js';
import * as wpimath_filter_Debouncer from '../../blocks/generated/class_wpimath.filter.Debouncer.js';
import * as wpimath_filter_LinearFilter from '../../blocks/generated/class_wpimath.filter.LinearFilter.js';
import * as wpimath_filter_MedianFilter from '../../blocks/generated/class_wpimath.filter.MedianFilter.js';
import * as wpimath_filter_SlewRateLimiter from '../../blocks/generated/class_wpimath.filter.SlewRateLimiter.js';
import * as wpimath_geometry_CoordinateAxis from '../../blocks/generated/class_wpimath.geometry.CoordinateAxis.js';
import * as wpimath_geometry_CoordinateSystem from '../../blocks/generated/class_wpimath.geometry.CoordinateSystem.js';
import * as wpimath_geometry_Pose2d from '../../blocks/generated/class_wpimath.geometry.Pose2d.js';
import * as wpimath_geometry_Pose3d from '../../blocks/generated/class_wpimath.geometry.Pose3d.js';
import * as wpimath_geometry_Quaternion from '../../blocks/generated/class_wpimath.geometry.Quaternion.js';
import * as wpimath_geometry_Rotation2d from '../../blocks/generated/class_wpimath.geometry.Rotation2d.js';
import * as wpimath_geometry_Rotation3d from '../../blocks/generated/class_wpimath.geometry.Rotation3d.js';
import * as wpimath_geometry_Transform2d from '../../blocks/generated/class_wpimath.geometry.Transform2d.js';
import * as wpimath_geometry_Transform3d from '../../blocks/generated/class_wpimath.geometry.Transform3d.js';
import * as wpimath_geometry_Translation2d from '../../blocks/generated/class_wpimath.geometry.Translation2d.js';
import * as wpimath_geometry_Translation3d from '../../blocks/generated/class_wpimath.geometry.Translation3d.js';
import * as wpimath_geometry_Twist2d from '../../blocks/generated/class_wpimath.geometry.Twist2d.js';
import * as wpimath_geometry_Twist3d from '../../blocks/generated/class_wpimath.geometry.Twist3d.js';
import * as wpimath_interpolation_TimeInterpolatableFloatBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableFloatBuffer.js';
import * as wpimath_interpolation_TimeInterpolatablePose2dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatablePose2dBuffer.js';
import * as wpimath_interpolation_TimeInterpolatablePose3dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatablePose3dBuffer.js';
import * as wpimath_interpolation_TimeInterpolatableRotation2dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableRotation2dBuffer.js';
import * as wpimath_interpolation_TimeInterpolatableRotation3dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableRotation3dBuffer.js';
import * as wpimath_interpolation_TimeInterpolatableTranslation2dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableTranslation2dBuffer.js';
import * as wpimath_interpolation_TimeInterpolatableTranslation3dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableTranslation3dBuffer.js';
import * as wpimath_kinematics_ChassisSpeeds from '../../blocks/generated/class_wpimath.kinematics.ChassisSpeeds.js';
import * as wpimath_kinematics_DifferentialDriveKinematics from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveKinematics.js';
import * as wpimath_kinematics_DifferentialDriveKinematicsBase from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveKinematicsBase.js';
import * as wpimath_kinematics_DifferentialDriveOdometry from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveOdometry.js';
import * as wpimath_kinematics_DifferentialDriveOdometryBase from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveOdometryBase.js';
import * as wpimath_kinematics_DifferentialDriveWheelPositions from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveWheelPositions.js';
import * as wpimath_kinematics_DifferentialDriveWheelSpeeds from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveWheelSpeeds.js';
import * as wpimath_kinematics_MecanumDriveKinematics from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveKinematics.js';
import * as wpimath_kinematics_MecanumDriveKinematicsBase from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveKinematicsBase.js';
import * as wpimath_kinematics_MecanumDriveOdometry from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveOdometry.js';
import * as wpimath_kinematics_MecanumDriveOdometryBase from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveOdometryBase.js';
import * as wpimath_kinematics_MecanumDriveWheelPositions from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveWheelPositions.js';
import * as wpimath_kinematics_MecanumDriveWheelSpeeds from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveWheelSpeeds.js';
import * as wpimath_kinematics_SwerveDrive2Kinematics from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2Kinematics.js';
import * as wpimath_kinematics_SwerveDrive2KinematicsBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2KinematicsBase.js';
import * as wpimath_kinematics_SwerveDrive2Odometry from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2Odometry.js';
import * as wpimath_kinematics_SwerveDrive2OdometryBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2OdometryBase.js';
import * as wpimath_kinematics_SwerveDrive2WheelPositions from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2WheelPositions.js';
import * as wpimath_kinematics_SwerveDrive3Kinematics from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3Kinematics.js';
import * as wpimath_kinematics_SwerveDrive3KinematicsBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3KinematicsBase.js';
import * as wpimath_kinematics_SwerveDrive3Odometry from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3Odometry.js';
import * as wpimath_kinematics_SwerveDrive3OdometryBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3OdometryBase.js';
import * as wpimath_kinematics_SwerveDrive3WheelPositions from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3WheelPositions.js';
import * as wpimath_kinematics_SwerveDrive4Kinematics from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4Kinematics.js';
import * as wpimath_kinematics_SwerveDrive4KinematicsBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4KinematicsBase.js';
import * as wpimath_kinematics_SwerveDrive4Odometry from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4Odometry.js';
import * as wpimath_kinematics_SwerveDrive4OdometryBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4OdometryBase.js';
import * as wpimath_kinematics_SwerveDrive4WheelPositions from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4WheelPositions.js';
import * as wpimath_kinematics_SwerveDrive6Kinematics from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6Kinematics.js';
import * as wpimath_kinematics_SwerveDrive6KinematicsBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6KinematicsBase.js';
import * as wpimath_kinematics_SwerveDrive6Odometry from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6Odometry.js';
import * as wpimath_kinematics_SwerveDrive6OdometryBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6OdometryBase.js';
import * as wpimath_kinematics_SwerveDrive6WheelPositions from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6WheelPositions.js';
import * as wpimath_kinematics_SwerveModulePosition from '../../blocks/generated/class_wpimath.kinematics.SwerveModulePosition.js';
import * as wpimath_kinematics_SwerveModuleState from '../../blocks/generated/class_wpimath.kinematics.SwerveModuleState.js';
import * as wpimath_optimization_SimulatedAnnealing from '../../blocks/generated/class_wpimath.optimization.SimulatedAnnealing.js';
import * as wpimath_path_TravelingSalesman from '../../blocks/generated/class_wpimath.path.TravelingSalesman.js';
import * as wpimath_spline_CubicHermiteSpline from '../../blocks/generated/class_wpimath.spline.CubicHermiteSpline.js';
import * as wpimath_spline_QuinticHermiteSpline from '../../blocks/generated/class_wpimath.spline.QuinticHermiteSpline.js';
import * as wpimath_spline_Spline3 from '../../blocks/generated/class_wpimath.spline.Spline3.js';
import * as wpimath_spline_Spline3_ControlVector from '../../blocks/generated/class_wpimath.spline.Spline3.ControlVector.js';
import * as wpimath_spline_Spline5 from '../../blocks/generated/class_wpimath.spline.Spline5.js';
import * as wpimath_spline_Spline5_ControlVector from '../../blocks/generated/class_wpimath.spline.Spline5.ControlVector.js';
import * as wpimath_spline_SplineHelper from '../../blocks/generated/class_wpimath.spline.SplineHelper.js';
import * as wpimath_spline_SplineParameterizer from '../../blocks/generated/class_wpimath.spline.SplineParameterizer.js';
import * as wpimath_system_LinearSystemLoop_1_1_1 from '../../blocks/generated/class_wpimath.system.LinearSystemLoop_1_1_1.js';
import * as wpimath_system_LinearSystemLoop_2_1_1 from '../../blocks/generated/class_wpimath.system.LinearSystemLoop_2_1_1.js';
import * as wpimath_system_LinearSystemLoop_2_2_2 from '../../blocks/generated/class_wpimath.system.LinearSystemLoop_2_2_2.js';
import * as wpimath_system_LinearSystemLoop_3_2_3 from '../../blocks/generated/class_wpimath.system.LinearSystemLoop_3_2_3.js';
import * as wpimath_system_LinearSystem_1_1_1 from '../../blocks/generated/class_wpimath.system.LinearSystem_1_1_1.js';
import * as wpimath_system_LinearSystem_1_1_2 from '../../blocks/generated/class_wpimath.system.LinearSystem_1_1_2.js';
import * as wpimath_system_LinearSystem_1_1_3 from '../../blocks/generated/class_wpimath.system.LinearSystem_1_1_3.js';
import * as wpimath_system_LinearSystem_2_1_1 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_1_1.js';
import * as wpimath_system_LinearSystem_2_1_2 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_1_2.js';
import * as wpimath_system_LinearSystem_2_1_3 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_1_3.js';
import * as wpimath_system_LinearSystem_2_2_1 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_2_1.js';
import * as wpimath_system_LinearSystem_2_2_2 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_2_2.js';
import * as wpimath_system_LinearSystem_2_2_3 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_2_3.js';
import * as wpimath_system_LinearSystem_3_2_1 from '../../blocks/generated/class_wpimath.system.LinearSystem_3_2_1.js';
import * as wpimath_system_LinearSystem_3_2_2 from '../../blocks/generated/class_wpimath.system.LinearSystem_3_2_2.js';
import * as wpimath_system_LinearSystem_3_2_3 from '../../blocks/generated/class_wpimath.system.LinearSystem_3_2_3.js';
import * as wpimath_system_plant_DCMotor from '../../blocks/generated/class_wpimath.system.plant.DCMotor.js';
import * as wpimath_system_plant_LinearSystemId from '../../blocks/generated/class_wpimath.system.plant.LinearSystemId.js';
import * as wpimath_trajectory_ExponentialProfileMeterVolts from '../../blocks/generated/class_wpimath.trajectory.ExponentialProfileMeterVolts.js';
import * as wpimath_trajectory_ExponentialProfileMeterVolts_Constraints from '../../blocks/generated/class_wpimath.trajectory.ExponentialProfileMeterVolts.Constraints.js';
import * as wpimath_trajectory_ExponentialProfileMeterVolts_ProfileTiming from '../../blocks/generated/class_wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming.js';
import * as wpimath_trajectory_ExponentialProfileMeterVolts_State from '../../blocks/generated/class_wpimath.trajectory.ExponentialProfileMeterVolts.State.js';
import * as wpimath_trajectory_Trajectory from '../../blocks/generated/class_wpimath.trajectory.Trajectory.js';
import * as wpimath_trajectory_Trajectory_State from '../../blocks/generated/class_wpimath.trajectory.Trajectory.State.js';
import * as wpimath_trajectory_TrajectoryConfig from '../../blocks/generated/class_wpimath.trajectory.TrajectoryConfig.js';
import * as wpimath_trajectory_TrajectoryGenerator from '../../blocks/generated/class_wpimath.trajectory.TrajectoryGenerator.js';
import * as wpimath_trajectory_TrajectoryParameterizer from '../../blocks/generated/class_wpimath.trajectory.TrajectoryParameterizer.js';
import * as wpimath_trajectory_TrajectoryUtil from '../../blocks/generated/class_wpimath.trajectory.TrajectoryUtil.js';
import * as wpimath_trajectory_TrapezoidProfile from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfile.js';
import * as wpimath_trajectory_TrapezoidProfile_Constraints from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfile.Constraints.js';
import * as wpimath_trajectory_TrapezoidProfile_State from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfile.State.js';
import * as wpimath_trajectory_TrapezoidProfileRadians from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfileRadians.js';
import * as wpimath_trajectory_TrapezoidProfileRadians_Constraints from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfileRadians.Constraints.js';
import * as wpimath_trajectory_TrapezoidProfileRadians_State from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfileRadians.State.js';
import * as wpimath_trajectory_constraint_CentripetalAccelerationConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.CentripetalAccelerationConstraint.js';
import * as wpimath_trajectory_constraint_DifferentialDriveKinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint.js';
import * as wpimath_trajectory_constraint_DifferentialDriveVoltageConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint.js';
import * as wpimath_trajectory_constraint_EllipticalRegionConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.EllipticalRegionConstraint.js';
import * as wpimath_trajectory_constraint_MaxVelocityConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.MaxVelocityConstraint.js';
import * as wpimath_trajectory_constraint_MecanumDriveKinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint.js';
import * as wpimath_trajectory_constraint_RectangularRegionConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.RectangularRegionConstraint.js';
import * as wpimath_trajectory_constraint_SwerveDrive2KinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.SwerveDrive2KinematicsConstraint.js';
import * as wpimath_trajectory_constraint_SwerveDrive3KinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.SwerveDrive3KinematicsConstraint.js';
import * as wpimath_trajectory_constraint_SwerveDrive4KinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.SwerveDrive4KinematicsConstraint.js';
import * as wpimath_trajectory_constraint_SwerveDrive6KinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint.js';
import * as wpimath_trajectory_constraint_TrajectoryConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.TrajectoryConstraint.js';
import * as wpimath_trajectory_constraint_TrajectoryConstraint_MinMax from '../../blocks/generated/class_wpimath.trajectory.constraint.TrajectoryConstraint.MinMax.js';
import * as wpimath_units from '../../blocks/generated/module_wpimath.units.js';

export function getToolboxCategories() {
  return [
    hal.getToolboxCategory([
      hal_AddressableLEDData.getToolboxCategory([]),
      hal_CANStreamMessage.getToolboxCategory([]),
      hal_ControlWord.getToolboxCategory([]),
      hal_JoystickAxes.getToolboxCategory([]),
      hal_JoystickButtons.getToolboxCategory([]),
      hal_JoystickDescriptor.getToolboxCategory([]),
      hal_JoystickPOVs.getToolboxCategory([]),
      hal_MatchInfo.getToolboxCategory([]),
      hal_PowerDistributionFaults.getToolboxCategory([]),
      hal_PowerDistributionStickyFaults.getToolboxCategory([]),
      hal_PowerDistributionVersion.getToolboxCategory([]),
      hal_REVPHCompressorConfig.getToolboxCategory([]),
      hal_REVPHFaults.getToolboxCategory([]),
      hal_REVPHStickyFaults.getToolboxCategory([]),
      hal_REVPHVersion.getToolboxCategory([]),
      hal_SimBoolean.getToolboxCategory([]),
      hal_SimDevice.getToolboxCategory([]),
      hal_SimDouble.getToolboxCategory([]),
      hal_SimEnum.getToolboxCategory([]),
      hal_SimInt.getToolboxCategory([]),
      hal_SimLong.getToolboxCategory([]),
      hal_SimValue.getToolboxCategory([]),
      hal_Value.getToolboxCategory([]),
      hal_simulation.getToolboxCategory([
        hal_simulation_NotifierInfo.getToolboxCategory([]),
        hal_simulation_SimCB.getToolboxCategory([]),
        hal_simulation_SimValueCB.getToolboxCategory([]),
      ]),
    ]),
    wpilib.getToolboxCategory([
      wpilib_ADIS16448_IMU.getToolboxCategory([]),
      wpilib_ADIS16470_IMU.getToolboxCategory([]),
      wpilib_ADXL345_I2C.getToolboxCategory([
        wpilib_ADXL345_I2C_AllAxes.getToolboxCategory([]),
      ]),
      wpilib_ADXL345_SPI.getToolboxCategory([
        wpilib_ADXL345_SPI_AllAxes.getToolboxCategory([]),
      ]),
      wpilib_ADXL362.getToolboxCategory([
        wpilib_ADXL362_AllAxes.getToolboxCategory([]),
      ]),
      wpilib_ADXRS450_Gyro.getToolboxCategory([]),
      wpilib_AddressableLED.getToolboxCategory([
        wpilib_AddressableLED_LEDData.getToolboxCategory([]),
      ]),
      wpilib_AnalogAccelerometer.getToolboxCategory([]),
      wpilib_AnalogEncoder.getToolboxCategory([]),
      wpilib_AnalogGyro.getToolboxCategory([]),
      wpilib_AnalogInput.getToolboxCategory([]),
      wpilib_AnalogOutput.getToolboxCategory([]),
      wpilib_AnalogPotentiometer.getToolboxCategory([]),
      wpilib_AnalogTrigger.getToolboxCategory([]),
      wpilib_AnalogTriggerOutput.getToolboxCategory([]),
      wpilib_BuiltInAccelerometer.getToolboxCategory([]),
      wpilib_CAN.getToolboxCategory([]),
      wpilib_CANData.getToolboxCategory([]),
      wpilib_CANStatus.getToolboxCategory([]),
      wpilib_Color.getToolboxCategory([]),
      wpilib_Color8Bit.getToolboxCategory([]),
      wpilib_Compressor.getToolboxCategory([]),
      wpilib_Counter.getToolboxCategory([]),
      wpilib_DMC60.getToolboxCategory([]),
      wpilib_DSControlWord.getToolboxCategory([]),
      wpilib_DataLogManager.getToolboxCategory([]),
      wpilib_DigitalGlitchFilter.getToolboxCategory([]),
      wpilib_DigitalInput.getToolboxCategory([]),
      wpilib_DigitalOutput.getToolboxCategory([]),
      wpilib_DigitalSource.getToolboxCategory([]),
      wpilib_DoubleSolenoid.getToolboxCategory([]),
      wpilib_DriverStation.getToolboxCategory([]),
      wpilib_DutyCycle.getToolboxCategory([]),
      wpilib_DutyCycleEncoder.getToolboxCategory([]),
      wpilib_Encoder.getToolboxCategory([]),
      wpilib_Field2d.getToolboxCategory([]),
      wpilib_FieldObject2d.getToolboxCategory([]),
      wpilib_I2C.getToolboxCategory([]),
      wpilib_IterativeRobotBase.getToolboxCategory([]),
      wpilib_Jaguar.getToolboxCategory([]),
      wpilib_Joystick.getToolboxCategory([]),
      wpilib_LiveWindow.getToolboxCategory([]),
      wpilib_Mechanism2d.getToolboxCategory([]),
      wpilib_MechanismLigament2d.getToolboxCategory([]),
      wpilib_MechanismObject2d.getToolboxCategory([]),
      wpilib_MechanismRoot2d.getToolboxCategory([]),
      wpilib_MotorControllerGroup.getToolboxCategory([]),
      wpilib_MotorSafety.getToolboxCategory([]),
      wpilib_NidecBrushless.getToolboxCategory([]),
      wpilib_Notifier.getToolboxCategory([]),
      wpilib_PS4Controller.getToolboxCategory([
        wpilib_PS4Controller_Axis.getToolboxCategory([]),
        wpilib_PS4Controller_Button.getToolboxCategory([]),
      ]),
      wpilib_PS5Controller.getToolboxCategory([
        wpilib_PS5Controller_Axis.getToolboxCategory([]),
        wpilib_PS5Controller_Button.getToolboxCategory([]),
      ]),
      wpilib_PWM.getToolboxCategory([]),
      wpilib_PWMMotorController.getToolboxCategory([]),
      wpilib_PWMSparkFlex.getToolboxCategory([]),
      wpilib_PWMSparkMax.getToolboxCategory([]),
      wpilib_PWMTalonFX.getToolboxCategory([]),
      wpilib_PWMTalonSRX.getToolboxCategory([]),
      wpilib_PWMVenom.getToolboxCategory([]),
      wpilib_PWMVictorSPX.getToolboxCategory([]),
      wpilib_PneumaticHub.getToolboxCategory([
        wpilib_PneumaticHub_Faults.getToolboxCategory([]),
        wpilib_PneumaticHub_StickyFaults.getToolboxCategory([]),
        wpilib_PneumaticHub_Version.getToolboxCategory([]),
      ]),
      wpilib_PneumaticsBase.getToolboxCategory([]),
      wpilib_PneumaticsControlModule.getToolboxCategory([]),
      wpilib_PowerDistribution.getToolboxCategory([
        wpilib_PowerDistribution_Faults.getToolboxCategory([]),
        wpilib_PowerDistribution_StickyFaults.getToolboxCategory([]),
        wpilib_PowerDistribution_Version.getToolboxCategory([]),
      ]),
      wpilib_Preferences.getToolboxCategory([]),
      wpilib_Relay.getToolboxCategory([]),
      wpilib_RobotBase.getToolboxCategory([]),
      wpilib_RobotController.getToolboxCategory([]),
      wpilib_RobotState.getToolboxCategory([]),
      wpilib_SD540.getToolboxCategory([]),
      wpilib_SPI.getToolboxCategory([]),
      wpilib_SendableBuilderImpl.getToolboxCategory([]),
      wpilib_SendableChooser.getToolboxCategory([]),
      wpilib_SendableChooserBase.getToolboxCategory([]),
      wpilib_SensorUtil.getToolboxCategory([]),
      wpilib_SerialPort.getToolboxCategory([]),
      wpilib_Servo.getToolboxCategory([]),
      wpilib_SmartDashboard.getToolboxCategory([]),
      wpilib_Solenoid.getToolboxCategory([]),
      wpilib_Spark.getToolboxCategory([]),
      wpilib_StadiaController.getToolboxCategory([
        wpilib_StadiaController_Axis.getToolboxCategory([]),
        wpilib_StadiaController_Button.getToolboxCategory([]),
      ]),
      wpilib_SynchronousInterrupt.getToolboxCategory([]),
      wpilib_Talon.getToolboxCategory([]),
      wpilib_TimedRobot.getToolboxCategory([]),
      wpilib_Timer.getToolboxCategory([]),
      wpilib_TimesliceRobot.getToolboxCategory([]),
      wpilib_Tracer.getToolboxCategory([]),
      wpilib_Ultrasonic.getToolboxCategory([]),
      wpilib_Victor.getToolboxCategory([]),
      wpilib_VictorSP.getToolboxCategory([]),
      wpilib_Watchdog.getToolboxCategory([]),
      wpilib_XboxController.getToolboxCategory([
        wpilib_XboxController_Axis.getToolboxCategory([]),
        wpilib_XboxController_Button.getToolboxCategory([]),
      ]),
      wpilib_counter.getToolboxCategory([
        wpilib_counter_ExternalDirectionCounter.getToolboxCategory([]),
        wpilib_counter_Tachometer.getToolboxCategory([]),
        wpilib_counter_UpDownCounter.getToolboxCategory([]),
      ]),
      { kind: "category", name: "drive", contents: [
        wpilib_drive_DifferentialDrive.getToolboxCategory([
          wpilib_drive_DifferentialDrive_WheelSpeeds.getToolboxCategory([]),
        ]),
        wpilib_drive_MecanumDrive.getToolboxCategory([
          wpilib_drive_MecanumDrive_WheelSpeeds.getToolboxCategory([]),
        ]),
        wpilib_drive_RobotDriveBase.getToolboxCategory([]),
      ]},
      { kind: "category", name: "event", contents: [
        wpilib_event_BooleanEvent.getToolboxCategory([]),
        wpilib_event_EventLoop.getToolboxCategory([]),
        wpilib_event_NetworkBooleanEvent.getToolboxCategory([]),
      ]},
      { kind: "category", name: "interfaces", contents: [
        wpilib_interfaces_Accelerometer.getToolboxCategory([]),
        wpilib_interfaces_CounterBase.getToolboxCategory([]),
        wpilib_interfaces_GenericHID.getToolboxCategory([]),
        wpilib_interfaces_Gyro.getToolboxCategory([]),
        wpilib_interfaces_MotorController.getToolboxCategory([]),
      ]},
      wpilib_shuffleboard.getToolboxCategory([
        wpilib_shuffleboard_ComplexWidget.getToolboxCategory([]),
        wpilib_shuffleboard_LayoutType.getToolboxCategory([]),
        wpilib_shuffleboard_Shuffleboard.getToolboxCategory([]),
        wpilib_shuffleboard_ShuffleboardComponentBase.getToolboxCategory([]),
        wpilib_shuffleboard_ShuffleboardContainer.getToolboxCategory([]),
        wpilib_shuffleboard_ShuffleboardLayout.getToolboxCategory([]),
        wpilib_shuffleboard_ShuffleboardTab.getToolboxCategory([]),
        wpilib_shuffleboard_ShuffleboardValue.getToolboxCategory([]),
        wpilib_shuffleboard_SimpleWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedBoolListValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedBoolValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedDoubleListValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedDoubleValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedFloatListValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedFloatValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedIntListValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedIntegerValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedRawValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedStringListValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_SuppliedStringValueWidget.getToolboxCategory([]),
        wpilib_shuffleboard_WidgetType.getToolboxCategory([]),
        wpilib_shuffleboard__ComplexComponent.getToolboxCategory([]),
        wpilib_shuffleboard__ComplexWidget.getToolboxCategory([]),
        wpilib_shuffleboard__LayoutComponent.getToolboxCategory([]),
        wpilib_shuffleboard__SimpleComponent.getToolboxCategory([]),
        wpilib_shuffleboard__SimpleWidget.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_bool.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_double.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_float.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_integer.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_string.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_vector_bool.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_vector_double.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_vector_float.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_vector_int.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_vector_raw.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueComponent_vector_string.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_bool.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_double.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_float.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_integer.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_string.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_vector_bool.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_vector_double.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_vector_float.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_vector_int.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_vector_raw.getToolboxCategory([]),
        wpilib_shuffleboard__SuppliedValueWidget_vector_string.getToolboxCategory([]),
      ]),
      wpilib_simulation.getToolboxCategory([
        wpilib_simulation_ADIS16448_IMUSim.getToolboxCategory([]),
        wpilib_simulation_ADIS16470_IMUSim.getToolboxCategory([]),
        wpilib_simulation_ADXL345Sim.getToolboxCategory([]),
        wpilib_simulation_ADXL362Sim.getToolboxCategory([]),
        wpilib_simulation_ADXRS450_GyroSim.getToolboxCategory([]),
        wpilib_simulation_AddressableLEDSim.getToolboxCategory([]),
        wpilib_simulation_AnalogEncoderSim.getToolboxCategory([]),
        wpilib_simulation_AnalogGyroSim.getToolboxCategory([]),
        wpilib_simulation_AnalogInputSim.getToolboxCategory([]),
        wpilib_simulation_AnalogOutputSim.getToolboxCategory([]),
        wpilib_simulation_AnalogTriggerSim.getToolboxCategory([]),
        wpilib_simulation_BatterySim.getToolboxCategory([]),
        wpilib_simulation_BuiltInAccelerometerSim.getToolboxCategory([]),
        wpilib_simulation_CTREPCMSim.getToolboxCategory([]),
        wpilib_simulation_CallbackStore.getToolboxCategory([]),
        wpilib_simulation_DCMotorSim.getToolboxCategory([]),
        wpilib_simulation_DIOSim.getToolboxCategory([]),
        wpilib_simulation_DifferentialDrivetrainSim.getToolboxCategory([
          wpilib_simulation_DifferentialDrivetrainSim_KitbotGearing.getToolboxCategory([]),
          wpilib_simulation_DifferentialDrivetrainSim_KitbotMotor.getToolboxCategory([]),
          wpilib_simulation_DifferentialDrivetrainSim_KitbotWheelSize.getToolboxCategory([]),
          wpilib_simulation_DifferentialDrivetrainSim_State.getToolboxCategory([]),
        ]),
        wpilib_simulation_DigitalPWMSim.getToolboxCategory([]),
        wpilib_simulation_DoubleSolenoidSim.getToolboxCategory([]),
        wpilib_simulation_DriverStationSim.getToolboxCategory([]),
        wpilib_simulation_DutyCycleEncoderSim.getToolboxCategory([]),
        wpilib_simulation_DutyCycleSim.getToolboxCategory([]),
        wpilib_simulation_ElevatorSim.getToolboxCategory([]),
        wpilib_simulation_EncoderSim.getToolboxCategory([]),
        wpilib_simulation_FlywheelSim.getToolboxCategory([]),
        wpilib_simulation_GenericHIDSim.getToolboxCategory([]),
        wpilib_simulation_JoystickSim.getToolboxCategory([]),
        wpilib_simulation_LinearSystemSim_1_1_1.getToolboxCategory([]),
        wpilib_simulation_LinearSystemSim_1_1_2.getToolboxCategory([]),
        wpilib_simulation_LinearSystemSim_2_1_1.getToolboxCategory([]),
        wpilib_simulation_LinearSystemSim_2_1_2.getToolboxCategory([]),
        wpilib_simulation_LinearSystemSim_2_2_1.getToolboxCategory([]),
        wpilib_simulation_LinearSystemSim_2_2_2.getToolboxCategory([]),
        wpilib_simulation_PS4ControllerSim.getToolboxCategory([]),
        wpilib_simulation_PS5ControllerSim.getToolboxCategory([]),
        wpilib_simulation_PWMSim.getToolboxCategory([]),
        wpilib_simulation_PneumaticsBaseSim.getToolboxCategory([]),
        wpilib_simulation_PowerDistributionSim.getToolboxCategory([]),
        wpilib_simulation_REVPHSim.getToolboxCategory([]),
        wpilib_simulation_RelaySim.getToolboxCategory([]),
        wpilib_simulation_RoboRioSim.getToolboxCategory([]),
        wpilib_simulation_SPIAccelerometerSim.getToolboxCategory([]),
        wpilib_simulation_SimDeviceSim.getToolboxCategory([]),
        wpilib_simulation_SingleJointedArmSim.getToolboxCategory([]),
        wpilib_simulation_SolenoidSim.getToolboxCategory([]),
        wpilib_simulation_UltrasonicSim.getToolboxCategory([]),
        wpilib_simulation_XboxControllerSim.getToolboxCategory([]),
      ]),
      { kind: "category", name: "sysid", contents: [
        wpilib_sysid_SysIdRoutineLog.getToolboxCategory([
          wpilib_sysid_SysIdRoutineLog_MotorLog.getToolboxCategory([]),
        ]),
      ]},
    ]),
    wpimath.getToolboxCategory([
      { kind: "category", name: "controller", contents: [
        wpimath_controller_ArmFeedforward.getToolboxCategory([]),
        wpimath_controller_BangBangController.getToolboxCategory([]),
        wpimath_controller_ControlAffinePlantInversionFeedforward_1_1.getToolboxCategory([]),
        wpimath_controller_ControlAffinePlantInversionFeedforward_2_1.getToolboxCategory([]),
        wpimath_controller_ControlAffinePlantInversionFeedforward_2_2.getToolboxCategory([]),
        wpimath_controller_DifferentialDriveAccelerationLimiter.getToolboxCategory([]),
        wpimath_controller_DifferentialDriveWheelVoltages.getToolboxCategory([]),
        wpimath_controller_ElevatorFeedforward.getToolboxCategory([]),
        wpimath_controller_HolonomicDriveController.getToolboxCategory([]),
        wpimath_controller_ImplicitModelFollower_1_1.getToolboxCategory([]),
        wpimath_controller_ImplicitModelFollower_2_1.getToolboxCategory([]),
        wpimath_controller_ImplicitModelFollower_2_2.getToolboxCategory([]),
        wpimath_controller_LTVDifferentialDriveController.getToolboxCategory([]),
        wpimath_controller_LTVUnicycleController.getToolboxCategory([]),
        wpimath_controller_LinearPlantInversionFeedforward_1_1.getToolboxCategory([]),
        wpimath_controller_LinearPlantInversionFeedforward_2_1.getToolboxCategory([]),
        wpimath_controller_LinearPlantInversionFeedforward_2_2.getToolboxCategory([]),
        wpimath_controller_LinearPlantInversionFeedforward_3_2.getToolboxCategory([]),
        wpimath_controller_LinearQuadraticRegulator_1_1.getToolboxCategory([]),
        wpimath_controller_LinearQuadraticRegulator_2_1.getToolboxCategory([]),
        wpimath_controller_LinearQuadraticRegulator_2_2.getToolboxCategory([]),
        wpimath_controller_LinearQuadraticRegulator_3_2.getToolboxCategory([]),
        wpimath_controller_PIDController.getToolboxCategory([]),
        wpimath_controller_ProfiledPIDController.getToolboxCategory([]),
        wpimath_controller_ProfiledPIDControllerRadians.getToolboxCategory([]),
        wpimath_controller_RamseteController.getToolboxCategory([]),
        wpimath_controller_SimpleMotorFeedforwardMeters.getToolboxCategory([]),
        wpimath_controller_SimpleMotorFeedforwardRadians.getToolboxCategory([]),
      ]},
      { kind: "category", name: "estimator", contents: [
        wpimath_estimator_DifferentialDrivePoseEstimator.getToolboxCategory([]),
        wpimath_estimator_DifferentialDrivePoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_ExtendedKalmanFilter_1_1_1.getToolboxCategory([]),
        wpimath_estimator_ExtendedKalmanFilter_2_1_1.getToolboxCategory([]),
        wpimath_estimator_ExtendedKalmanFilter_2_2_2.getToolboxCategory([]),
        wpimath_estimator_KalmanFilter_1_1_1.getToolboxCategory([]),
        wpimath_estimator_KalmanFilter_2_1_1.getToolboxCategory([]),
        wpimath_estimator_KalmanFilter_2_2_2.getToolboxCategory([]),
        wpimath_estimator_KalmanFilter_3_2_3.getToolboxCategory([]),
        wpimath_estimator_MecanumDrivePoseEstimator.getToolboxCategory([]),
        wpimath_estimator_MecanumDrivePoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive2PoseEstimator.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive2PoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive3PoseEstimator.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive3PoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive4PoseEstimator.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive4PoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive6PoseEstimator.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive6PoseEstimatorBase.getToolboxCategory([]),
      ]},
      { kind: "category", name: "filter", contents: [
        wpimath_filter_Debouncer.getToolboxCategory([]),
        wpimath_filter_LinearFilter.getToolboxCategory([]),
        wpimath_filter_MedianFilter.getToolboxCategory([]),
        wpimath_filter_SlewRateLimiter.getToolboxCategory([]),
      ]},
      { kind: "category", name: "geometry", contents: [
        wpimath_geometry_CoordinateAxis.getToolboxCategory([]),
        wpimath_geometry_CoordinateSystem.getToolboxCategory([]),
        wpimath_geometry_Pose2d.getToolboxCategory([]),
        wpimath_geometry_Pose3d.getToolboxCategory([]),
        wpimath_geometry_Quaternion.getToolboxCategory([]),
        wpimath_geometry_Rotation2d.getToolboxCategory([]),
        wpimath_geometry_Rotation3d.getToolboxCategory([]),
        wpimath_geometry_Transform2d.getToolboxCategory([]),
        wpimath_geometry_Transform3d.getToolboxCategory([]),
        wpimath_geometry_Translation2d.getToolboxCategory([]),
        wpimath_geometry_Translation3d.getToolboxCategory([]),
        wpimath_geometry_Twist2d.getToolboxCategory([]),
        wpimath_geometry_Twist3d.getToolboxCategory([]),
      ]},
      { kind: "category", name: "interpolation", contents: [
        wpimath_interpolation_TimeInterpolatableFloatBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatablePose2dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatablePose3dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatableRotation2dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatableRotation3dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatableTranslation2dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatableTranslation3dBuffer.getToolboxCategory([]),
      ]},
      { kind: "category", name: "kinematics", contents: [
        wpimath_kinematics_ChassisSpeeds.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveKinematics.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveKinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveOdometry.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveOdometryBase.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveWheelPositions.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveWheelSpeeds.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveKinematics.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveKinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveOdometry.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveOdometryBase.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveWheelPositions.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveWheelSpeeds.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2Kinematics.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2KinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2Odometry.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2OdometryBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2WheelPositions.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3Kinematics.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3KinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3Odometry.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3OdometryBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3WheelPositions.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4Kinematics.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4KinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4Odometry.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4OdometryBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4WheelPositions.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6Kinematics.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6KinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6Odometry.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6OdometryBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6WheelPositions.getToolboxCategory([]),
        wpimath_kinematics_SwerveModulePosition.getToolboxCategory([]),
        wpimath_kinematics_SwerveModuleState.getToolboxCategory([]),
      ]},
      { kind: "category", name: "optimization", contents: [
        wpimath_optimization_SimulatedAnnealing.getToolboxCategory([]),
      ]},
      { kind: "category", name: "path", contents: [
        wpimath_path_TravelingSalesman.getToolboxCategory([]),
      ]},
      { kind: "category", name: "spline", contents: [
        wpimath_spline_CubicHermiteSpline.getToolboxCategory([]),
        wpimath_spline_QuinticHermiteSpline.getToolboxCategory([]),
        wpimath_spline_Spline3.getToolboxCategory([
          wpimath_spline_Spline3_ControlVector.getToolboxCategory([]),
        ]),
        wpimath_spline_Spline5.getToolboxCategory([
          wpimath_spline_Spline5_ControlVector.getToolboxCategory([]),
        ]),
        wpimath_spline_SplineHelper.getToolboxCategory([]),
        wpimath_spline_SplineParameterizer.getToolboxCategory([]),
      ]},
      { kind: "category", name: "system", contents: [
        wpimath_system_LinearSystemLoop_1_1_1.getToolboxCategory([]),
        wpimath_system_LinearSystemLoop_2_1_1.getToolboxCategory([]),
        wpimath_system_LinearSystemLoop_2_2_2.getToolboxCategory([]),
        wpimath_system_LinearSystemLoop_3_2_3.getToolboxCategory([]),
        wpimath_system_LinearSystem_1_1_1.getToolboxCategory([]),
        wpimath_system_LinearSystem_1_1_2.getToolboxCategory([]),
        wpimath_system_LinearSystem_1_1_3.getToolboxCategory([]),
        wpimath_system_LinearSystem_2_1_1.getToolboxCategory([]),
        wpimath_system_LinearSystem_2_1_2.getToolboxCategory([]),
        wpimath_system_LinearSystem_2_1_3.getToolboxCategory([]),
        wpimath_system_LinearSystem_2_2_1.getToolboxCategory([]),
        wpimath_system_LinearSystem_2_2_2.getToolboxCategory([]),
        wpimath_system_LinearSystem_2_2_3.getToolboxCategory([]),
        wpimath_system_LinearSystem_3_2_1.getToolboxCategory([]),
        wpimath_system_LinearSystem_3_2_2.getToolboxCategory([]),
        wpimath_system_LinearSystem_3_2_3.getToolboxCategory([]),
        { kind: "category", name: "plant", contents: [
          wpimath_system_plant_DCMotor.getToolboxCategory([]),
          wpimath_system_plant_LinearSystemId.getToolboxCategory([]),
        ]},
      ]},
      { kind: "category", name: "trajectory", contents: [
        wpimath_trajectory_ExponentialProfileMeterVolts.getToolboxCategory([
          wpimath_trajectory_ExponentialProfileMeterVolts_Constraints.getToolboxCategory([]),
          wpimath_trajectory_ExponentialProfileMeterVolts_ProfileTiming.getToolboxCategory([]),
          wpimath_trajectory_ExponentialProfileMeterVolts_State.getToolboxCategory([]),
        ]),
        wpimath_trajectory_Trajectory.getToolboxCategory([
          wpimath_trajectory_Trajectory_State.getToolboxCategory([]),
        ]),
        wpimath_trajectory_TrajectoryConfig.getToolboxCategory([]),
        wpimath_trajectory_TrajectoryGenerator.getToolboxCategory([]),
        wpimath_trajectory_TrajectoryParameterizer.getToolboxCategory([]),
        wpimath_trajectory_TrajectoryUtil.getToolboxCategory([]),
        wpimath_trajectory_TrapezoidProfile.getToolboxCategory([
          wpimath_trajectory_TrapezoidProfile_Constraints.getToolboxCategory([]),
          wpimath_trajectory_TrapezoidProfile_State.getToolboxCategory([]),
        ]),
        wpimath_trajectory_TrapezoidProfileRadians.getToolboxCategory([
          wpimath_trajectory_TrapezoidProfileRadians_Constraints.getToolboxCategory([]),
          wpimath_trajectory_TrapezoidProfileRadians_State.getToolboxCategory([]),
        ]),
        { kind: "category", name: "constraint", contents: [
          wpimath_trajectory_constraint_CentripetalAccelerationConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_DifferentialDriveKinematicsConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_DifferentialDriveVoltageConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_EllipticalRegionConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_MaxVelocityConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_MecanumDriveKinematicsConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_RectangularRegionConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_SwerveDrive2KinematicsConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_SwerveDrive3KinematicsConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_SwerveDrive4KinematicsConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_SwerveDrive6KinematicsConstraint.getToolboxCategory([]),
          wpimath_trajectory_constraint_TrajectoryConstraint.getToolboxCategory([
            wpimath_trajectory_constraint_TrajectoryConstraint_MinMax.getToolboxCategory([]),
          ]),
        ]},
      ]},
      wpimath_units.getToolboxCategory([]),
    ]),
  ];
}
