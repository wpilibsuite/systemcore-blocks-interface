# Copyright (c) FIRST and other WPILib contributors.

"""A Spark Max that can be set up one setting at a time.

The settings of a rev.SparkMax, like its idle mode, current limit, and PID gains, are changed by
building a rev.SparkMaxConfig and passing it to configure. That is hard to do with blocks, so each
setter here builds a config with just its own setting and sends it to the Spark Max.

The settings come from the robot code every time it starts: the constructor resets the Spark Max
to its default settings, and the settings are not saved on the Spark Max. Each setter waits for the
Spark Max to answer, so call them when the robot starts, not every time the robot loops.

Each SparkMax remembers the settings that its setters have sent, so that copy_settings_from can
give another SparkMax the same settings.
"""

# Python Standard Library
import typing

# robotpy
import rev
import wpilib


class SparkMax(rev.SparkMax):
  """A REV Robotics Spark Max motor controller, on one of the Systemcore's CAN buses."""

  def __init__(self, can_port: wpilib.CANPort, device_id: int,
               type: rev.SparkLowLevel.MotorType) -> None:
    """Creates a Spark Max and resets it to its default settings, so that it only has the
    settings that the robot code gives it.

    :param can_port:  The CAN bus that the Spark Max is connected to.
    :param device_id: The CAN device id of the Spark Max.
    :param type:      The kind of motor connected to the Spark Max. NEO motors are brushless.
    """
    super().__init__(can_port, device_id, type)
    # The settings that the setters have sent, for copy_settings_from. Only the settings that have
    # been set are in it, since the rest are the defaults that the constructor resets them to.
    self._settings = rev.SparkMaxConfig()
    self._configure(rev.SparkMaxConfig(), rev.ResetMode.RESET_SAFE_PARAMETERS)

  def _configure(self, config: rev.SparkMaxConfig,
                 reset_mode: rev.ResetMode = rev.ResetMode.NO_RESET_SAFE_PARAMETERS,
                 remember: bool = True) -> None:
    # Settings that the config doesn't set are left the way they are, so each setter only changes
    # its own setting.
    if remember:
      self._settings.apply(config)
    error = self.configure(config, reset_mode, rev.PersistMode.NO_PERSIST_PARAMETERS)
    if error != rev.REVLibError.OK:
      wpilib.report_warning(
          f'Spark Max {self.get_device_id()} could not be configured: {error.name}')

  def set_idle_mode(self, idle_mode: rev.SparkBaseConfig.IdleMode) -> None:
    """Sets what the motor does when it is stopped: BRAKE holds it in place, COAST lets it spin
    freely.

    :param idle_mode: BRAKE or COAST.
    """
    config = rev.SparkMaxConfig()
    config.set_idle_mode(idle_mode)
    self._configure(config)

  def set_current_limit(self, amps: int) -> None:
    """Limits the current that the motor can draw, which protects the motor and keeps it from
    browning out the robot. This is REVLib's smart_current_limit (smartCurrentLimit in Java and
    C++), which only works with brushless motors. The default is 80 amps, which is too much for a NEO 550: 40 amps is common for a NEO
    and 20 amps for a NEO 550.

    :param amps: The most current the motor can draw, in amps.
    """
    config = rev.SparkMaxConfig()
    config.smart_current_limit(amps)
    self._configure(config)

  def set_ramp_rate(self, seconds: float) -> None:
    """Sets how long the motor takes to go from stopped to full power, so that it doesn't jerk.
    This sets both of REVLib's open_loop_ramp_rate and closed_loop_ramp_rate (openLoopRampRate
    and closedLoopRampRate in Java and C++).

    :param seconds: The time from stopped to full power, in seconds. 0 turns ramping off.
    """
    config = rev.SparkMaxConfig()
    config.open_loop_ramp_rate(seconds)
    config.closed_loop_ramp_rate(seconds)
    self._configure(config)

  def set_voltage_compensation(self, volts: float) -> None:
    """Makes the motor run the same no matter how charged the battery is. Throttle and PID
    outputs are a fraction of the given voltage instead of a fraction of the battery voltage, so
    with 12 volts, a throttle of 0.5 is 6 volts. 12 volts is common.

    :param volts: The voltage that a throttle of 1.0 means, in volts. 0 turns voltage
                  compensation off.
    """
    config = rev.SparkMaxConfig()
    if volts > 0:
      config.voltage_compensation(volts)
    else:
      config.disable_voltage_compensation()
    self._configure(config)

  def set_pid(self, p: float, i: float, d: float,
              slot: rev.ClosedLoopSlot = rev.ClosedLoopSlot.SLOT0) -> None:
    """Sets the PID gains that set_velocity_setpoint and set_relative_position_setpoint use to reach their target.
    Each slot has its own gains, so a mechanism can switch between sets of gains, like one for
    moving and one for holding still.

    :param p:    The proportional gain.
    :param i:    The integral gain.
    :param d:    The derivative gain.
    :param slot: The closed loop slot to set the gains for, SLOT0 to SLOT3. set_velocity_setpoint and
                 set_relative_position_setpoint choose the slot to use.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.pid(p, i, d, slot)
    self._configure(config)

  def set_feedforward(self, s: float, v: float, a: float,
                      slot: rev.ClosedLoopSlot = rev.ClosedLoopSlot.SLOT0) -> None:
    """Sets the feedforward gains that set_velocity_setpoint and set_relative_position_setpoint add to the PID
    output. Feedforward gives the motor the voltage that the target needs right away, so PID only
    has to fix what's left, which makes reaching a velocity much faster and steadier. This is
    REVLib's closed_loop.feed_forward.sva (closedLoop.feedForward.sva in Java and C++), which
    sets kS, kV, and kA.

    :param s: The voltage it takes to start the motor moving, in volts.
    :param v: The voltage for each RPM of velocity, in volts per RPM.
    :param a: The voltage for each RPM per second of acceleration, in volts per RPM per second.
    :param slot: The closed loop slot to set it for, SLOT0 to SLOT3. set_velocity_setpoint and
                 set_relative_position_setpoint choose the slot to use.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.feed_forward.sva(s, v, a, slot)
    self._configure(config)

  def set_velocity_feedforward(
      self, v: float, slot: rev.ClosedLoopSlot = rev.ClosedLoopSlot.SLOT0) -> None:
    """Sets only the velocity feedforward gain (kV), which set_velocity_setpoint adds to the PID output,
    leaving the other feedforward gains the way they are. It isn't used by
    set_relative_position_setpoint. This is REVLib's closed_loop.feed_forward.v
    (closedLoop.feedForward.kV in Java and C++).

    :param v:    The voltage for each RPM of velocity, in volts per RPM.
    :param slot: The closed loop slot to set it for, SLOT0 to SLOT3. set_velocity_setpoint and
                 set_relative_position_setpoint choose the slot to use.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.feed_forward.v(v, slot)
    self._configure(config)

  def set_gravity_feedforward(
      self, g: float, slot: rev.ClosedLoopSlot = rev.ClosedLoopSlot.SLOT0) -> None:
    """Sets the voltage that holds an elevator up against gravity, which set_velocity_setpoint and
    set_relative_position_setpoint add to the PID output. This is REVLib's
    closed_loop.feed_forward.g (closedLoop.feedForward.kG in Java and C++).

    :param g: The voltage it takes to hold the elevator still, in volts.
    :param slot: The closed loop slot to set it for, SLOT0 to SLOT3. set_velocity_setpoint and
                 set_relative_position_setpoint choose the slot to use.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.feed_forward.g(g, slot)
    self._configure(config)

  def set_output_range(self, min_output: float, max_output: float,
                       slot: rev.ClosedLoopSlot = rev.ClosedLoopSlot.SLOT0) -> None:
    """Limits how hard set_velocity_setpoint and set_relative_position_setpoint can drive the motor, which is
    useful while tuning PID on a new mechanism. The default is -1 to 1.

    :param min_output: The lowest output, from -1 to 1.
    :param max_output: The highest output, from -1 to 1.
    :param slot:       The closed loop slot to set it for, SLOT0 to SLOT3. set_velocity_setpoint and
                       set_relative_position_setpoint choose the slot to use.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.output_range(min_output, max_output, slot)
    self._configure(config)

  def set_allowed_closed_loop_error(
      self, allowed_error: float, slot: rev.ClosedLoopSlot = rev.ClosedLoopSlot.SLOT0) -> None:
    """Sets how close the motor has to be to the target of set_velocity_setpoint or set_relative_position_setpoint
    for is_at_setpoint to be true. This is REVLib's closed_loop.allowed_closed_loop_error
    (closedLoop.allowedClosedLoopError in Java and C++), the tolerance of the setpoint.

    :param allowed_error: How close is close enough, in rotations for a position or RPM for a
                          velocity.
    :param slot:          The closed loop slot to set it for, SLOT0 to SLOT3. set_velocity_setpoint and
                          set_relative_position_setpoint choose the slot to use.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.allowed_closed_loop_error(allowed_error, slot)
    self._configure(config)

  def set_soft_limits(self, reverse_limit: float, forward_limit: float) -> None:
    """Keeps the motor between two encoder positions, so that an arm or elevator can't be driven
    past the end of its travel. The Spark Max stops the motor itself, whatever the robot code
    tells it to do.

    :param reverse_limit: The lowest position, in rotations.
    :param forward_limit: The highest position, in rotations.
    """
    config = rev.SparkMaxConfig()
    (config.soft_limit
        .reverse_soft_limit(reverse_limit).reverse_soft_limit_enabled(True)
        .forward_soft_limit(forward_limit).forward_soft_limit_enabled(True))
    self._configure(config)

  def disable_soft_limits(self) -> None:
    """Lets the motor move to any position again, after set_soft_limits. This turns off REVLib's
    soft_limit.forward_soft_limit_enabled and reverse_soft_limit_enabled
    (softLimit.forwardSoftLimitEnabled and reverseSoftLimitEnabled in Java and C++)."""
    config = rev.SparkMaxConfig()
    config.soft_limit.reverse_soft_limit_enabled(False).forward_soft_limit_enabled(False)
    self._configure(config)

  def set_encoder_velocity_filter(self, average_depth: int, measurement_period_ms: int) -> None:
    """Sets how the Spark Max calculates the velocity of the encoder, which get_encoder_velocity
    and set_velocity_setpoint use. The velocity is the change in position over the measurement period,
    averaged over the last average_depth measurements. Smaller values make the velocity react
    faster but be noisier. These are REVLib's encoder.quadrature_average_depth and
    quadrature_measurement_period (encoder.quadratureAverageDepth and quadratureMeasurementPeriod
    in Java and C++).

    :param average_depth:         How many measurements to average, from 1 to 64. The default
                                  is 8.
    :param measurement_period_ms: The time to measure the change in position over, in
                                  milliseconds, from 1 to 100. The default is 10.
    """
    config = rev.SparkMaxConfig()
    (config.encoder
        .quadrature_average_depth(average_depth)
        .quadrature_measurement_period(measurement_period_ms))
    self._configure(config)

  def set_feedback_sensor(self, sensor: rev.FeedbackSensor) -> None:
    """Chooses the sensor that set_velocity_setpoint and set_relative_position_setpoint use to
    measure the motor. The default is PRIMARY_ENCODER, the encoder in a brushless motor or the
    encoder on the main port of a brushed motor. ABSOLUTE_ENCODER is an absolute encoder on the
    data port, like a Through Bore Encoder on an arm, which knows its position when the robot
    starts; read it with get_absolute_encoder_position. This is REVLib's
    closed_loop.set_feedback_sensor (closedLoop.feedbackSensor in Java and C++).

    CAN detached encoders (DETACHED_ABSOLUTE_ENCODER and DETACHED_RELATIVE_ENCODER) can't be
    chosen with this block, because they need the device id of the encoder.

    :param sensor: The sensor to use, like PRIMARY_ENCODER or ABSOLUTE_ENCODER.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.set_feedback_sensor(sensor)
    self._configure(config)

  def follow(self, leader: typing.Self, invert: bool = False) -> None:
    """Makes this Spark Max do whatever another Spark Max does, for motors that drive the same
    mechanism.

    :param leader: The Spark Max to follow.
    :param invert: Whether to turn the opposite way from the leader.
    """
    config = rev.SparkMaxConfig()
    config.follow(leader, invert)
    # Following isn't copied by copy_settings_from, since a copy of it would make the other Spark
    # Max follow this one's leader.
    self._configure(config, remember=False)

  def copy_settings_from(self, other: typing.Self) -> None:
    """Gives this Spark Max all of the settings that another Spark Max has been given, like its
    idle mode, current limit, and PID gains, so that a group of motors can be set up by setting
    up one of them. Settings that the other Spark Max hasn't been given stay the way they are on
    this one. Which Spark Max it follows isn't copied, and neither is set_inverted, since motors
    in a group often turn opposite ways.

    :param other: The Spark Max to copy the settings of.
    """
    config = rev.SparkMaxConfig()
    config.apply(other._settings)
    self._configure(config)

  def set_velocity_setpoint(
      self, velocity: float, slot: rev.ClosedLoopSlot = rev.ClosedLoopSlot.SLOT0) -> None:
    """Spins the motor at the given speed, using the PID gains from set_pid. This is REVLib's
    get_closed_loop_controller().set_setpoint with ControlType.VELOCITY
    (getClosedLoopController().setSetpoint with ControlType.kVelocity in Java and C++).

    :param velocity: The speed, in rotations per minute.
    :param slot:     The closed loop slot whose gains and settings to use, SLOT0 to SLOT3.
    """
    self.get_closed_loop_controller().set_setpoint(
        velocity, rev.SparkLowLevel.ControlType.VELOCITY, slot)

  def set_relative_position_setpoint(
      self, position: float, slot: rev.ClosedLoopSlot = rev.ClosedLoopSlot.SLOT0) -> None:
    """Turns the motor to the given position, using the PID gains from set_pid. This is REVLib's
    get_closed_loop_controller().set_setpoint with ControlType.POSITION
    (getClosedLoopController().setSetpoint with ControlType.kPosition in Java and C++).

    :param position: The position, in rotations, measured from where the encoder was zeroed.
    :param slot:     The closed loop slot whose gains and settings to use, SLOT0 to SLOT3.
    """
    self.get_closed_loop_controller().set_setpoint(
        position, rev.SparkLowLevel.ControlType.POSITION, slot)

  def is_at_setpoint(self) -> bool:
    """Returns whether the motor has reached the target of set_velocity_setpoint or
    set_relative_position_setpoint, within the error allowed by set_allowed_closed_loop_error."""
    return self.get_closed_loop_controller().is_at_setpoint().get()

  def get_relative_encoder_position(self) -> float:
    """Returns the position of the motor, in rotations, measured from where the encoder was
    zeroed. This is REVLib's get_encoder().get_position() (getEncoder().getPosition() in Java and
    C++)."""
    return self.get_encoder().get_position().get()

  def set_relative_encoder_position(self, position: float) -> None:
    """Changes the position that the encoder reports, without moving the motor. 0 zeroes it.
    This is REVLib's get_encoder().set_position() (getEncoder().setPosition() in Java and C++).

    :param position: The new position, in rotations.
    """
    self.get_encoder().set_position(position)

  def get_encoder_velocity(self) -> float:
    """Returns the speed of the motor, in rotations per minute. This is REVLib's
    get_encoder().get_velocity() (getEncoder().getVelocity() in Java and C++)."""
    return self.get_encoder().get_velocity().get()

  def get_absolute_encoder_position(self) -> float:
    """Returns the position of the absolute encoder on the data port, in rotations, from 0 to 1.
    Unlike the motor's encoder, it knows its position when the robot starts. This is REVLib's
    get_absolute_encoder().get_position() (getAbsoluteEncoder().getPosition() in Java and
    C++)."""
    return self.get_absolute_encoder().get_position().get()

  def get_absolute_encoder_velocity(self) -> float:
    """Returns the speed of the absolute encoder on the data port, in rotations per second (not
    rotations per minute, like get_encoder_velocity). This is REVLib's
    get_absolute_encoder().get_velocity() (getAbsoluteEncoder().getVelocity() in Java and
    C++)."""
    return self.get_absolute_encoder().get_velocity().get()

  def get_motor_current(self) -> float:
    """Returns the current that the motor is drawing, in amps. This is REVLib's
    get_output_current() (getOutputCurrent() in Java and C++)."""
    return self.get_output_current().get()

  # These replace the rev.SparkMax methods with the same names, which return a Signal that holds
  # the value.

  def get_motor_temperature(self) -> float:
    """Returns the temperature of the motor, in degrees Celsius."""
    return super().get_motor_temperature().get()

  def get_bus_voltage(self) -> float:
    """Returns the voltage that the Spark Max is getting from the battery, in volts."""
    return super().get_bus_voltage().get()

  def get_applied_output(self) -> float:
    """Returns how hard the Spark Max is driving the motor, from -1 to 1."""
    return super().get_applied_output().get()

  def has_active_fault(self) -> bool:
    """Returns whether the Spark Max has a fault right now, like the motor overheating."""
    return super().has_active_fault().get()

  def is_forward_limit_switch_pressed(self) -> bool:
    """Returns whether the limit switch at the forward end of the motor's travel, wired to the
    Spark Max's data port, is pressed. A pressed limit switch stops the motor going that way.
    This is REVLib's get_forward_limit_switch().get() (getForwardLimitSwitch().isPressed() in Java and
    C++)."""
    return self.get_forward_limit_switch().get().get()

  def is_reverse_limit_switch_pressed(self) -> bool:
    """Returns whether the limit switch at the reverse end of the motor's travel, wired to the
    Spark Max's data port, is pressed. A pressed limit switch stops the motor going that way.
    This is REVLib's get_reverse_limit_switch().get() (getReverseLimitSwitch().isPressed() in Java and
    C++)."""
    return self.get_reverse_limit_switch().get().get()
