# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

__author__ = "lizlooney@google.com (Liz Looney)"

# Python Standard Library
import sys

# robotpy
import wpiutil

from . import color as color_utils


_RED = [
    wpiutil.Color.BROWN,
    wpiutil.Color.CHOCOLATE,
    wpiutil.Color.CORAL,
    wpiutil.Color.CRIMSON,
    wpiutil.Color.DARK_RED,
    wpiutil.Color.DARK_SALMON,
    wpiutil.Color.FIREBRICK,
    wpiutil.Color.FIRST_RED,
    wpiutil.Color.INDIAN_RED,
    wpiutil.Color.LAVENDER_BLUSH,
    wpiutil.Color.LIGHT_CORAL,
    wpiutil.Color.LIGHT_PINK,
    wpiutil.Color.LIGHT_SALMON,
    wpiutil.Color.MAROON,
    wpiutil.Color.MISTY_ROSE,
    wpiutil.Color.ORANGE_RED,
    wpiutil.Color.PALE_VIOLET_RED,
    wpiutil.Color.PEACH_PUFF,
    wpiutil.Color.PINK,
    wpiutil.Color.RED,
    wpiutil.Color.ROSY_BROWN,
    wpiutil.Color.SADDLE_BROWN,
    wpiutil.Color.SALMON,
    wpiutil.Color.SANDY_BROWN,
    wpiutil.Color.SEASHELL,
    wpiutil.Color.SIENNA,
    wpiutil.Color.TOMATO,
]

_RED_AND_YELLOW = [
    wpiutil.Color.LINEN,
    wpiutil.Color.PERU,
]

_YELLOW = [
    wpiutil.Color.ANTIQUE_WHITE,
    wpiutil.Color.BEIGE,
    wpiutil.Color.BISQUE,
    wpiutil.Color.BLANCHED_ALMOND,
    wpiutil.Color.BURLYWOOD,
    wpiutil.Color.CORNSILK,
    wpiutil.Color.DARK_GOLDENROD,
    wpiutil.Color.DARK_KHAKI,
    wpiutil.Color.DARK_OLIVE_GREEN,
    wpiutil.Color.DARK_ORANGE,
    wpiutil.Color.FLORAL_WHITE,
    wpiutil.Color.GOLD,
    wpiutil.Color.GOLDENROD,
    wpiutil.Color.GREEN_YELLOW,
    wpiutil.Color.IVORY,
    wpiutil.Color.KHAKI,
    wpiutil.Color.LEMON_CHIFFON,
    wpiutil.Color.LIGHT_GOLDENROD_YELLOW,
    wpiutil.Color.LIGHT_YELLOW,
    wpiutil.Color.MOCCASIN,
    wpiutil.Color.NAVAJO_WHITE,
    wpiutil.Color.OLD_LACE,
    wpiutil.Color.OLIVE,
    wpiutil.Color.OLIVE_DRAB,
    wpiutil.Color.ORANGE,
    wpiutil.Color.PALE_GOLDENROD,
    wpiutil.Color.PAPAYA_WHIP,
    wpiutil.Color.TAN,
    wpiutil.Color.WHEAT,
    wpiutil.Color.YELLOW,
    wpiutil.Color.YELLOW_GREEN,
]

_YELLOW_AND_GREEN = [
    wpiutil.Color.CHARTREUSE,
    wpiutil.Color.LAWN_GREEN,
]

_GREEN = [
    wpiutil.Color.DARK_GREEN,
    wpiutil.Color.DARK_SEA_GREEN,
    wpiutil.Color.FOREST_GREEN,
    wpiutil.Color.GREEN,
    wpiutil.Color.HONEYDEW,
    wpiutil.Color.LIGHT_GREEN,
    wpiutil.Color.LIME,
    wpiutil.Color.LIME_GREEN,
    wpiutil.Color.MEDIUM_SEA_GREEN,
    wpiutil.Color.PALE_GREEN,
    wpiutil.Color.SEA_GREEN,
]

_GREEN_AND_CYAN = [
    wpiutil.Color.SPRING_GREEN,
]

_CYAN = [
    wpiutil.Color.ALICE_BLUE,
    wpiutil.Color.AQUA,
    wpiutil.Color.AQUAMARINE,
    wpiutil.Color.AZURE,
    wpiutil.Color.CADET_BLUE,
    wpiutil.Color.CYAN,
    wpiutil.Color.DARK_CYAN,
    wpiutil.Color.DARK_SLATE_GRAY,
    wpiutil.Color.DARK_TURQUOISE,
    wpiutil.Color.DEEP_SKY_BLUE,
    wpiutil.Color.FIRST_BLUE,
    wpiutil.Color.LIGHT_BLUE,
    wpiutil.Color.LIGHT_CYAN,
    wpiutil.Color.LIGHT_SEA_GREEN,
    wpiutil.Color.LIGHT_SKY_BLUE,
    wpiutil.Color.MEDIUM_AQUAMARINE,
    wpiutil.Color.MEDIUM_SPRING_GREEN,
    wpiutil.Color.MEDIUM_TURQUOISE,
    wpiutil.Color.PALE_TURQUOISE,
    wpiutil.Color.POWDER_BLUE,
    wpiutil.Color.SKY_BLUE,
    wpiutil.Color.STEEL_BLUE,
    wpiutil.Color.TEAL,
    wpiutil.Color.TURQUOISE,
]

