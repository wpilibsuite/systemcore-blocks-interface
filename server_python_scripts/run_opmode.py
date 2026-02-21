#!/usr/bin/env python3
"""
Script to run an opmode class derived from the PeriodicOpMode base class.

Usage:
    python run_opmode.py <opmode_file.py>

The opmode file should contain a class that inherits from PeriodicOpMode.
"""

import sys
import time
import importlib.util
import inspect
import argparse
import traceback
from pathlib import Path

from wpilib_placeholders import PeriodicOpMode
from robot import Robot
from blocks_base_classes import BlockExecution


def find_opmode_class(module):
    """
    Find the first class in the module that inherits from PeriodicOpMode.
    
    Args:
        module: The imported Python module
        
    Returns:
        The PeriodicOpMode-derived class, or None if not found
    """
    for name, obj in inspect.getmembers(module, inspect.isclass):
        if obj != PeriodicOpMode and issubclass(obj, PeriodicOpMode):
            return obj
    return None


def load_opmode_from_file(file_path):
    """
    Dynamically load an opmode class from a Python file.
    
    Args:
        file_path: Path to the Python file containing the opmode class
        
    Returns:
        The PeriodicOpMode-derived class
        
    Raises:
        FileNotFoundError: If the file doesn't exist
        ImportError: If the file can't be imported
        ValueError: If no PeriodicOpMode-derived class is found
    """
    file_path = Path(file_path)
    
    if not file_path.exists():
        raise FileNotFoundError(f"PeriodicOpMode file not found: {file_path}")
    
    if not file_path.suffix == '.py':
        raise ValueError(f"File must be a Python file (.py): {file_path}")
    
    # Create module spec and load the module
    spec = importlib.util.spec_from_file_location("opmode_module", file_path)
    if spec is None or spec.loader is None:
        raise ImportError(f"Could not load module from {file_path}")
    
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    
    # Find the PeriodicOpMode-derived class
    opmode_class = find_opmode_class(module)
    if opmode_class is None:
        raise ValueError(f"No class derived from PeriodicOpMode found in {file_path}")
    
    return opmode_class


def run_opmode(opmode_file, duration=None, loop_frequency=50):
    """
    Run the opmode with the specified parameters.
    
    Args:
        opmode_file: Path to the opmode Python file
        duration: How long to run in seconds (None for infinite)
        loop_frequency: Loops per second (default: 50 Hz)
    """
    print(f"Loading opmode from: {opmode_file}")
    
    try:
        # Load the opmode class
        PeriodicOpModeClass = load_opmode_from_file(opmode_file)
        print(f"Found opmode class: {PeriodicOpModeClass.__name__}")
        
        # Create robot instance
        print("Creating robot instance...")
        robot = Robot()
        
        # Create opmode instance
        print("Initializing opmode...")
        opmode = PeriodicOpModeClass(robot)
        
        # Call start method
        print("Starting opmode...")
        opmode.Start()
        
        # Calculate loop timing
        loop_period = 1.0 / loop_frequency
        print(f"Running main loop at {loop_frequency} Hz...")
        
        # Main loop
        loop_count = 0
        start_time = time.time()
        
        try:
            while True:
                loop_start = time.time()
                
                # Call the loop method
                opmode.Periodic()
                loop_count += 1
                
                # Check if we should stop based on duration
                if duration is not None and (time.time() - start_time) >= duration:
                    break
                
                # Sleep to maintain loop frequency
                elapsed = time.time() - loop_start
                sleep_time = max(0, loop_period - elapsed)
                
                if sleep_time > 0:
                    time.sleep(sleep_time)
                elif elapsed > loop_period * 1.1:  # Warn if loop is running slow
                    print(f"Warning: Loop {loop_count} took {elapsed:.3f}s "
                          f"(target: {loop_period:.3f}s)")
                
        except KeyboardInterrupt:
            print("\nReceived interrupt signal...")
        
        # Call stop method
        print("Stopping opmode...")
        opmode.End()
        
        # Print statistics
        total_time = time.time() - start_time
        actual_frequency = loop_count / total_time if total_time > 0 else 0
        
        print(f"\nOpMode completed:")
        print(f"  Total runtime: {total_time:.2f} seconds")
        print(f"  Total loops: {loop_count}")
        print(f"  Average frequency: {actual_frequency:.1f} Hz")
        
    except Exception as e:
        print(f"\nError running opmode: {e}")
        BlockExecution.handleFatalError(e)
        sys.exit(1)


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description="Run an opmode class derived from PeriodicOpMode",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python run_opmode.py my_opmode.py
    python run_opmode.py my_opmode.py --duration 30
    python run_opmode.py my_opmode.py --frequency 60
        """
    )
    
    parser.add_argument(
        'opmode_file',
        help='Python file containing the opmode class'
    )
    
    parser.add_argument(
        '--duration', '-d',
        type=float,
        help='Duration to run in seconds (default: run until interrupted)'
    )
    
    parser.add_argument(
        '--frequency', '-f',
        type=int,
        default=50,
        help='Loop frequency in Hz (default: 50)'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Enable verbose output'
    )
    
    args = parser.parse_args()
    
    if args.frequency <= 0:
        print("Error: Frequency must be positive")
        sys.exit(1)
    
    # Run the opmode
    run_opmode(
        args.opmode_file,
        duration=args.duration,
        loop_frequency=args.frequency
    )


if __name__ == '__main__':
    main()
