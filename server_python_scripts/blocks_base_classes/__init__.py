"""Base classes for SystemCore blocks interface."""

from .decorators import Teleop, Auto, Test, Name, Group
from .mechanism import Mechanism

__all__ = [
    'Teleop',
    'Auto',
    'Test',
    'Name',
    'Group',
    'Mechanism',
]
