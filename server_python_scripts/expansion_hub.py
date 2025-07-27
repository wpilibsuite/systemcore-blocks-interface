import ntcore
import wpilib
import wpimath.units

class ExpansionHubPidConstants:
    def __init__(self, hubNumber: int, motorNumber: int, isVelocityPid: bool):
        if hubNumber < 0 or hubNumber > 3:
            raise ValueError("hubNumber out of range")

        if motorNumber < 0 or motorNumber > 3:
            raise ValueError("motorNumber is out of range")

        systemServer = wpilib.SystemServer.getSystemServer()

        pidType =  "velocity" if isVelocityPid else "position"

        options = ntcore.PubSubOptions(sendAll=True, keepDuplicates=True, periodic=0.005)

        self.pPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/pid/" + pidType + "/kp")
            .publish(options))

        self.iPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/pid/" + pidType + "/ki")
            .publish(options))

        self.dPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/pid/" + pidType + "/kd")
            .publish(options))

        self.aPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/pid/" + pidType + "/ka")
            .publish(options))

        self.vPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/pid/" + pidType + "/kv")
            .publish(options))

        self.sPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/pid/" + pidType + "/ks")
            .publish(options))

        self.continuousPublisher = (systemServer
            .getBooleanTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/pid/" + pidType + "/continuous")
            .publish(options))

        self.continuousMinimumPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/pid/" + pidType + "/continuousMinimum")
            .publish(options))

        self.continuousMaximumPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/pid/" + pidType + "/continousMaximum")
            .publish(options))

    def setPID(self, p: float, i: float, d: float):
        self.pPublisher.set(p)
        self.iPublisher.set(i)
        self.dPublisher.set(d)

    def setFF(self, s: float, v: float, a: float):
        self.sPublisher.set(s)
        self.vPublisher.set(v)
        self.aPublisher.set(a)

    def enableContinousInput(self, minimum: float, maximum: float):
        self.continuousMaximumPublisher.set(maximum)
        self.continuousMinimumPublisher.set(minimum)
        self.continuousPublisher.set(True)

    def disableContinousInput(self):
        self.continuousPublisher.set(False)

class ExpansionHubMotor:
    def __init__(self, hubNumber: int, motorNumber: int):
        if hubNumber < 0 or hubNumber > 3:
            raise ValueError("hubNumber out of range")

        if motorNumber < 0 or motorNumber > 3:
            raise ValueError("motorNumber is out of range")

        systemServer = wpilib.SystemServer.getSystemServer()

        options = ntcore.PubSubOptions(sendAll=True, keepDuplicates=True, periodic=0.005)

        self.encoderSubscriber = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/encoder")
            .subscribe(0, options))
        self.encoderVelocitySubscriber = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" +
                motorNumber + "/encoderVelocity")
            .subscribe(0, options))
        self.currentSubscriber = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/current")
            .subscribe(0, options))

        self.hubConnectedSubscriber = systemServer.getBooleanTopic("/rhsp/" + hubNumber + "/connected").subscribe(False)

        self.setpointPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/setpoint")
            .publish(options))

        self.distancePerCountPublisher = (systemServer
            .getDoubleTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/distancePerCount")
            .publish(options))

        self.floatOn0Publisher = (systemServer
            .getBooleanTopic("/rhsp/" + hubNumber + "/motor" +
                motorNumber + "/floatOn0")
            .publish(options))
        self.enabledPublisher = (systemServer
            .getBooleanTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/enabled")
            .publish(options))

        self.modePublisher = (systemServer
            .getIntegerTopic("/rhsp/" + hubNumber + "/motor" + motorNumber + "/mode")
            .publish(options))

        self.reversedPublisher = (systemServer
            .getBooleanTopic("/rhsp/" + hubNumber + "/motor" +
                motorNumber + "/reversed")
            .publish(options))

        self.resetEncoderPublisher = (systemServer
            .getBooleanTopic("/rhsp/" + hubNumber + "/motor" + motorNumber +
                "/resetEncoder")
            .publish(options))

        self.velocityPidConstants = ExpansionHubPidConstants(hubNumber, motorNumber, True)
        self.positionPidConstants = ExpansionHubPidConstants(hubNumber, motorNumber, False)

    def setPercentagePower(self, power: float):
        self.modePublisher.set(0)
        self.setpointPublisher.set(power)

    def setVoltage(self, voltage: wpimath.units.volts):
        self.modePublisher.set(1)
        self.setpointPublisher.set(voltage)

    def setPositionSetpoint(self, setpoint: float):
        self.modePublisher.set(2)
        self.setpointPublisher.set(setpoint)

    def setVelocitySetpoint(self, setpoint: float):
        self.modePublisher.set(3)
        self.setpointPublisher.set(setpoint)

    def setEnabled(self, enabled: bool):
        self.enabledPublisher.set(enabled)

    def setFloatOn0(self, floatOn0: bool):
        self.floatOn0Publisher.set(floatOn0)

    def getCurrent(self) -> float:
        return self.currentSubscriber.get()

    def setDistancePerCount(self, perCount: float):
        self.distancePerCountPublisher.set(perCount)

    def isHubConnected(self) -> bool:
        return self.hubConnectedSubscriber.get()

    def getEncoder(self) -> float:
        return self.encoderSubscriber.get()

    def getEncoderVelocity(self) -> float:
        return self.encoderVelocitySubscriber.get()

    def setReversed(self, reversed: bool):
        self.reversedPublisher.set(reversed)

    def resetEncoder(self):
        self.resetEncoderPublisher.set(True)

    def getVelocityPidConstants(self) -> ExpansionHubPidConstants:
        return self.velocityPidConstants

    def getPositionPidConstants(self) -> ExpansionHubPidConstants:
        return self.positionPidConstants

