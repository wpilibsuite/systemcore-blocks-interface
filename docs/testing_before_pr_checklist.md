For each PR, make sure each of these works

# New items
* [ ] Make a new project 
* [ ] Add an opmode "Auto" from the + next to Tabs 
* [ ] Add a mechanism "Arm" from the + next to Tabs
# Using robot
* [ ] Add a component to the Robot
* [ ] Make sure that the Arm shows up as my_arm in the robot
* [ ] When editing an OpMode, make sure the component shows up in the toolbox Robot -> Components ->
* [ ] When editing an OpMode, make sure the mechanism shows up in the toolbox Robot -> Mechanisms -> my_arm
# Events
* [ ] Add an event to the Mechanism
* [ ] In Robot, make sure you can see the event handler in the toolbox Robot -> Mechanisms -> my_arm -> Events
* [ ] In Opmode, make sure you can see the event handler in the toolbox Robot -> Mechanisms -> my_arm -> Events
# Mechanisms
* [ ] Add a public component to the mechanism
* [ ] Add a private component to the mechanism
* [ ] Make sure that in the Robot you can see the public component (and not the private one) in the toolbox
# Code Generation
* [ ] Generate code (right now "Deploy") and make sure there are no errors in the console
* [ ] Check that the deploy zip file contains robot.py, teleop.py, auto.py, and arm.py.
# Libraries
* [ ] Build the example libraries with `example_libraries/build.sh` and upload Blocks Demo Library from Manage -> Libraries
* [ ] In the Robot, make sure LimitSwitch and Gripper show up in Components -> + Component -> Blocks Demo Library, add a Gripper, and make sure its methods show up in the toolbox
* [ ] Uncheck Components -> Gripper in the Libraries dialog and make sure Gripper disappears from + Component -> Blocks Demo Library but the Gripper already in the Robot has no warning
* [ ] Remove the library and make sure the block in the OpMode shows a warning