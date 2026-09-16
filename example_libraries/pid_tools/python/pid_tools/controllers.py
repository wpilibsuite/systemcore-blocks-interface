# Components that are described by components/*.json.


class SimplePID:
    """A PID controller that isn't connected to any hardware."""

    def __init__(self, kp: float, ki: float, kd: float):
        self._kp = kp
        self._ki = ki
        self._kd = kd
        self.reset()

    def calculate(self, measurement: float, setpoint: float) -> float:
        """Returns the output that moves the measurement toward the setpoint."""
        error = setpoint - measurement
        self._integral += error
        derivative = 0.0 if self._last_error is None else error - self._last_error
        self._last_error = error
        return self._kp * error + self._ki * self._integral + self._kd * derivative

    def at_setpoint(self, tolerance: float) -> bool:
        """Returns True if the last error was within tolerance."""
        return self._last_error is not None and abs(self._last_error) <= tolerance

    def reset(self) -> None:
        """Clears the accumulated error."""
        self._integral = 0.0
        self._last_error = None
