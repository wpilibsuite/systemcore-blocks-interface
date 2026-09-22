# Tuning helpers that are called by the blocks in toolboxes/pid_tuning.json.
# These use the classic Ziegler-Nichols rules, where ultimate_gain is the proportional gain that
# makes the system oscillate and period is the oscillation period in seconds.


def ziegler_nichols_kp(ultimate_gain: float) -> float:
    """Returns kp for a PID controller."""
    return 0.6 * ultimate_gain


def ziegler_nichols_ki(ultimate_gain: float, period: float) -> float:
    """Returns ki for a PID controller."""
    return 1.2 * ultimate_gain / period


def ziegler_nichols_kd(ultimate_gain: float, period: float) -> float:
    """Returns kd for a PID controller."""
    return 0.075 * ultimate_gain * period