_CYAN_AND_BLUE = [
    wpiutil.Color.DODGER_BLUE,
    wpiutil.Color.LIGHT_SLATE_GRAY,
    wpiutil.Color.SLATE_GRAY,
]

_BLUE = [
    wpiutil.Color.BLUE,
    wpiutil.Color.CORNFLOWER_BLUE,
    wpiutil.Color.DARK_BLUE,
    wpiutil.Color.DARK_SLATE_BLUE,
    wpiutil.Color.DENIM,
    wpiutil.Color.LAVENDER,
    wpiutil.Color.LIGHT_STEEL_BLUE,
    wpiutil.Color.MEDIUM_BLUE,
    wpiutil.Color.MEDIUM_PURPLE,
    wpiutil.Color.MEDIUM_SLATE_BLUE,
    wpiutil.Color.MIDNIGHT_BLUE,
    wpiutil.Color.NAVY,
    wpiutil.Color.ROYAL_BLUE,
    wpiutil.Color.SLATE_BLUE,
]

_BLUE_AND_MAGENTA = [
]

_MAGENTA = [
    wpiutil.Color.BLUE_VIOLET,
    wpiutil.Color.DARK_MAGENTA,
    wpiutil.Color.DARK_ORCHID,
    wpiutil.Color.DARK_VIOLET,
    wpiutil.Color.DEEP_PINK,
    wpiutil.Color.FUCHSIA,
    wpiutil.Color.INDIGO,
    wpiutil.Color.MAGENTA,
    wpiutil.Color.MEDIUM_ORCHID,
    wpiutil.Color.MEDIUM_VIOLET_RED,
    wpiutil.Color.ORCHID,
    wpiutil.Color.PLUM,
    wpiutil.Color.PURPLE,
    wpiutil.Color.THISTLE,
    wpiutil.Color.VIOLET,
]

_MAGENTA_AND_RED = [
    wpiutil.Color.HOT_PINK,
]

_GRAYSCALE_COLORS = [
    wpiutil.Color.BLACK,
    wpiutil.Color.DARK_GRAY,
    wpiutil.Color.DIM_GRAY,
    wpiutil.Color.GAINSBORO,
    wpiutil.Color.GHOST_WHITE,
    wpiutil.Color.GRAY,
    wpiutil.Color.LIGHT_GRAY,
    wpiutil.Color.MINTCREAM,
    wpiutil.Color.SILVER,
    wpiutil.Color.SNOW,
    wpiutil.Color.WHITE,
    wpiutil.Color.WHITE_SMOKE,
]


def test_is_red():
    for color in _RED:
        assert color_utils.is_red(color)
    for color in _RED_AND_YELLOW:
        assert color_utils.is_red(color)
    for color in _YELLOW:
        assert not color_utils.is_red(color)
    for color in _YELLOW_AND_GREEN:
        assert not color_utils.is_red(color)
    for color in _GREEN:
        assert not color_utils.is_red(color)
    for color in _GREEN_AND_CYAN:
        assert not color_utils.is_red(color)
    for color in _CYAN:
        assert not color_utils.is_red(color)
    for color in _CYAN_AND_BLUE:
        assert not color_utils.is_red(color)
    for color in _BLUE:
        assert not color_utils.is_red(color)
    for color in _BLUE_AND_MAGENTA:
        assert not color_utils.is_red(color)
    for color in _MAGENTA:
        assert not color_utils.is_red(color)
    for color in _MAGENTA_AND_RED:
        assert color_utils.is_red(color)
    for color in _GRAYSCALE_COLORS:
        assert not color_utils.is_red(color)


def test_is_yellow():
    for color in _RED:
        assert not color_utils.is_yellow(color)
    for color in _RED_AND_YELLOW:
        assert color_utils.is_yellow(color)
    for color in _YELLOW:
        assert color_utils.is_yellow(color)
    for color in _YELLOW_AND_GREEN:
        assert color_utils.is_yellow(color)
    for color in _GREEN:
        assert not color_utils.is_yellow(color)
    for color in _GREEN_AND_CYAN:
        assert not color_utils.is_yellow(color)
    for color in _CYAN:
        assert not color_utils.is_yellow(color)
    for color in _CYAN_AND_BLUE:
        assert not color_utils.is_yellow(color)
    for color in _BLUE:
        assert not color_utils.is_yellow(color)
    for color in _BLUE_AND_MAGENTA:
        assert not color_utils.is_yellow(color)
    for color in _MAGENTA:
        assert not color_utils.is_yellow(color)
    for color in _MAGENTA_AND_RED:
        assert not color_utils.is_yellow(color)
    for color in _GRAYSCALE_COLORS:
        assert not color_utils.is_yellow(color)


