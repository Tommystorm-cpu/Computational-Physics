import matplotlib.pyplot as plt
import numpy as np
import math
import os.path

from matplotlib.animation import FuncAnimation
from matplotlib.patches import Circle
import matplotlib.animation as animation

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))
import PlanetData as Pd
import Theta_Function

plt.rcParams['animation.ffmpeg_path'] = r'C:\\Users\\tommy\\Desktop\\ffmpeg\\bin\\ffmpeg.exe'

class Planet:
    def __init__(self, data, index, ax, max_period, max_semi_major):
        self.period = float(data[6])
        self.semi_major = float(data[1])
        self.eccen = float(data[2])
        self.name = str(data[7])
        self.index = index
        self.point = 0
        self.data = data
        self.time_scale = max_period / 1000
        self.colour = (0, 0, 0)
        self.xArray = []
        self.yArray = []

        self.plot_orbit()
        self.create_animation_list()

        self.planet_patch = Circle((self.xArray[0], self.yArray[0]), radius=max_semi_major/20, color=self.colour, alpha=1)
        ax.add_patch(self.planet_patch)

    def plot_orbit(self):
        x_coords = []
        y_coords = []
        for theta in np.arange(0, (2 * math.pi) + 1, 0.01):
            semi_major = float(self.data[1])
            eccen = float(self.data[2])
            radius = (semi_major * (1 - (eccen * eccen))) / (1 - eccen * math.cos(theta))
            x = radius * math.cos(theta)
            y = radius * math.sin(theta)
            x_coords.append(x)
            y_coords.append(y)
        line = plt.plot(x_coords, y_coords, label=self.name)
        self.colour = line[0].get_color()

    def create_animation_list(self):
        num_of_orbits = 2
        for time_passed in np.arange(0, num_of_orbits * 1000, 1):
            time = time_passed * self.time_scale
            theta = Theta_Function.get_angle(self.data, time)
            r = (self.semi_major * (1 - self.eccen ** 2)) / (1 - (self.eccen * math.cos(theta)))
            x = r * math.cos(theta)
            y = r * math.sin(theta)
            self.xArray.append(x)
            self.yArray.append(y)

"""
def init_func(self):
    self.point, = ax.plot(0, 0, 'o', markersize=7, color=self.colour)


def step_function(self, time):
    time = time * self.time_scale
    # theta = (2 * math.pi * time) / self.period
    theta = Theta_Function.get_angle(self.data, time)
    r = (self.semi_major*(1-self.eccen**2)) / (1 - (self.eccen * math.cos(theta)))
    x = r * math.cos(theta)
    y = r * math.sin(theta)

    self.point.set_data(x, y)
    return self.point
"""


def create_video(planet_system_name):
    def animation_init():
        output = []
        for planet in planet_list:
            planet.planet_patch.center = (planet.xArray[0], planet.yArray[0])
            output.append(planet.planet_patch)
        return output

    def animate_func(i):
        output = []
        for planet in planet_list:
            planet.planet_patch.center = (planet.xArray[i], planet.yArray[i])
            output.append(planet.planet_patch)
        return output

    fig = plt.figure()
    ax = fig.add_subplot()
    ax.set_aspect('equal', adjustable='box')

    #planet_system = "Inner Solar"
    title = planet_system_name + " System"
    planet_system = Pd.system_list[planet_system_name]


    plt.plot(0, 0, marker="o", markersize=20, markerfacecolor="yellow", markeredgecolor=(0.6, 0.6, 0))
    plt.xlabel("X (AU)")
    plt.ylabel("Y (AU)")


    planet_list = []

    max_period = 0
    max_semi_major = 0
    for planet in planet_system:
        planet = planet_system[planet]
        if float(planet[6]) > max_period:
            max_period = float(planet[6])
        if float(planet[1]) > max_semi_major:
            max_semi_major = float(planet[1])

    for count, planet in enumerate(planet_system):
        plan_class = Planet(planet_system[planet], count, ax, max_period, max_semi_major)
        planet_list.append(plan_class)

    anim = FuncAnimation(fig, animate_func, init_func=animation_init, frames=len(planet_list[0].xArray), interval=0.1, blit=True, repeat=True)

    plt.legend(loc="upper right")
    plt.title(title)

    #writervideo = animation.FFMpegWriter(fps=60)
    #anim.save(f"{planet_system_name}.mp4", writer = writervideo, dpi=900)

    plt.show()

"""
for planet_system_name in Pd.system_list:
    if planet_system_name != "All":
        create_video(planet_system_name)
"""


create_video("All")
