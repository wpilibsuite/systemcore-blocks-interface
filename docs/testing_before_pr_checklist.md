For each PR, make sure each of these works

# New items
* [ ] Make a new project 
* [ ] Add an opmode "Auto" from the + next to Tabs 
* [ ] Add a mechanism "Arm" from the + next to Tabs
# Using robot
* [ ] Add a component to the Robot
* [ ] Make sure that the Arm shows up as myArm in the robot
* [ ] When editing an OpMode, make sure the component shows up in the toolbox Robot -> Components ->
* [ ] When editing an OpMode, make sure the mechanism shows up in the toolbox Robot -> Mechanisms -> myArm
# Events
* [ ] Add an event to the Mechanism
* [ ] In Robot, make sure you can see the event handler in the toolbox Robot -> Mechanisms -> myArm -> Events
* [ ] In Opmode, make sure you can see the event handler in the toolbox Robot -> Mechanisms -> myArm -> Events
# Mechanisms
* [ ] Add a public component to the mechanism
* [ ] Add a private component to the mechanism
* [ ] Make sure that in the Robot you can see the public component (and not the private one) in the toolbox
# Code Generation
* [ ] Generate code (right now "Deploy") and make sure there are no errors in the console
* [ ] Check that the deploy zip file contains robot.py, teleop.py, auto.py, and arm.py.
# Libraries
* [ ] Build the example libraries with `examples/build.sh` and upload all five from Manage -> Libraries
* [ ] Make sure all five libraries show up in the Libraries dialog and each one's details show when it is selected
* [ ] Make sure the LED Effects blocks are directly under LED Effects in the toolbox, grouped by labels, with no subcategories
* [ ] Make sure the Demo Math and Demo Text categories show up in the toolbox under Blocks Demo Library, and that the Blocks Demo Library category is indigo (its `color`)
* [ ] Uncheck Joystick Helpers in the Libraries dialog and make sure only that subcategory disappears from the toolbox
* [ ] Use a Demo Math block in an OpMode, deploy, and check that pyproject.toml requires blocks_demo==1.0.0
* [ ] In the Robot, make sure LimitSwitch and Gripper show up in Components -> + Component -> Blocks Demo Library, add a Gripper, and make sure its methods show up in the toolbox
* [ ] Uncheck Components -> Gripper in the Libraries dialog and make sure Gripper disappears from + Component -> Blocks Demo Library but the Gripper already in the Robot has no warning
* [ ] Remove the library and make sure the block in the OpMode shows a warning
* [ ] With all five libraries installed, make sure DifferentialDrive301, GripperBot, MecanumRobot301, PidArm, and SensorBot show up in Samples after the built in samples, each tagged with its library, and that there is no sample for LED Effects
* [ ] Preview PidArm and make sure the Robot, HoldArm, and PrintTuning tabs show their blocks, then create a project from it and make sure it opens with no warnings
* [ ] Remove PID Tools and make sure PidArm is no longer in Samples
* [ ] Hide Joystick Helpers, then change the language to Español and make sure the Blocks Demo Library category, its subcategories, the + Component subcategory, block tooltips (including on blocks already in a project), the library's name and details in the Libraries dialog, and the GripperBot description and tags in Samples are in Spanish, and that Joystick Helpers is still hidden
* [ ] Without REV Robotics installed, make sure A301 and ColorSensorV3 are not in Components -> + Component, rev is not in the toolbox settings or the toolbox, and DifferentialDrive301 and MecanumRobot301 are not in Samples
* [ ] With REV Robotics installed, make sure A301 and ColorSensorV3 show up in Components -> + Component -> REV Robotics, that the A301, CIEColor, ColorMatch, and ColorSensorV3 (with RawColor) categories are in the toolbox under REV Robotics with a More... label, and that rev is still not in the toolbox settings
* [ ] Create a project from MecanumRobot301 and make sure it opens with no warnings, deploy, and check that pyproject.toml requires robotpy-rev==2027.0.0a7.post1
* [ ] Change the language to Français and make sure the Blocks Demo Library is shown in English, since it has no French translation