class ExpansionHubServo:
    def __init__(self, hubNumber: int, servoNumber: int):
        if hubNumber < 0 or hubNumber > 3:
            raise ValueError("hubNumber out of range")

        if servoNumber < 0 or servoNumber > 5:
            raise ValueError("servoNumber is out of range")

        systemServer = wpilib.SystemServer.getSystemServer()

        options = ntcore.PubSubOptions(sendAll=True, keepDuplicates=True, periodic=0.005)

        self.hubConnectedSubscriber = systemServer.getBooleanTopic("/rhsp/" + hubNumber + "/connected").subscribe(False)

        self.pulseWidthPublisher = (systemServer
            .getIntegerTopic("/rhsp/" + hubNumber + "/servo" + servoNumber + "/pulseWidth")
            .publish(options))

        self.pulseWidthPublisher.set(1500)

        self.framePeriodPublisher = (systemServer
            .getIntegerTopic("/rhsp/" + hubNumber + "/servo" + servoNumber + "/framePeriod")
            .publish(options))

        self.framePeriodPublisher.set(20000)

        self.enabledPublisher = (systemServer
            .getBooleanTopic("/rhsp/" + hubNumber + "/servo" + servoNumber + "/enabled")
            .publish(options))

    def set(self, value: float):
        value = max(1.0, min(0.0, value))
        rawValue = (value * 1800) + 600

        self.setPulseWidth(int(rawValue))

    def setAngle(self, degrees: float):
        degrees = max(180.0, min(0.0, degrees))
        self.set(degrees / 180.0)

    def setEnabled(self, enabled: bool):
        self.enabledPublisher.set(enabled)

    def isHubConnected(self) -> bool:
        return self.hubConnectedSubscriber.get()

    def setFramePeriod(self, framePeriod: int):
        self.framePeriodPublisher.set(framePeriod)

    def setPulseWidth(self, pulseWidth: int):
        self.pulseWidthPublisher.set(pulseWidth)

class ExpansionHub:
    def __init__(self, hubNumber: int):
        if hubNumber < 0 or hubNumber > 3:
            raise ValueError("hubNumber out of range")

        systemServer = wpilib.SystemServer.getSystemServer()

        self.hubNumber = hubNumber

        self.batteryVoltageSubscriber = systemServer.getDoubleTopic("/rhsp/" + hubNumber + "/battery").subscribe(0)
        self.connectedSubscriber = systemServer.getBooleanTopic("/rhsp/" + hubNumber + "/connected").subscribe(False)

    def isConnected(self) -> bool:
        return self.connectedSubscriber.get()

    def getBatteryVoltage(self) -> float:
        return self.batteryVoltageSubscriber.get()

    def getMotor(self, motorNumber: int) -> ExpansionHubMotor:
        return ExpansionHubMotor(self.hubNumber, motorNumber)

    def getServo(self, servoNumber: int) -> ExpansionHubServo:
        return ExpansionHubServo(self.hubNumber, servoNumber)
