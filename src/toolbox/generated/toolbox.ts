// This file was generated. Do not edit!

import * as hal from '../../blocks/generated/module_hal';
import * as hal_AddressableLEDData from '../../blocks/generated/class_hal.AddressableLEDData';
import * as hal_CANStreamMessage from '../../blocks/generated/class_hal.CANStreamMessage';
import * as hal_ControlWord from '../../blocks/generated/class_hal.ControlWord';
import * as hal_JoystickAxes from '../../blocks/generated/class_hal.JoystickAxes';
import * as hal_JoystickButtons from '../../blocks/generated/class_hal.JoystickButtons';
import * as hal_JoystickDescriptor from '../../blocks/generated/class_hal.JoystickDescriptor';
import * as hal_JoystickPOVs from '../../blocks/generated/class_hal.JoystickPOVs';
import * as hal_MatchInfo from '../../blocks/generated/class_hal.MatchInfo';
import * as hal_PowerDistributionFaults from '../../blocks/generated/class_hal.PowerDistributionFaults';
import * as hal_PowerDistributionStickyFaults from '../../blocks/generated/class_hal.PowerDistributionStickyFaults';
import * as hal_PowerDistributionVersion from '../../blocks/generated/class_hal.PowerDistributionVersion';
import * as hal_REVPHCompressorConfig from '../../blocks/generated/class_hal.REVPHCompressorConfig';
import * as hal_REVPHFaults from '../../blocks/generated/class_hal.REVPHFaults';
import * as hal_REVPHStickyFaults from '../../blocks/generated/class_hal.REVPHStickyFaults';
import * as hal_REVPHVersion from '../../blocks/generated/class_hal.REVPHVersion';
import * as hal_SimBoolean from '../../blocks/generated/class_hal.SimBoolean';
import * as hal_SimDevice from '../../blocks/generated/class_hal.SimDevice';
import * as hal_SimDouble from '../../blocks/generated/class_hal.SimDouble';
import * as hal_SimEnum from '../../blocks/generated/class_hal.SimEnum';
import * as hal_SimInt from '../../blocks/generated/class_hal.SimInt';
import * as hal_SimLong from '../../blocks/generated/class_hal.SimLong';
import * as hal_SimValue from '../../blocks/generated/class_hal.SimValue';
import * as hal_Value from '../../blocks/generated/class_hal.Value';
import * as hal_exceptions from '../../blocks/generated/module_hal.exceptions';
import * as hal_exceptions_HALError from '../../blocks/generated/class_hal.exceptions.HALError';
import * as hal_simulation from '../../blocks/generated/module_hal.simulation';
import * as hal_simulation_NotifierInfo from '../../blocks/generated/class_hal.simulation.NotifierInfo';
import * as hal_simulation_SimCB from '../../blocks/generated/class_hal.simulation.SimCB';
import * as hal_simulation_SimValueCB from '../../blocks/generated/class_hal.simulation.SimValueCB';
import * as wpilib from '../../blocks/generated/module_wpilib';
import * as wpilib_ADIS16448_IMU from '../../blocks/generated/class_wpilib.ADIS16448_IMU';
import * as wpilib_ADIS16470_IMU from '../../blocks/generated/class_wpilib.ADIS16470_IMU';
import * as wpilib_ADXL345_I2C from '../../blocks/generated/class_wpilib.ADXL345_I2C';
import * as wpilib_ADXL345_I2C_AllAxes from '../../blocks/generated/class_wpilib.ADXL345_I2C.AllAxes';
import * as wpilib_ADXL345_SPI from '../../blocks/generated/class_wpilib.ADXL345_SPI';
import * as wpilib_ADXL345_SPI_AllAxes from '../../blocks/generated/class_wpilib.ADXL345_SPI.AllAxes';
import * as wpilib_ADXL362 from '../../blocks/generated/class_wpilib.ADXL362';
import * as wpilib_ADXL362_AllAxes from '../../blocks/generated/class_wpilib.ADXL362.AllAxes';
import * as wpilib_ADXRS450_Gyro from '../../blocks/generated/class_wpilib.ADXRS450_Gyro';
import * as wpilib_AddressableLED from '../../blocks/generated/class_wpilib.AddressableLED';
import * as wpilib_AddressableLED_LEDData from '../../blocks/generated/class_wpilib.AddressableLED.LEDData';
import * as wpilib_Alert from '../../blocks/generated/class_wpilib.Alert';
import * as wpilib_AnalogAccelerometer from '../../blocks/generated/class_wpilib.AnalogAccelerometer';
import * as wpilib_AnalogEncoder from '../../blocks/generated/class_wpilib.AnalogEncoder';
import * as wpilib_AnalogGyro from '../../blocks/generated/class_wpilib.AnalogGyro';
import * as wpilib_AnalogInput from '../../blocks/generated/class_wpilib.AnalogInput';
import * as wpilib_AnalogOutput from '../../blocks/generated/class_wpilib.AnalogOutput';
import * as wpilib_AnalogPotentiometer from '../../blocks/generated/class_wpilib.AnalogPotentiometer';
import * as wpilib_AnalogTrigger from '../../blocks/generated/class_wpilib.AnalogTrigger';
import * as wpilib_AnalogTriggerOutput from '../../blocks/generated/class_wpilib.AnalogTriggerOutput';
import * as wpilib_BuiltInAccelerometer from '../../blocks/generated/class_wpilib.BuiltInAccelerometer';
import * as wpilib_CAN from '../../blocks/generated/class_wpilib.CAN';
import * as wpilib_CANData from '../../blocks/generated/class_wpilib.CANData';
import * as wpilib_CANStatus from '../../blocks/generated/class_wpilib.CANStatus';
import * as wpilib_Color from '../../blocks/generated/class_wpilib.Color';
import * as wpilib_Color8Bit from '../../blocks/generated/class_wpilib.Color8Bit';
import * as wpilib_Compressor from '../../blocks/generated/class_wpilib.Compressor';
import * as wpilib_Counter from '../../blocks/generated/class_wpilib.Counter';
import * as wpilib_DMC60 from '../../blocks/generated/class_wpilib.DMC60';
import * as wpilib_DSControlWord from '../../blocks/generated/class_wpilib.DSControlWord';
import * as wpilib_DataLogManager from '../../blocks/generated/class_wpilib.DataLogManager';
import * as wpilib_DigitalGlitchFilter from '../../blocks/generated/class_wpilib.DigitalGlitchFilter';
import * as wpilib_DigitalInput from '../../blocks/generated/class_wpilib.DigitalInput';
import * as wpilib_DigitalOutput from '../../blocks/generated/class_wpilib.DigitalOutput';
import * as wpilib_DigitalSource from '../../blocks/generated/class_wpilib.DigitalSource';
import * as wpilib_DoubleSolenoid from '../../blocks/generated/class_wpilib.DoubleSolenoid';
import * as wpilib_DriverStation from '../../blocks/generated/class_wpilib.DriverStation';
import * as wpilib_DutyCycle from '../../blocks/generated/class_wpilib.DutyCycle';
import * as wpilib_DutyCycleEncoder from '../../blocks/generated/class_wpilib.DutyCycleEncoder';
import * as wpilib_Encoder from '../../blocks/generated/class_wpilib.Encoder';
import * as wpilib_Field2d from '../../blocks/generated/class_wpilib.Field2d';
import * as wpilib_FieldObject2d from '../../blocks/generated/class_wpilib.FieldObject2d';
import * as wpilib_I2C from '../../blocks/generated/class_wpilib.I2C';
import * as wpilib_IterativeRobotBase from '../../blocks/generated/class_wpilib.IterativeRobotBase';
import * as wpilib_Jaguar from '../../blocks/generated/class_wpilib.Jaguar';
import * as wpilib_Joystick from '../../blocks/generated/class_wpilib.Joystick';
import * as wpilib_LEDPattern from '../../blocks/generated/class_wpilib.LEDPattern';
import * as wpilib_LEDPattern_LEDReader from '../../blocks/generated/class_wpilib.LEDPattern.LEDReader';
import * as wpilib_LiveWindow from '../../blocks/generated/class_wpilib.LiveWindow';
import * as wpilib_Mechanism2d from '../../blocks/generated/class_wpilib.Mechanism2d';
import * as wpilib_MechanismLigament2d from '../../blocks/generated/class_wpilib.MechanismLigament2d';
import * as wpilib_MechanismObject2d from '../../blocks/generated/class_wpilib.MechanismObject2d';
import * as wpilib_MechanismRoot2d from '../../blocks/generated/class_wpilib.MechanismRoot2d';
import * as wpilib_MotorControllerGroup from '../../blocks/generated/class_wpilib.MotorControllerGroup';
import * as wpilib_MotorSafety from '../../blocks/generated/class_wpilib.MotorSafety';
import * as wpilib_NidecBrushless from '../../blocks/generated/class_wpilib.NidecBrushless';
import * as wpilib_Notifier from '../../blocks/generated/class_wpilib.Notifier';
import * as wpilib_PS4Controller from '../../blocks/generated/class_wpilib.PS4Controller';
import * as wpilib_PS4Controller_Axis from '../../blocks/generated/class_wpilib.PS4Controller.Axis';
import * as wpilib_PS4Controller_Button from '../../blocks/generated/class_wpilib.PS4Controller.Button';
import * as wpilib_PS5Controller from '../../blocks/generated/class_wpilib.PS5Controller';
import * as wpilib_PS5Controller_Axis from '../../blocks/generated/class_wpilib.PS5Controller.Axis';
import * as wpilib_PS5Controller_Button from '../../blocks/generated/class_wpilib.PS5Controller.Button';
import * as wpilib_PWM from '../../blocks/generated/class_wpilib.PWM';
import * as wpilib_PWMMotorController from '../../blocks/generated/class_wpilib.PWMMotorController';
import * as wpilib_PWMSparkFlex from '../../blocks/generated/class_wpilib.PWMSparkFlex';
import * as wpilib_PWMSparkMax from '../../blocks/generated/class_wpilib.PWMSparkMax';
import * as wpilib_PWMTalonFX from '../../blocks/generated/class_wpilib.PWMTalonFX';
import * as wpilib_PWMTalonSRX from '../../blocks/generated/class_wpilib.PWMTalonSRX';
import * as wpilib_PWMVenom from '../../blocks/generated/class_wpilib.PWMVenom';
import * as wpilib_PWMVictorSPX from '../../blocks/generated/class_wpilib.PWMVictorSPX';
import * as wpilib_PneumaticHub from '../../blocks/generated/class_wpilib.PneumaticHub';
import * as wpilib_PneumaticHub_Faults from '../../blocks/generated/class_wpilib.PneumaticHub.Faults';
import * as wpilib_PneumaticHub_StickyFaults from '../../blocks/generated/class_wpilib.PneumaticHub.StickyFaults';
import * as wpilib_PneumaticHub_Version from '../../blocks/generated/class_wpilib.PneumaticHub.Version';
import * as wpilib_PneumaticsBase from '../../blocks/generated/class_wpilib.PneumaticsBase';
import * as wpilib_PneumaticsControlModule from '../../blocks/generated/class_wpilib.PneumaticsControlModule';
import * as wpilib_PowerDistribution from '../../blocks/generated/class_wpilib.PowerDistribution';
import * as wpilib_PowerDistribution_Faults from '../../blocks/generated/class_wpilib.PowerDistribution.Faults';
import * as wpilib_PowerDistribution_StickyFaults from '../../blocks/generated/class_wpilib.PowerDistribution.StickyFaults';
import * as wpilib_PowerDistribution_Version from '../../blocks/generated/class_wpilib.PowerDistribution.Version';
import * as wpilib_Preferences from '../../blocks/generated/class_wpilib.Preferences';
import * as wpilib_Relay from '../../blocks/generated/class_wpilib.Relay';
import * as wpilib_RobotBase from '../../blocks/generated/class_wpilib.RobotBase';
import * as wpilib_RobotController from '../../blocks/generated/class_wpilib.RobotController';
import * as wpilib_RobotState from '../../blocks/generated/class_wpilib.RobotState';
import * as wpilib_SD540 from '../../blocks/generated/class_wpilib.SD540';
import * as wpilib_SPI from '../../blocks/generated/class_wpilib.SPI';
import * as wpilib_SendableBuilderImpl from '../../blocks/generated/class_wpilib.SendableBuilderImpl';
import * as wpilib_SendableChooser from '../../blocks/generated/class_wpilib.SendableChooser';
import * as wpilib_SendableChooserBase from '../../blocks/generated/class_wpilib.SendableChooserBase';
import * as wpilib_SensorUtil from '../../blocks/generated/class_wpilib.SensorUtil';
import * as wpilib_SerialPort from '../../blocks/generated/class_wpilib.SerialPort';
import * as wpilib_Servo from '../../blocks/generated/class_wpilib.Servo';
import * as wpilib_SharpIR from '../../blocks/generated/class_wpilib.SharpIR';
import * as wpilib_SmartDashboard from '../../blocks/generated/class_wpilib.SmartDashboard';
import * as wpilib_Solenoid from '../../blocks/generated/class_wpilib.Solenoid';
import * as wpilib_Spark from '../../blocks/generated/class_wpilib.Spark';
import * as wpilib_StadiaController from '../../blocks/generated/class_wpilib.StadiaController';
import * as wpilib_StadiaController_Axis from '../../blocks/generated/class_wpilib.StadiaController.Axis';
import * as wpilib_StadiaController_Button from '../../blocks/generated/class_wpilib.StadiaController.Button';
import * as wpilib_SynchronousInterrupt from '../../blocks/generated/class_wpilib.SynchronousInterrupt';
import * as wpilib_Talon from '../../blocks/generated/class_wpilib.Talon';
import * as wpilib_TimedRobot from '../../blocks/generated/class_wpilib.TimedRobot';
import * as wpilib_Timer from '../../blocks/generated/class_wpilib.Timer';
import * as wpilib_TimesliceRobot from '../../blocks/generated/class_wpilib.TimesliceRobot';
import * as wpilib_Tracer from '../../blocks/generated/class_wpilib.Tracer';
import * as wpilib_Ultrasonic from '../../blocks/generated/class_wpilib.Ultrasonic';
import * as wpilib_Victor from '../../blocks/generated/class_wpilib.Victor';
import * as wpilib_VictorSP from '../../blocks/generated/class_wpilib.VictorSP';
import * as wpilib_Watchdog from '../../blocks/generated/class_wpilib.Watchdog';
import * as wpilib_XboxController from '../../blocks/generated/class_wpilib.XboxController';
import * as wpilib_XboxController_Axis from '../../blocks/generated/class_wpilib.XboxController.Axis';
import * as wpilib_XboxController_Button from '../../blocks/generated/class_wpilib.XboxController.Button';
import * as wpilib_cameraserver from '../../blocks/generated/module_wpilib.cameraserver';
import * as wpilib_cameraserver_CameraServer from '../../blocks/generated/class_wpilib.cameraserver.CameraServer';
import * as wpilib_counter from '../../blocks/generated/module_wpilib.counter';
import * as wpilib_counter_ExternalDirectionCounter from '../../blocks/generated/class_wpilib.counter.ExternalDirectionCounter';
import * as wpilib_counter_Tachometer from '../../blocks/generated/class_wpilib.counter.Tachometer';
import * as wpilib_counter_UpDownCounter from '../../blocks/generated/class_wpilib.counter.UpDownCounter';
import * as wpilib_drive from '../../blocks/generated/module_wpilib.drive';
import * as wpilib_drive_DifferentialDrive from '../../blocks/generated/class_wpilib.drive.DifferentialDrive';
import * as wpilib_drive_DifferentialDrive_WheelSpeeds from '../../blocks/generated/class_wpilib.drive.DifferentialDrive.WheelSpeeds';
import * as wpilib_drive_MecanumDrive from '../../blocks/generated/class_wpilib.drive.MecanumDrive';
import * as wpilib_drive_MecanumDrive_WheelSpeeds from '../../blocks/generated/class_wpilib.drive.MecanumDrive.WheelSpeeds';
import * as wpilib_drive_RobotDriveBase from '../../blocks/generated/class_wpilib.drive.RobotDriveBase';
import * as wpilib_event from '../../blocks/generated/module_wpilib.event';
import * as wpilib_event_BooleanEvent from '../../blocks/generated/class_wpilib.event.BooleanEvent';
import * as wpilib_event_EventLoop from '../../blocks/generated/class_wpilib.event.EventLoop';
import * as wpilib_event_NetworkBooleanEvent from '../../blocks/generated/class_wpilib.event.NetworkBooleanEvent';
import * as wpilib_interfaces from '../../blocks/generated/module_wpilib.interfaces';
import * as wpilib_interfaces_CounterBase from '../../blocks/generated/class_wpilib.interfaces.CounterBase';
import * as wpilib_interfaces_GenericHID from '../../blocks/generated/class_wpilib.interfaces.GenericHID';
import * as wpilib_interfaces_MotorController from '../../blocks/generated/class_wpilib.interfaces.MotorController';
import * as wpilib_shuffleboard from '../../blocks/generated/module_wpilib.shuffleboard';
import * as wpilib_shuffleboard_ComplexWidget from '../../blocks/generated/class_wpilib.shuffleboard.ComplexWidget';
import * as wpilib_shuffleboard_LayoutType from '../../blocks/generated/class_wpilib.shuffleboard.LayoutType';
import * as wpilib_shuffleboard_Shuffleboard from '../../blocks/generated/class_wpilib.shuffleboard.Shuffleboard';
import * as wpilib_shuffleboard_ShuffleboardComponentBase from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardComponentBase';
import * as wpilib_shuffleboard_ShuffleboardContainer from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardContainer';
import * as wpilib_shuffleboard_ShuffleboardLayout from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardLayout';
import * as wpilib_shuffleboard_ShuffleboardTab from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardTab';
import * as wpilib_shuffleboard_ShuffleboardValue from '../../blocks/generated/class_wpilib.shuffleboard.ShuffleboardValue';
import * as wpilib_shuffleboard_SimpleWidget from '../../blocks/generated/class_wpilib.shuffleboard.SimpleWidget';
import * as wpilib_shuffleboard_SuppliedBoolListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedBoolListValueWidget';
import * as wpilib_shuffleboard_SuppliedBoolValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedBoolValueWidget';
import * as wpilib_shuffleboard_SuppliedDoubleListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedDoubleListValueWidget';
import * as wpilib_shuffleboard_SuppliedDoubleValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedDoubleValueWidget';
import * as wpilib_shuffleboard_SuppliedFloatListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedFloatListValueWidget';
import * as wpilib_shuffleboard_SuppliedFloatValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedFloatValueWidget';
import * as wpilib_shuffleboard_SuppliedIntListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedIntListValueWidget';
import * as wpilib_shuffleboard_SuppliedIntegerValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedIntegerValueWidget';
import * as wpilib_shuffleboard_SuppliedRawValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedRawValueWidget';
import * as wpilib_shuffleboard_SuppliedStringListValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedStringListValueWidget';
import * as wpilib_shuffleboard_SuppliedStringValueWidget from '../../blocks/generated/class_wpilib.shuffleboard.SuppliedStringValueWidget';
import * as wpilib_shuffleboard_WidgetType from '../../blocks/generated/class_wpilib.shuffleboard.WidgetType';
import * as wpilib_shuffleboard__ComplexComponent from '../../blocks/generated/class_wpilib.shuffleboard._ComplexComponent';
import * as wpilib_shuffleboard__ComplexWidget from '../../blocks/generated/class_wpilib.shuffleboard._ComplexWidget';
import * as wpilib_shuffleboard__LayoutComponent from '../../blocks/generated/class_wpilib.shuffleboard._LayoutComponent';
import * as wpilib_shuffleboard__SimpleComponent from '../../blocks/generated/class_wpilib.shuffleboard._SimpleComponent';
import * as wpilib_shuffleboard__SimpleWidget from '../../blocks/generated/class_wpilib.shuffleboard._SimpleWidget';
import * as wpilib_shuffleboard__SuppliedValueComponent_bool from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_bool';
import * as wpilib_shuffleboard__SuppliedValueComponent_double from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_double';
import * as wpilib_shuffleboard__SuppliedValueComponent_float from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_float';
import * as wpilib_shuffleboard__SuppliedValueComponent_integer from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_integer';
import * as wpilib_shuffleboard__SuppliedValueComponent_string from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_string';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_bool from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_bool';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_double from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_double';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_float from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_float';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_int from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_int';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_raw from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_raw';
import * as wpilib_shuffleboard__SuppliedValueComponent_vector_string from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueComponent_vector_string';
import * as wpilib_shuffleboard__SuppliedValueWidget_bool from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_bool';
import * as wpilib_shuffleboard__SuppliedValueWidget_double from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_double';
import * as wpilib_shuffleboard__SuppliedValueWidget_float from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_float';
import * as wpilib_shuffleboard__SuppliedValueWidget_integer from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_integer';
import * as wpilib_shuffleboard__SuppliedValueWidget_string from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_string';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_bool from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_bool';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_double from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_double';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_float from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_float';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_int from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_int';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_raw from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_raw';
import * as wpilib_shuffleboard__SuppliedValueWidget_vector_string from '../../blocks/generated/class_wpilib.shuffleboard._SuppliedValueWidget_vector_string';
import * as wpilib_simulation from '../../blocks/generated/module_wpilib.simulation';
import * as wpilib_simulation_ADIS16448_IMUSim from '../../blocks/generated/class_wpilib.simulation.ADIS16448_IMUSim';
import * as wpilib_simulation_ADIS16470_IMUSim from '../../blocks/generated/class_wpilib.simulation.ADIS16470_IMUSim';
import * as wpilib_simulation_ADXL345Sim from '../../blocks/generated/class_wpilib.simulation.ADXL345Sim';
import * as wpilib_simulation_ADXL362Sim from '../../blocks/generated/class_wpilib.simulation.ADXL362Sim';
import * as wpilib_simulation_ADXRS450_GyroSim from '../../blocks/generated/class_wpilib.simulation.ADXRS450_GyroSim';
import * as wpilib_simulation_AddressableLEDSim from '../../blocks/generated/class_wpilib.simulation.AddressableLEDSim';
import * as wpilib_simulation_AnalogEncoderSim from '../../blocks/generated/class_wpilib.simulation.AnalogEncoderSim';
import * as wpilib_simulation_AnalogGyroSim from '../../blocks/generated/class_wpilib.simulation.AnalogGyroSim';
import * as wpilib_simulation_AnalogInputSim from '../../blocks/generated/class_wpilib.simulation.AnalogInputSim';
import * as wpilib_simulation_AnalogOutputSim from '../../blocks/generated/class_wpilib.simulation.AnalogOutputSim';
import * as wpilib_simulation_AnalogTriggerSim from '../../blocks/generated/class_wpilib.simulation.AnalogTriggerSim';
import * as wpilib_simulation_BatterySim from '../../blocks/generated/class_wpilib.simulation.BatterySim';
import * as wpilib_simulation_BuiltInAccelerometerSim from '../../blocks/generated/class_wpilib.simulation.BuiltInAccelerometerSim';
import * as wpilib_simulation_CTREPCMSim from '../../blocks/generated/class_wpilib.simulation.CTREPCMSim';
import * as wpilib_simulation_CallbackStore from '../../blocks/generated/class_wpilib.simulation.CallbackStore';
import * as wpilib_simulation_DCMotorSim from '../../blocks/generated/class_wpilib.simulation.DCMotorSim';
import * as wpilib_simulation_DIOSim from '../../blocks/generated/class_wpilib.simulation.DIOSim';
import * as wpilib_simulation_DifferentialDrivetrainSim from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim';
import * as wpilib_simulation_DifferentialDrivetrainSim_KitbotGearing from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim.KitbotGearing';
import * as wpilib_simulation_DifferentialDrivetrainSim_KitbotMotor from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim.KitbotMotor';
import * as wpilib_simulation_DifferentialDrivetrainSim_KitbotWheelSize from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim.KitbotWheelSize';
import * as wpilib_simulation_DifferentialDrivetrainSim_State from '../../blocks/generated/class_wpilib.simulation.DifferentialDrivetrainSim.State';
import * as wpilib_simulation_DigitalPWMSim from '../../blocks/generated/class_wpilib.simulation.DigitalPWMSim';
import * as wpilib_simulation_DoubleSolenoidSim from '../../blocks/generated/class_wpilib.simulation.DoubleSolenoidSim';
import * as wpilib_simulation_DriverStationSim from '../../blocks/generated/class_wpilib.simulation.DriverStationSim';
import * as wpilib_simulation_DutyCycleEncoderSim from '../../blocks/generated/class_wpilib.simulation.DutyCycleEncoderSim';
import * as wpilib_simulation_DutyCycleSim from '../../blocks/generated/class_wpilib.simulation.DutyCycleSim';
import * as wpilib_simulation_ElevatorSim from '../../blocks/generated/class_wpilib.simulation.ElevatorSim';
import * as wpilib_simulation_EncoderSim from '../../blocks/generated/class_wpilib.simulation.EncoderSim';
import * as wpilib_simulation_FlywheelSim from '../../blocks/generated/class_wpilib.simulation.FlywheelSim';
import * as wpilib_simulation_GenericHIDSim from '../../blocks/generated/class_wpilib.simulation.GenericHIDSim';
import * as wpilib_simulation_JoystickSim from '../../blocks/generated/class_wpilib.simulation.JoystickSim';
import * as wpilib_simulation_LinearSystemSim_1_1_1 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_1_1_1';
import * as wpilib_simulation_LinearSystemSim_1_1_2 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_1_1_2';
import * as wpilib_simulation_LinearSystemSim_2_1_1 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_2_1_1';
import * as wpilib_simulation_LinearSystemSim_2_1_2 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_2_1_2';
import * as wpilib_simulation_LinearSystemSim_2_2_1 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_2_2_1';
import * as wpilib_simulation_LinearSystemSim_2_2_2 from '../../blocks/generated/class_wpilib.simulation.LinearSystemSim_2_2_2';
import * as wpilib_simulation_PS4ControllerSim from '../../blocks/generated/class_wpilib.simulation.PS4ControllerSim';
import * as wpilib_simulation_PS5ControllerSim from '../../blocks/generated/class_wpilib.simulation.PS5ControllerSim';
import * as wpilib_simulation_PWMSim from '../../blocks/generated/class_wpilib.simulation.PWMSim';
import * as wpilib_simulation_PneumaticsBaseSim from '../../blocks/generated/class_wpilib.simulation.PneumaticsBaseSim';
import * as wpilib_simulation_PowerDistributionSim from '../../blocks/generated/class_wpilib.simulation.PowerDistributionSim';
import * as wpilib_simulation_REVPHSim from '../../blocks/generated/class_wpilib.simulation.REVPHSim';
import * as wpilib_simulation_RelaySim from '../../blocks/generated/class_wpilib.simulation.RelaySim';
import * as wpilib_simulation_RoboRioSim from '../../blocks/generated/class_wpilib.simulation.RoboRioSim';
import * as wpilib_simulation_SPIAccelerometerSim from '../../blocks/generated/class_wpilib.simulation.SPIAccelerometerSim';
import * as wpilib_simulation_SendableChooserSim from '../../blocks/generated/class_wpilib.simulation.SendableChooserSim';
import * as wpilib_simulation_SharpIRSim from '../../blocks/generated/class_wpilib.simulation.SharpIRSim';
import * as wpilib_simulation_SimDeviceSim from '../../blocks/generated/class_wpilib.simulation.SimDeviceSim';
import * as wpilib_simulation_SingleJointedArmSim from '../../blocks/generated/class_wpilib.simulation.SingleJointedArmSim';
import * as wpilib_simulation_SolenoidSim from '../../blocks/generated/class_wpilib.simulation.SolenoidSim';
import * as wpilib_simulation_StadiaControllerSim from '../../blocks/generated/class_wpilib.simulation.StadiaControllerSim';
import * as wpilib_simulation_UltrasonicSim from '../../blocks/generated/class_wpilib.simulation.UltrasonicSim';
import * as wpilib_simulation_XboxControllerSim from '../../blocks/generated/class_wpilib.simulation.XboxControllerSim';
import * as wpilib_sysid_SysIdRoutineLog from '../../blocks/generated/class_wpilib.sysid.SysIdRoutineLog';
import * as wpilib_sysid_SysIdRoutineLog_MotorLog from '../../blocks/generated/class_wpilib.sysid.SysIdRoutineLog.MotorLog';
import * as wpimath from '../../blocks/generated/module_wpimath';
import * as wpimath_controller from '../../blocks/generated/module_wpimath.controller';
import * as wpimath_controller_ArmFeedforward from '../../blocks/generated/class_wpimath.controller.ArmFeedforward';
import * as wpimath_controller_BangBangController from '../../blocks/generated/class_wpimath.controller.BangBangController';
import * as wpimath_controller_ControlAffinePlantInversionFeedforward_1_1 from '../../blocks/generated/class_wpimath.controller.ControlAffinePlantInversionFeedforward_1_1';
import * as wpimath_controller_ControlAffinePlantInversionFeedforward_2_1 from '../../blocks/generated/class_wpimath.controller.ControlAffinePlantInversionFeedforward_2_1';
import * as wpimath_controller_ControlAffinePlantInversionFeedforward_2_2 from '../../blocks/generated/class_wpimath.controller.ControlAffinePlantInversionFeedforward_2_2';
import * as wpimath_controller_DifferentialDriveAccelerationLimiter from '../../blocks/generated/class_wpimath.controller.DifferentialDriveAccelerationLimiter';
import * as wpimath_controller_DifferentialDriveWheelVoltages from '../../blocks/generated/class_wpimath.controller.DifferentialDriveWheelVoltages';
import * as wpimath_controller_ElevatorFeedforward from '../../blocks/generated/class_wpimath.controller.ElevatorFeedforward';
import * as wpimath_controller_HolonomicDriveController from '../../blocks/generated/class_wpimath.controller.HolonomicDriveController';
import * as wpimath_controller_ImplicitModelFollower_1_1 from '../../blocks/generated/class_wpimath.controller.ImplicitModelFollower_1_1';
import * as wpimath_controller_ImplicitModelFollower_2_1 from '../../blocks/generated/class_wpimath.controller.ImplicitModelFollower_2_1';
import * as wpimath_controller_ImplicitModelFollower_2_2 from '../../blocks/generated/class_wpimath.controller.ImplicitModelFollower_2_2';
import * as wpimath_controller_LTVDifferentialDriveController from '../../blocks/generated/class_wpimath.controller.LTVDifferentialDriveController';
import * as wpimath_controller_LTVUnicycleController from '../../blocks/generated/class_wpimath.controller.LTVUnicycleController';
import * as wpimath_controller_LinearPlantInversionFeedforward_1_1 from '../../blocks/generated/class_wpimath.controller.LinearPlantInversionFeedforward_1_1';
import * as wpimath_controller_LinearPlantInversionFeedforward_2_1 from '../../blocks/generated/class_wpimath.controller.LinearPlantInversionFeedforward_2_1';
import * as wpimath_controller_LinearPlantInversionFeedforward_2_2 from '../../blocks/generated/class_wpimath.controller.LinearPlantInversionFeedforward_2_2';
import * as wpimath_controller_LinearPlantInversionFeedforward_3_2 from '../../blocks/generated/class_wpimath.controller.LinearPlantInversionFeedforward_3_2';
import * as wpimath_controller_LinearQuadraticRegulator_1_1 from '../../blocks/generated/class_wpimath.controller.LinearQuadraticRegulator_1_1';
import * as wpimath_controller_LinearQuadraticRegulator_2_1 from '../../blocks/generated/class_wpimath.controller.LinearQuadraticRegulator_2_1';
import * as wpimath_controller_LinearQuadraticRegulator_2_2 from '../../blocks/generated/class_wpimath.controller.LinearQuadraticRegulator_2_2';
import * as wpimath_controller_LinearQuadraticRegulator_3_2 from '../../blocks/generated/class_wpimath.controller.LinearQuadraticRegulator_3_2';
import * as wpimath_controller_PIDController from '../../blocks/generated/class_wpimath.controller.PIDController';
import * as wpimath_controller_ProfiledPIDController from '../../blocks/generated/class_wpimath.controller.ProfiledPIDController';
import * as wpimath_controller_ProfiledPIDControllerRadians from '../../blocks/generated/class_wpimath.controller.ProfiledPIDControllerRadians';
import * as wpimath_controller_RamseteController from '../../blocks/generated/class_wpimath.controller.RamseteController';
import * as wpimath_controller_SimpleMotorFeedforwardMeters from '../../blocks/generated/class_wpimath.controller.SimpleMotorFeedforwardMeters';
import * as wpimath_controller_SimpleMotorFeedforwardRadians from '../../blocks/generated/class_wpimath.controller.SimpleMotorFeedforwardRadians';
import * as wpimath_estimator from '../../blocks/generated/module_wpimath.estimator';
import * as wpimath_estimator_DifferentialDrivePoseEstimator from '../../blocks/generated/class_wpimath.estimator.DifferentialDrivePoseEstimator';
import * as wpimath_estimator_DifferentialDrivePoseEstimator3d from '../../blocks/generated/class_wpimath.estimator.DifferentialDrivePoseEstimator3d';
import * as wpimath_estimator_DifferentialDrivePoseEstimator3dBase from '../../blocks/generated/class_wpimath.estimator.DifferentialDrivePoseEstimator3dBase';
import * as wpimath_estimator_DifferentialDrivePoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.DifferentialDrivePoseEstimatorBase';
import * as wpimath_estimator_ExtendedKalmanFilter_1_1_1 from '../../blocks/generated/class_wpimath.estimator.ExtendedKalmanFilter_1_1_1';
import * as wpimath_estimator_ExtendedKalmanFilter_2_1_1 from '../../blocks/generated/class_wpimath.estimator.ExtendedKalmanFilter_2_1_1';
import * as wpimath_estimator_ExtendedKalmanFilter_2_2_2 from '../../blocks/generated/class_wpimath.estimator.ExtendedKalmanFilter_2_2_2';
import * as wpimath_estimator_KalmanFilter_1_1_1 from '../../blocks/generated/class_wpimath.estimator.KalmanFilter_1_1_1';
import * as wpimath_estimator_KalmanFilter_2_1_1 from '../../blocks/generated/class_wpimath.estimator.KalmanFilter_2_1_1';
import * as wpimath_estimator_KalmanFilter_2_2_2 from '../../blocks/generated/class_wpimath.estimator.KalmanFilter_2_2_2';
import * as wpimath_estimator_KalmanFilter_3_2_3 from '../../blocks/generated/class_wpimath.estimator.KalmanFilter_3_2_3';
import * as wpimath_estimator_MecanumDrivePoseEstimator from '../../blocks/generated/class_wpimath.estimator.MecanumDrivePoseEstimator';
import * as wpimath_estimator_MecanumDrivePoseEstimator3d from '../../blocks/generated/class_wpimath.estimator.MecanumDrivePoseEstimator3d';
import * as wpimath_estimator_MecanumDrivePoseEstimator3dBase from '../../blocks/generated/class_wpimath.estimator.MecanumDrivePoseEstimator3dBase';
import * as wpimath_estimator_MecanumDrivePoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.MecanumDrivePoseEstimatorBase';
import * as wpimath_estimator_SwerveDrive2PoseEstimator from '../../blocks/generated/class_wpimath.estimator.SwerveDrive2PoseEstimator';
import * as wpimath_estimator_SwerveDrive2PoseEstimator3d from '../../blocks/generated/class_wpimath.estimator.SwerveDrive2PoseEstimator3d';
import * as wpimath_estimator_SwerveDrive2PoseEstimator3dBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive2PoseEstimator3dBase';
import * as wpimath_estimator_SwerveDrive2PoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive2PoseEstimatorBase';
import * as wpimath_estimator_SwerveDrive3PoseEstimator from '../../blocks/generated/class_wpimath.estimator.SwerveDrive3PoseEstimator';
import * as wpimath_estimator_SwerveDrive3PoseEstimator3d from '../../blocks/generated/class_wpimath.estimator.SwerveDrive3PoseEstimator3d';
import * as wpimath_estimator_SwerveDrive3PoseEstimator3dBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive3PoseEstimator3dBase';
import * as wpimath_estimator_SwerveDrive3PoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive3PoseEstimatorBase';
import * as wpimath_estimator_SwerveDrive4PoseEstimator from '../../blocks/generated/class_wpimath.estimator.SwerveDrive4PoseEstimator';
import * as wpimath_estimator_SwerveDrive4PoseEstimator3d from '../../blocks/generated/class_wpimath.estimator.SwerveDrive4PoseEstimator3d';
import * as wpimath_estimator_SwerveDrive4PoseEstimator3dBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive4PoseEstimator3dBase';
import * as wpimath_estimator_SwerveDrive4PoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive4PoseEstimatorBase';
import * as wpimath_estimator_SwerveDrive6PoseEstimator from '../../blocks/generated/class_wpimath.estimator.SwerveDrive6PoseEstimator';
import * as wpimath_estimator_SwerveDrive6PoseEstimator3d from '../../blocks/generated/class_wpimath.estimator.SwerveDrive6PoseEstimator3d';
import * as wpimath_estimator_SwerveDrive6PoseEstimator3dBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive6PoseEstimator3dBase';
import * as wpimath_estimator_SwerveDrive6PoseEstimatorBase from '../../blocks/generated/class_wpimath.estimator.SwerveDrive6PoseEstimatorBase';
import * as wpimath_filter from '../../blocks/generated/module_wpimath.filter';
import * as wpimath_filter_Debouncer from '../../blocks/generated/class_wpimath.filter.Debouncer';
import * as wpimath_filter_LinearFilter from '../../blocks/generated/class_wpimath.filter.LinearFilter';
import * as wpimath_filter_MedianFilter from '../../blocks/generated/class_wpimath.filter.MedianFilter';
import * as wpimath_filter_SlewRateLimiter from '../../blocks/generated/class_wpimath.filter.SlewRateLimiter';
import * as wpimath_geometry from '../../blocks/generated/module_wpimath.geometry';
import * as wpimath_geometry_CoordinateAxis from '../../blocks/generated/class_wpimath.geometry.CoordinateAxis';
import * as wpimath_geometry_CoordinateSystem from '../../blocks/generated/class_wpimath.geometry.CoordinateSystem';
import * as wpimath_geometry_Ellipse2d from '../../blocks/generated/class_wpimath.geometry.Ellipse2d';
import * as wpimath_geometry_Pose2d from '../../blocks/generated/class_wpimath.geometry.Pose2d';
import * as wpimath_geometry_Pose3d from '../../blocks/generated/class_wpimath.geometry.Pose3d';
import * as wpimath_geometry_Quaternion from '../../blocks/generated/class_wpimath.geometry.Quaternion';
import * as wpimath_geometry_Rectangle2d from '../../blocks/generated/class_wpimath.geometry.Rectangle2d';
import * as wpimath_geometry_Rotation2d from '../../blocks/generated/class_wpimath.geometry.Rotation2d';
import * as wpimath_geometry_Rotation3d from '../../blocks/generated/class_wpimath.geometry.Rotation3d';
import * as wpimath_geometry_Transform2d from '../../blocks/generated/class_wpimath.geometry.Transform2d';
import * as wpimath_geometry_Transform3d from '../../blocks/generated/class_wpimath.geometry.Transform3d';
import * as wpimath_geometry_Translation2d from '../../blocks/generated/class_wpimath.geometry.Translation2d';
import * as wpimath_geometry_Translation3d from '../../blocks/generated/class_wpimath.geometry.Translation3d';
import * as wpimath_geometry_Twist2d from '../../blocks/generated/class_wpimath.geometry.Twist2d';
import * as wpimath_geometry_Twist3d from '../../blocks/generated/class_wpimath.geometry.Twist3d';
import * as wpimath_interpolation from '../../blocks/generated/module_wpimath.interpolation';
import * as wpimath_interpolation_TimeInterpolatableFloatBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableFloatBuffer';
import * as wpimath_interpolation_TimeInterpolatablePose2dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatablePose2dBuffer';
import * as wpimath_interpolation_TimeInterpolatablePose3dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatablePose3dBuffer';
import * as wpimath_interpolation_TimeInterpolatableRotation2dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableRotation2dBuffer';
import * as wpimath_interpolation_TimeInterpolatableRotation3dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableRotation3dBuffer';
import * as wpimath_interpolation_TimeInterpolatableTranslation2dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableTranslation2dBuffer';
import * as wpimath_interpolation_TimeInterpolatableTranslation3dBuffer from '../../blocks/generated/class_wpimath.interpolation.TimeInterpolatableTranslation3dBuffer';
import * as wpimath_kinematics from '../../blocks/generated/module_wpimath.kinematics';
import * as wpimath_kinematics_ChassisSpeeds from '../../blocks/generated/class_wpimath.kinematics.ChassisSpeeds';
import * as wpimath_kinematics_DifferentialDriveKinematics from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveKinematics';
import * as wpimath_kinematics_DifferentialDriveKinematicsBase from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveKinematicsBase';
import * as wpimath_kinematics_DifferentialDriveOdometry from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveOdometry';
import * as wpimath_kinematics_DifferentialDriveOdometry3d from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveOdometry3d';
import * as wpimath_kinematics_DifferentialDriveOdometry3dBase from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveOdometry3dBase';
import * as wpimath_kinematics_DifferentialDriveOdometryBase from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveOdometryBase';
import * as wpimath_kinematics_DifferentialDriveWheelPositions from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveWheelPositions';
import * as wpimath_kinematics_DifferentialDriveWheelSpeeds from '../../blocks/generated/class_wpimath.kinematics.DifferentialDriveWheelSpeeds';
import * as wpimath_kinematics_MecanumDriveKinematics from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveKinematics';
import * as wpimath_kinematics_MecanumDriveKinematicsBase from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveKinematicsBase';
import * as wpimath_kinematics_MecanumDriveOdometry from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveOdometry';
import * as wpimath_kinematics_MecanumDriveOdometry3d from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveOdometry3d';
import * as wpimath_kinematics_MecanumDriveOdometry3dBase from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveOdometry3dBase';
import * as wpimath_kinematics_MecanumDriveOdometryBase from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveOdometryBase';
import * as wpimath_kinematics_MecanumDriveWheelPositions from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveWheelPositions';
import * as wpimath_kinematics_MecanumDriveWheelSpeeds from '../../blocks/generated/class_wpimath.kinematics.MecanumDriveWheelSpeeds';
import * as wpimath_kinematics_SwerveDrive2Kinematics from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2Kinematics';
import * as wpimath_kinematics_SwerveDrive2KinematicsBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2KinematicsBase';
import * as wpimath_kinematics_SwerveDrive2Odometry from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2Odometry';
import * as wpimath_kinematics_SwerveDrive2Odometry3d from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2Odometry3d';
import * as wpimath_kinematics_SwerveDrive2Odometry3dBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2Odometry3dBase';
import * as wpimath_kinematics_SwerveDrive2OdometryBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive2OdometryBase';
import * as wpimath_kinematics_SwerveDrive3Kinematics from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3Kinematics';
import * as wpimath_kinematics_SwerveDrive3KinematicsBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3KinematicsBase';
import * as wpimath_kinematics_SwerveDrive3Odometry from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3Odometry';
import * as wpimath_kinematics_SwerveDrive3Odometry3d from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3Odometry3d';
import * as wpimath_kinematics_SwerveDrive3Odometry3dBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3Odometry3dBase';
import * as wpimath_kinematics_SwerveDrive3OdometryBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive3OdometryBase';
import * as wpimath_kinematics_SwerveDrive4Kinematics from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4Kinematics';
import * as wpimath_kinematics_SwerveDrive4KinematicsBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4KinematicsBase';
import * as wpimath_kinematics_SwerveDrive4Odometry from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4Odometry';
import * as wpimath_kinematics_SwerveDrive4Odometry3d from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4Odometry3d';
import * as wpimath_kinematics_SwerveDrive4Odometry3dBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4Odometry3dBase';
import * as wpimath_kinematics_SwerveDrive4OdometryBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive4OdometryBase';
import * as wpimath_kinematics_SwerveDrive6Kinematics from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6Kinematics';
import * as wpimath_kinematics_SwerveDrive6KinematicsBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6KinematicsBase';
import * as wpimath_kinematics_SwerveDrive6Odometry from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6Odometry';
import * as wpimath_kinematics_SwerveDrive6Odometry3d from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6Odometry3d';
import * as wpimath_kinematics_SwerveDrive6Odometry3dBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6Odometry3dBase';
import * as wpimath_kinematics_SwerveDrive6OdometryBase from '../../blocks/generated/class_wpimath.kinematics.SwerveDrive6OdometryBase';
import * as wpimath_kinematics_SwerveModulePosition from '../../blocks/generated/class_wpimath.kinematics.SwerveModulePosition';
import * as wpimath_kinematics_SwerveModuleState from '../../blocks/generated/class_wpimath.kinematics.SwerveModuleState';
import * as wpimath_optimization from '../../blocks/generated/module_wpimath.optimization';
import * as wpimath_optimization_SimulatedAnnealing from '../../blocks/generated/class_wpimath.optimization.SimulatedAnnealing';
import * as wpimath_path from '../../blocks/generated/module_wpimath.path';
import * as wpimath_path_TravelingSalesman from '../../blocks/generated/class_wpimath.path.TravelingSalesman';
import * as wpimath_spline from '../../blocks/generated/module_wpimath.spline';
import * as wpimath_spline_CubicHermiteSpline from '../../blocks/generated/class_wpimath.spline.CubicHermiteSpline';
import * as wpimath_spline_QuinticHermiteSpline from '../../blocks/generated/class_wpimath.spline.QuinticHermiteSpline';
import * as wpimath_spline_Spline3 from '../../blocks/generated/class_wpimath.spline.Spline3';
import * as wpimath_spline_Spline3_ControlVector from '../../blocks/generated/class_wpimath.spline.Spline3.ControlVector';
import * as wpimath_spline_Spline5 from '../../blocks/generated/class_wpimath.spline.Spline5';
import * as wpimath_spline_Spline5_ControlVector from '../../blocks/generated/class_wpimath.spline.Spline5.ControlVector';
import * as wpimath_spline_SplineHelper from '../../blocks/generated/class_wpimath.spline.SplineHelper';
import * as wpimath_spline_SplineParameterizer from '../../blocks/generated/class_wpimath.spline.SplineParameterizer';
import * as wpimath_system from '../../blocks/generated/module_wpimath.system';
import * as wpimath_system_LinearSystemLoop_1_1_1 from '../../blocks/generated/class_wpimath.system.LinearSystemLoop_1_1_1';
import * as wpimath_system_LinearSystemLoop_2_1_1 from '../../blocks/generated/class_wpimath.system.LinearSystemLoop_2_1_1';
import * as wpimath_system_LinearSystemLoop_2_2_2 from '../../blocks/generated/class_wpimath.system.LinearSystemLoop_2_2_2';
import * as wpimath_system_LinearSystemLoop_3_2_3 from '../../blocks/generated/class_wpimath.system.LinearSystemLoop_3_2_3';
import * as wpimath_system_LinearSystem_1_1_1 from '../../blocks/generated/class_wpimath.system.LinearSystem_1_1_1';
import * as wpimath_system_LinearSystem_1_1_2 from '../../blocks/generated/class_wpimath.system.LinearSystem_1_1_2';
import * as wpimath_system_LinearSystem_1_1_3 from '../../blocks/generated/class_wpimath.system.LinearSystem_1_1_3';
import * as wpimath_system_LinearSystem_2_1_1 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_1_1';
import * as wpimath_system_LinearSystem_2_1_2 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_1_2';
import * as wpimath_system_LinearSystem_2_1_3 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_1_3';
import * as wpimath_system_LinearSystem_2_2_1 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_2_1';
import * as wpimath_system_LinearSystem_2_2_2 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_2_2';
import * as wpimath_system_LinearSystem_2_2_3 from '../../blocks/generated/class_wpimath.system.LinearSystem_2_2_3';
import * as wpimath_system_LinearSystem_3_2_1 from '../../blocks/generated/class_wpimath.system.LinearSystem_3_2_1';
import * as wpimath_system_LinearSystem_3_2_2 from '../../blocks/generated/class_wpimath.system.LinearSystem_3_2_2';
import * as wpimath_system_LinearSystem_3_2_3 from '../../blocks/generated/class_wpimath.system.LinearSystem_3_2_3';
import * as wpimath_system_plant from '../../blocks/generated/module_wpimath.system.plant';
import * as wpimath_system_plant_DCMotor from '../../blocks/generated/class_wpimath.system.plant.DCMotor';
import * as wpimath_system_plant_LinearSystemId from '../../blocks/generated/class_wpimath.system.plant.LinearSystemId';
import * as wpimath_trajectory from '../../blocks/generated/module_wpimath.trajectory';
import * as wpimath_trajectory_ExponentialProfileMeterVolts from '../../blocks/generated/class_wpimath.trajectory.ExponentialProfileMeterVolts';
import * as wpimath_trajectory_ExponentialProfileMeterVolts_Constraints from '../../blocks/generated/class_wpimath.trajectory.ExponentialProfileMeterVolts.Constraints';
import * as wpimath_trajectory_ExponentialProfileMeterVolts_ProfileTiming from '../../blocks/generated/class_wpimath.trajectory.ExponentialProfileMeterVolts.ProfileTiming';
import * as wpimath_trajectory_ExponentialProfileMeterVolts_State from '../../blocks/generated/class_wpimath.trajectory.ExponentialProfileMeterVolts.State';
import * as wpimath_trajectory_Trajectory from '../../blocks/generated/class_wpimath.trajectory.Trajectory';
import * as wpimath_trajectory_Trajectory_State from '../../blocks/generated/class_wpimath.trajectory.Trajectory.State';
import * as wpimath_trajectory_TrajectoryConfig from '../../blocks/generated/class_wpimath.trajectory.TrajectoryConfig';
import * as wpimath_trajectory_TrajectoryGenerator from '../../blocks/generated/class_wpimath.trajectory.TrajectoryGenerator';
import * as wpimath_trajectory_TrajectoryParameterizer from '../../blocks/generated/class_wpimath.trajectory.TrajectoryParameterizer';
import * as wpimath_trajectory_TrajectoryUtil from '../../blocks/generated/class_wpimath.trajectory.TrajectoryUtil';
import * as wpimath_trajectory_TrapezoidProfile from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfile';
import * as wpimath_trajectory_TrapezoidProfile_Constraints from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfile.Constraints';
import * as wpimath_trajectory_TrapezoidProfile_State from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfile.State';
import * as wpimath_trajectory_TrapezoidProfileRadians from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfileRadians';
import * as wpimath_trajectory_TrapezoidProfileRadians_Constraints from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfileRadians.Constraints';
import * as wpimath_trajectory_TrapezoidProfileRadians_State from '../../blocks/generated/class_wpimath.trajectory.TrapezoidProfileRadians.State';
import * as wpimath_trajectory_constraint from '../../blocks/generated/module_wpimath.trajectory.constraint';
import * as wpimath_trajectory_constraint_CentripetalAccelerationConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.CentripetalAccelerationConstraint';
import * as wpimath_trajectory_constraint_DifferentialDriveKinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.DifferentialDriveKinematicsConstraint';
import * as wpimath_trajectory_constraint_DifferentialDriveVoltageConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.DifferentialDriveVoltageConstraint';
import * as wpimath_trajectory_constraint_EllipticalRegionConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.EllipticalRegionConstraint';
import * as wpimath_trajectory_constraint_MaxVelocityConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.MaxVelocityConstraint';
import * as wpimath_trajectory_constraint_MecanumDriveKinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.MecanumDriveKinematicsConstraint';
import * as wpimath_trajectory_constraint_RectangularRegionConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.RectangularRegionConstraint';
import * as wpimath_trajectory_constraint_SwerveDrive2KinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.SwerveDrive2KinematicsConstraint';
import * as wpimath_trajectory_constraint_SwerveDrive3KinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.SwerveDrive3KinematicsConstraint';
import * as wpimath_trajectory_constraint_SwerveDrive4KinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.SwerveDrive4KinematicsConstraint';
import * as wpimath_trajectory_constraint_SwerveDrive6KinematicsConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.SwerveDrive6KinematicsConstraint';
import * as wpimath_trajectory_constraint_TrajectoryConstraint from '../../blocks/generated/class_wpimath.trajectory.constraint.TrajectoryConstraint';
import * as wpimath_trajectory_constraint_TrajectoryConstraint_MinMax from '../../blocks/generated/class_wpimath.trajectory.constraint.TrajectoryConstraint.MinMax';
import * as wpimath_units from '../../blocks/generated/module_wpimath.units';

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
      hal_exceptions.getToolboxCategory([
        hal_exceptions_HALError.getToolboxCategory([]),
      ]),
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
      wpilib_Alert.getToolboxCategory([]),
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
      wpilib_LEDPattern.getToolboxCategory([
        wpilib_LEDPattern_LEDReader.getToolboxCategory([]),
      ]),
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
      wpilib_SharpIR.getToolboxCategory([]),
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
      wpilib_cameraserver.getToolboxCategory([
        wpilib_cameraserver_CameraServer.getToolboxCategory([]),
      ]),
      wpilib_counter.getToolboxCategory([
        wpilib_counter_ExternalDirectionCounter.getToolboxCategory([]),
        wpilib_counter_Tachometer.getToolboxCategory([]),
        wpilib_counter_UpDownCounter.getToolboxCategory([]),
      ]),
      wpilib_drive.getToolboxCategory([
        wpilib_drive_DifferentialDrive.getToolboxCategory([
          wpilib_drive_DifferentialDrive_WheelSpeeds.getToolboxCategory([]),
        ]),
        wpilib_drive_MecanumDrive.getToolboxCategory([
          wpilib_drive_MecanumDrive_WheelSpeeds.getToolboxCategory([]),
        ]),
        wpilib_drive_RobotDriveBase.getToolboxCategory([]),
      ]),
      wpilib_event.getToolboxCategory([
        wpilib_event_BooleanEvent.getToolboxCategory([]),
        wpilib_event_EventLoop.getToolboxCategory([]),
        wpilib_event_NetworkBooleanEvent.getToolboxCategory([]),
      ]),
      wpilib_interfaces.getToolboxCategory([
        wpilib_interfaces_CounterBase.getToolboxCategory([]),
        wpilib_interfaces_GenericHID.getToolboxCategory([]),
        wpilib_interfaces_MotorController.getToolboxCategory([]),
      ]),
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
        wpilib_simulation_SendableChooserSim.getToolboxCategory([]),
        wpilib_simulation_SharpIRSim.getToolboxCategory([]),
        wpilib_simulation_SimDeviceSim.getToolboxCategory([]),
        wpilib_simulation_SingleJointedArmSim.getToolboxCategory([]),
        wpilib_simulation_SolenoidSim.getToolboxCategory([]),
        wpilib_simulation_StadiaControllerSim.getToolboxCategory([]),
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
      wpimath_controller.getToolboxCategory([
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
      ]),
      wpimath_estimator.getToolboxCategory([
        wpimath_estimator_DifferentialDrivePoseEstimator.getToolboxCategory([]),
        wpimath_estimator_DifferentialDrivePoseEstimator3d.getToolboxCategory([]),
        wpimath_estimator_DifferentialDrivePoseEstimator3dBase.getToolboxCategory([]),
        wpimath_estimator_DifferentialDrivePoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_ExtendedKalmanFilter_1_1_1.getToolboxCategory([]),
        wpimath_estimator_ExtendedKalmanFilter_2_1_1.getToolboxCategory([]),
        wpimath_estimator_ExtendedKalmanFilter_2_2_2.getToolboxCategory([]),
        wpimath_estimator_KalmanFilter_1_1_1.getToolboxCategory([]),
        wpimath_estimator_KalmanFilter_2_1_1.getToolboxCategory([]),
        wpimath_estimator_KalmanFilter_2_2_2.getToolboxCategory([]),
        wpimath_estimator_KalmanFilter_3_2_3.getToolboxCategory([]),
        wpimath_estimator_MecanumDrivePoseEstimator.getToolboxCategory([]),
        wpimath_estimator_MecanumDrivePoseEstimator3d.getToolboxCategory([]),
        wpimath_estimator_MecanumDrivePoseEstimator3dBase.getToolboxCategory([]),
        wpimath_estimator_MecanumDrivePoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive2PoseEstimator.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive2PoseEstimator3d.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive2PoseEstimator3dBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive2PoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive3PoseEstimator.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive3PoseEstimator3d.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive3PoseEstimator3dBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive3PoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive4PoseEstimator.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive4PoseEstimator3d.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive4PoseEstimator3dBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive4PoseEstimatorBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive6PoseEstimator.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive6PoseEstimator3d.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive6PoseEstimator3dBase.getToolboxCategory([]),
        wpimath_estimator_SwerveDrive6PoseEstimatorBase.getToolboxCategory([]),
      ]),
      wpimath_filter.getToolboxCategory([
        wpimath_filter_Debouncer.getToolboxCategory([]),
        wpimath_filter_LinearFilter.getToolboxCategory([]),
        wpimath_filter_MedianFilter.getToolboxCategory([]),
        wpimath_filter_SlewRateLimiter.getToolboxCategory([]),
      ]),
      wpimath_geometry.getToolboxCategory([
        wpimath_geometry_CoordinateAxis.getToolboxCategory([]),
        wpimath_geometry_CoordinateSystem.getToolboxCategory([]),
        wpimath_geometry_Ellipse2d.getToolboxCategory([]),
        wpimath_geometry_Pose2d.getToolboxCategory([]),
        wpimath_geometry_Pose3d.getToolboxCategory([]),
        wpimath_geometry_Quaternion.getToolboxCategory([]),
        wpimath_geometry_Rectangle2d.getToolboxCategory([]),
        wpimath_geometry_Rotation2d.getToolboxCategory([]),
        wpimath_geometry_Rotation3d.getToolboxCategory([]),
        wpimath_geometry_Transform2d.getToolboxCategory([]),
        wpimath_geometry_Transform3d.getToolboxCategory([]),
        wpimath_geometry_Translation2d.getToolboxCategory([]),
        wpimath_geometry_Translation3d.getToolboxCategory([]),
        wpimath_geometry_Twist2d.getToolboxCategory([]),
        wpimath_geometry_Twist3d.getToolboxCategory([]),
      ]),
      wpimath_interpolation.getToolboxCategory([
        wpimath_interpolation_TimeInterpolatableFloatBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatablePose2dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatablePose3dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatableRotation2dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatableRotation3dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatableTranslation2dBuffer.getToolboxCategory([]),
        wpimath_interpolation_TimeInterpolatableTranslation3dBuffer.getToolboxCategory([]),
      ]),
      wpimath_kinematics.getToolboxCategory([
        wpimath_kinematics_ChassisSpeeds.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveKinematics.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveKinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveOdometry.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveOdometry3d.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveOdometry3dBase.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveOdometryBase.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveWheelPositions.getToolboxCategory([]),
        wpimath_kinematics_DifferentialDriveWheelSpeeds.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveKinematics.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveKinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveOdometry.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveOdometry3d.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveOdometry3dBase.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveOdometryBase.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveWheelPositions.getToolboxCategory([]),
        wpimath_kinematics_MecanumDriveWheelSpeeds.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2Kinematics.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2KinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2Odometry.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2Odometry3d.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2Odometry3dBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive2OdometryBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3Kinematics.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3KinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3Odometry.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3Odometry3d.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3Odometry3dBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive3OdometryBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4Kinematics.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4KinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4Odometry.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4Odometry3d.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4Odometry3dBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive4OdometryBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6Kinematics.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6KinematicsBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6Odometry.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6Odometry3d.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6Odometry3dBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveDrive6OdometryBase.getToolboxCategory([]),
        wpimath_kinematics_SwerveModulePosition.getToolboxCategory([]),
        wpimath_kinematics_SwerveModuleState.getToolboxCategory([]),
      ]),
      wpimath_optimization.getToolboxCategory([
        wpimath_optimization_SimulatedAnnealing.getToolboxCategory([]),
      ]),
      wpimath_path.getToolboxCategory([
        wpimath_path_TravelingSalesman.getToolboxCategory([]),
      ]),
      wpimath_spline.getToolboxCategory([
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
      ]),
      wpimath_system.getToolboxCategory([
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
        wpimath_system_plant.getToolboxCategory([
          wpimath_system_plant_DCMotor.getToolboxCategory([]),
          wpimath_system_plant_LinearSystemId.getToolboxCategory([]),
        ]),
      ]),
      wpimath_trajectory.getToolboxCategory([
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
        wpimath_trajectory_constraint.getToolboxCategory([
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
        ]),
      ]),
      wpimath_units.getToolboxCategory([]),
    ]),
  ];
}
