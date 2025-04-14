# @license
# Copyright 2025 Porpoiseful LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# @fileoverview This is a sample for a color/range sensor
# @author alan@porpoiseful.com (Alan Smith)

from component import Component, PortType, InvalidPortException
from typing import Protocol

class DistanceCallable(Protocol):
    def __call__(self, distance : float) -> None:
        pass
class ColorCallable(Protocol):
    def __call__(self, hue : int, saturation : int, value : int) -> None:
        pass

class ColorRangeSensor(Component):    
    def __init__(self, ports : list[tuple[PortType, int]]):
        portType, port = ports[0]
        if portType != PortType.I2C_PORT:
            raise InvalidPortException
        self.port = port
    def get_manufacturer(self) -> str:   
        return "REV Robotics" 
    def get_name(self) -> str:  
        return "Color Sensor v3"
    def get_part_number(self) -> str:  
        return "REV-31-1557"
    def get_url(self) -> str:  
        return "https://www.revrobotics.com/rev-31-1557"
    def get_version(self) -> tuple[int, int, int]: 
        return (1, 0, 0)
    def stop(self) -> None:
        # send stop command to sensor
        pass
    def reset(self) -> None:
        pass
    def get_connection_port_type(self) -> list[PortType]:
        return [PortType.I2C_PORT]
    def periodic(self) -> None:
        pass

    # Component specific methods
    def get_color_rgb(self) -> tuple[int, int, int]:
        '''gets the color in rgb (red, green, blue)'''
        pass
    def get_color_hsv(self) -> tuple[int, int, int]:
        '''gets the color in hsv (hue, saturation, value)'''
        pass
    def get_distance_mm(self) -> float:
        '''gets the distance of the object seen'''
        pass

    def register_when_less_than_distance(self, distance : float, 
                                               callback: DistanceCallable) -> None:
        '''Event when item is seen closer than a distance'''
        self.less_than_distance_callback = callback

    def register_when_hue_in_range(self, min_hue : int, 
                                         max_hue : int, 
                                         callback: ColorCallable) -> None:
        '''Event when hue is in range'''
        self.hue_in_range_callback = callback

    def register_when_saturation_in_range(self, min_saturation : int, 
                                                max_saturation : int, 
                                                callback : ColorCallable) -> None:
        '''Event when saturation is in range'''
        self.saturation_in_range_callback = callback