def test_is_green():
    for color in _RED:
        assert not color_utils.is_green(color)
    for color in _RED_AND_YELLOW:
        assert not color_utils.is_green(color)
    for color in _YELLOW:
        assert not color_utils.is_green(color)
    for color in _YELLOW_AND_GREEN:
        assert color_utils.is_green(color)
    for color in _GREEN:
        assert color_utils.is_green(color)
    for color in _GREEN_AND_CYAN:
        assert color_utils.is_green(color)
    for color in _CYAN:
        assert not color_utils.is_green(color)
    for color in _CYAN_AND_BLUE:
        assert not color_utils.is_green(color)
    for color in _BLUE:
        assert not color_utils.is_green(color)
    for color in _BLUE_AND_MAGENTA:
        assert not color_utils.is_green(color)
    for color in _MAGENTA:
        assert not color_utils.is_green(color)
    for color in _MAGENTA_AND_RED:
        assert not color_utils.is_green(color)
    for color in _GRAYSCALE_COLORS:
        assert not color_utils.is_green(color)


def test_is_cyan():
    for color in _RED:
        assert not color_utils.is_cyan(color)
    for color in _RED_AND_YELLOW:
        assert not color_utils.is_cyan(color)
    for color in _YELLOW:
        assert not color_utils.is_cyan(color)
    for color in _YELLOW_AND_GREEN:
        assert not color_utils.is_cyan(color)
    for color in _GREEN:
        assert not color_utils.is_cyan(color)
    for color in _GREEN_AND_CYAN:
        assert color_utils.is_cyan(color)
    for color in _CYAN:
        assert color_utils.is_cyan(color)
    for color in _CYAN_AND_BLUE:
        assert color_utils.is_cyan(color)
    for color in _BLUE:
        assert not color_utils.is_cyan(color)
    for color in _BLUE_AND_MAGENTA:
        assert not color_utils.is_cyan(color)
    for color in _MAGENTA:
        assert not color_utils.is_cyan(color)
    for color in _MAGENTA_AND_RED:
        assert not color_utils.is_cyan(color)
    for color in _GRAYSCALE_COLORS:
        assert not color_utils.is_cyan(color)


def test_is_blue():
    for color in _RED:
        assert not color_utils.is_blue(color)
    for color in _RED_AND_YELLOW:
        assert not color_utils.is_blue(color)
    for color in _YELLOW:
        assert not color_utils.is_blue(color)
    for color in _YELLOW_AND_GREEN:
        assert not color_utils.is_blue(color)
    for color in _GREEN:
        assert not color_utils.is_blue(color)
    for color in _GREEN_AND_CYAN:
        assert not color_utils.is_blue(color)
    for color in _CYAN:
        assert not color_utils.is_blue(color)
    for color in _CYAN_AND_BLUE:
        assert color_utils.is_blue(color)
    for color in _BLUE:
        assert color_utils.is_blue(color)
    for color in _BLUE_AND_MAGENTA:
        assert color_utils.is_blue(color)
    for color in _MAGENTA:
        assert not color_utils.is_blue(color)
    for color in _MAGENTA_AND_RED:
        assert not color_utils.is_blue(color)
    for color in _GRAYSCALE_COLORS:
        assert not color_utils.is_blue(color)


def test_is_magenta():
    for color in _RED:
        assert not color_utils.is_magenta(color)
    for color in _RED_AND_YELLOW:
        assert not color_utils.is_magenta(color)
    for color in _YELLOW:
        assert not color_utils.is_magenta(color)
    for color in _YELLOW_AND_GREEN:
        assert not color_utils.is_magenta(color)
    for color in _GREEN:
        assert not color_utils.is_magenta(color)
    for color in _GREEN_AND_CYAN:
        assert not color_utils.is_magenta(color)
    for color in _CYAN:
        assert not color_utils.is_magenta(color)
    for color in _CYAN_AND_BLUE:
        assert not color_utils.is_magenta(color)
    for color in _BLUE:
        assert not color_utils.is_magenta(color)
    for color in _BLUE_AND_MAGENTA:
        assert color_utils.is_magenta(color)
    for color in _MAGENTA:
        assert color_utils.is_magenta(color)
    for color in _MAGENTA_AND_RED:
        assert color_utils.is_magenta(color)
    for color in _GRAYSCALE_COLORS:
        assert not color_utils.is_magenta(color)
