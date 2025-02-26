# Overarching thoughts (North Star)
* The primary purpose for Blocks is to be an easier environment for students to program robots.
    * Students should be able to program in Blocks without any experienced software mentor help.
    * This means that reducing confusion in blocks is more important than being 1:1 mapping to Python
    * For ease of use, we are ok with not being able to do everything in Blocks you can do in Python.
* You should be able to make a competitive robot using Blocks
    * Our goal is to raise the floor, not lower the ceiling
* Programming in Blocks is still programming.   You can make logic errors and programs that don't work and have errors
* Some students will move on from Blocks to text based languages
    * Students who want to do more than they can in Blocks can export from Blocks and use that as a starting point for their own Python coding.

# Intentional Limitations (for simplicity)
* Each blockly workspace goes to one Python file (module) and can only contain one class
* The only type of methods that can be created are class instance methods
* All variables created in blockly will be class instance variables

# Design thoughts
(We assume that these bullet points apply to programming in C++, Java, and Python too.)
## OpModes
* An OpMode can be either Autonomous or Teleop
* An OpMode can be marked as Disabled or Enabled
* An OpMode has access to a singleton instance of the Robot class
## Robot
* There should be one robot class that is shared between all OpModes
* A robot has zero or more mechanisms 
* A Robot has zero or more components

## Mechanisms
* A mechansim can be created by the student and can have zero or more submechanisms and zero or more components
* Example:  A claw could have a servo (to open and close) and a range sensor (to determine when something is in the claw)

## Components
* Every actuator is a component
* Every sensor is a component
