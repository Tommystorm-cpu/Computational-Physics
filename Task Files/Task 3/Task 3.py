import matplotlib.pyplot as plt
import numpy as np
import math
import os.path

from matplotlib.animation import FuncAnimation
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))
import PlanetData as Pd
import Theta_Function


fig = plt.figure()
ax = fig.add_subplot()
ax.set_aspect('equal', adjustable='box')

planet_system = Pd.GJ_1061_system

title = ""

if np.array_equiv(planet_system, Pd.inner_planets):
    title = "Inner Planets"
elif np.array_equiv(planet_system, Pd.outer_planets):
    title = "Outer Planets"
elif np.array_equiv(planet_system, Pd.GJ_1061_system):
    title = "GJ 1061 System"
elif np.array_equiv(planet_system, Pd.solar_system):
    title = "The Solar System"
elif np.array_equiv(planet_system, Pd.object_data):
    title = "All the planets lol"
elif np.array_equiv(planet_system, Pd.Ursae_Majoris_system):
    title = "Ursae Majoris system"
elif np.array_equiv(planet_system, Pd.Cancri_system):
    title = "Cancri system"
elif np.array_equiv(planet_system, Pd.Virginis_system):
    title = "Virginis system"
elif np.array_equiv(planet_system, Pd.CoRoT_7_system):
    title = "CoRoT-7_system"
elif np.array_equiv(planet_system, Pd.DMPP_1_system):
    title = "DMPP-1 system"
elif np.array_equiv(planet_system, Pd.EPIC_249893012_system):
    title = "EPIC 249893012 system"
elif np.array_equiv(planet_system, Pd.GJ_163_system):
    title = "GJ 163 system"
elif np.array_equiv(planet_system, Pd.Kepler_106_system):
    title = "Kepler-106 system"
elif np.array_equiv(planet_system, Pd.TOI_700_system):
    title = "TOI-700 system"
elif np.array_equiv(planet_system, Pd.HR_5183_system):
    title = "HR 5183 system"



class Planet:
    def __init__(self, data, index):
        self.period = float(data[6])
        self.semi_major = float(data[1])
        self.eccen = float(data[2])
        self.name = str(data[7])
        self.index = index
        self.point = 0
        self.data = data
        self.time_scale = float(planet_system[len(planet_system)-1][6]) / 1000
        self.colour = (0, 0, 0)

    def plot_orbit(self):
        x_coords = []
        y_coords = []
        for theta in np.arange(0, (2 * math.pi) + 1, 0.01):
            semi_major = float(planet_system[self.index][1])
            eccen = float(planet_system[self.index][2])
            radius = (semi_major * (1 - (eccen * eccen))) / (1 - eccen * math.cos(theta))
            x = radius * math.cos(theta)
            y = radius * math.sin(theta)
            x_coords.append(x)
            y_coords.append(y)
        line = plt.plot(x_coords, y_coords, label=self.name)
        self.colour = line[0].get_color()

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


plt.plot(0, 0, marker="o", markersize=20, markerfacecolor="yellow", markeredgecolor=(0.6, 0.6, 0))
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")


ani_list = []
for count, planet in enumerate(planet_system):
    plan_class = Planet(planet_system[planet], count)
    plan_class.plot_orbit()
    ani_list.append(FuncAnimation(fig, plan_class.step_function, repeat=True, interval=1, init_func=plan_class.init_func()))

plt.legend(loc="upper right")
plt.title(title)

plt.show()
