Before making a new release, make sure this all works on systemcore

# New items
* [ ] Made a new project
* [ ] Added an opmode "Auto" from the + next to Tabs
* [ ] Added a mechanism "Arm" from the + next to Tabs
# Using robot
* [ ] Added a component to the Robot
* [ ] Verified that the Arm shows up as my_arm in the robot
* [ ] Verified that when editing an OpMode, the component shows up in the toolbox Robot -> Components ->
* [ ] Verified that when editing an OpMode, the mechanism shows up in the toolbox Robot -> Mechanisms -> my_arm
# Events
* [ ] Added an event to the Mechanism
* [ ] Verified that in Robot, the event handler shows up in the toolbox Hardware -> Mechanisms -> my_arm -> Events
* [ ] Verified that in Opmode, the event handler shows up in the toolbox Robot -> Mechanisms -> my_arm -> Events
# Mechanisms
* [ ] Added a public component to the mechanism
* [ ] Added a private component to the mechanism
* [ ] Verified that in the Robot, the public component (and not the private one) shows up in the toolbox
# Deploy
* [ ] Deployed the code to the robot
* [ ] Verified that it shows up with Teleop on the Driver Station
* [ ] Ran Teleop and verified there were no errors
# Libraries
* [ ] Built the example libraries with `example_libraries/build.sh` and uploaded Blocks Demo Library from Manage -> Libraries
* [ ] Verified that in the Robot, LimitSwitch and Gripper show up in Components -> + Component -> Blocks Demo Library, added a Gripper, and verified its methods show up in the toolbox
* [ ] Unchecked Components -> Gripper in the Libraries dialog and verified that Gripper disappears from + Component -> Blocks Demo Library but the Gripper already in the Robot has no warning
* [ ] Removed the library and verified that the block in the OpMode shows a warning
