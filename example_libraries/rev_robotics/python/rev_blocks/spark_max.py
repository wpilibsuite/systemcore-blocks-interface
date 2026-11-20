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
    browning out the robot. This is REV's smart current limit, which only works with brushless
    motors. The default is 80 amps, which is too much for a NEO 550: 40 amps is common for a NEO
    and 20 amps for a NEO 550.

    :param amps: The most current the motor can draw, in amps.
    """
    config = rev.SparkMaxConfig()
    config.smart_current_limit(amps)
    self._configure(config)

  def set_ramp_rate(self, seconds: float) -> None:
    """Sets how long the motor takes to go from stopped to full power, so that it doesn't jerk.

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

  def set_pid(self, p: float, i: float, d: float) -> None:
    """Sets the PID gains that set_velocity and set_relative_position use to reach their target.

    :param p: The proportional gain.
    :param i: The integral gain.
    :param d: The derivative gain.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.pid(p, i, d)
    self._configure(config)

  def set_feedforward(self, s: float, v: float, a: float) -> None:
    """Sets the feedforward gains that set_velocity and set_relative_position add to the PID
    output. Feedforward gives the motor the voltage that the target needs right away, so PID only
    has to fix what's left, which makes reaching a velocity much faster and steadier.

    :param s: The voltage it takes to start the motor moving, in volts.
    :param v: The voltage for each RPM of velocity, in volts per RPM.
    :param a: The voltage for each RPM per second of acceleration, in volts per RPM per second.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.feed_forward.sva(s, v, a)
    self._configure(config)

  def set_gravity_feedforward(self, g: float) -> None:
    """Sets the voltage that holds an elevator up against gravity, which set_velocity and
    set_relative_position add to the PID output.

    :param g: The voltage it takes to hold the elevator still, in volts.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.feed_forward.g(g)
    self._configure(config)

  def set_output_range(self, min_output: float, max_output: float) -> None:
    """Limits how hard set_velocity and set_relative_position can drive the motor, which is
    useful while tuning PID on a new mechanism. The default is -1 to 1.

    :param min_output: The lowest output, from -1 to 1.
    :param max_output: The highest output, from -1 to 1.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.output_range(min_output, max_output)
    self._configure(config)

  def set_setpoint_tolerance(self, tolerance: float) -> None:
    """Sets how close the motor has to be to the target of set_velocity or set_relative_position
    for is_at_setpoint to be true.

    :param tolerance: How close is close enough, in rotations for a position or RPM for a velocity.
    """
    config = rev.SparkMaxConfig()
    config.closed_loop.allowed_closed_loop_error(tolerance)
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
    """Lets the motor move to any position again, after set_soft_limits."""
    config = rev.SparkMaxConfig()
    config.soft_limit.reverse_soft_limit_enabled(False).forward_soft_limit_enabled(False)
    self._configure(config)

  def set_encoder_velocity_filter(self, average_depth: int, measurement_period_ms: int) -> None:
    """Sets how the Spark Max calculates the velocity of the encoder, which get_encoder_velocity
    and set_velocity use. The velocity is the change in position over the measurement period,
    averaged over the last average_depth measurements. Smaller values make the velocity react
    faster but be noisier.

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

  def set_velocity(self, velocity: float) -> None:
    """Spins the motor at the given speed, using the PID gains from set_pid.

    :param velocity: The speed, in rotations per minute.
    """
    self.get_closed_loop_controller().set_setpoint(velocity, rev.SparkLowLevel.ControlType.VELOCITY)

  def set_relative_position(self, position: float) -> None:
    """Turns the motor to the given position, using the PID gains from set_pid.

    :param position: The position, in rotations, measured from where the encoder was zeroed.
    """
    self.get_closed_loop_controller().set_setpoint(position, rev.SparkLowLevel.ControlType.POSITION)

  def is_at_setpoint(self) -> bool:
    """Returns whether the motor has reached the target of set_velocity or
    set_relative_position, within the tolerance from set_setpoint_tolerance."""
    return self.get_closed_loop_controller().is_at_setpoint().get()

  def get_relative_encoder_position(self) -> float:
    """Returns the position of the motor, in rotations, measured from where the encoder was
    zeroed."""
    return self.get_encoder().get_position().get()

  def set_relative_encoder_position(self, position: float) -> None:
    """Changes the position that the encoder reports, without moving the motor. 0 zeroes it.

    :param position: The new position, in rotations.
    """
    self.get_encoder().set_position(position)

  def get_encoder_velocity(self) -> float:
    """Returns the speed of the motor, in rotations per minute."""
    return self.get_encoder().get_velocity().get()

  def get_motor_current(self) -> float:
    """Returns the current that the motor is drawing, in amps."""
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
    Spark Max's data port, is pressed. A pressed limit switch stops the motor going that way."""
    return self.get_forward_limit_switch().get().get()

  def is_reverse_limit_switch_pressed(self) -> bool:
    """Returns whether the limit switch at the reverse end of the motor's travel, wired to the
    Spark Max's data port, is pressed. A pressed limit switch stops the motor going that way."""
    return self.get_reverse_limit_switch().get().get()
