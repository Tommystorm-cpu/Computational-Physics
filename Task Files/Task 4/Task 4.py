import matplotlib.pyplot as plt
import numpy as np
import math
import os.path
import Theta_Function
from matplotlib.animation import FuncAnimation
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))
import PlanetData as Pd

solar_system = Pd.solar_system

title = ""

if solar_system == Pd.inner_planets:
    title = "Inner Planets"
elif solar_system == Pd.outer_planets:
    title = "Outer Planets"
elif solar_system == Pd.GJ_system:
    title = "GJ 1061 System"
elif solar_system == Pd.solar_system:
    title = "The Solar System"
elif solar_system == Pd.object_data:
    title = "All the planets lol"


class Planet:
    def __init__(self, data, index):
        self.period = float(data[6])
        self.semi_major = float(data[1])
        self.eccen = float(data[2])
        self.name = str(data[7])
        self.incline = data[3]
        if self.incline == "N/A":
            self.incline = 0
        else:
            self.incline = math.radians(float(self.incline))
        self.index = index
        self.point = 0
        self.data = data
        self.time_scale = float(solar_system[0][6]) / 100
        self.colour = (0, 0, 0)

    def plot_orbit(self):
        x_coords = []
        y_coords = []
        z_coords = []
        for theta in np.arange(0, (2 * math.pi) + 1, 0.1):
            semi_major = float(solar_system[self.index][1])
            eccen = float(solar_system[self.index][2])
            radius = (semi_major * (1 - (eccen * eccen))) / (1 - eccen * math.cos(theta))
            x = radius * math.cos(theta)
            y = radius * math.sin(theta)
            z = x * math.sin(self.incline)
            x = x * math.cos(self.incline)
            x_coords.append(x)
            y_coords.append(y)
            z_coords.append(z)
        line = plt.plot(x_coords, y_coords, z_coords,  label=self.name)
        self.colour = line[0].get_color()

    def init_func(self):
        self.point, = ax.plot(0, 0, 0, 'o', markersize=7, color=self.colour)

    def step_function(self, time):
        time = time * self.time_scale
        # theta = (2 * math.pi * time) / self.period
        theta = Theta_Function.get_angle(self.data, time)
        r = (self.semi_major*(1-self.eccen**2)) / (1 - (self.eccen * math.cos(theta)))
        x = r * math.cos(theta)
        y = r * math.sin(theta)
        z = x * math.sin(self.incline)
        x = x * math.cos(self.incline)

        self.point.set_data_3d(x, y, z)
        return self.point


plt.style.use('dark_background')
fig = plt.figure()
ax = fig.add_subplot(projection="3d")

ax.set_aspect('equal')
limit = float(solar_system[len(solar_system)-1][1])

ax.set_xlim(-limit, limit)
ax.set_ylim(-limit, limit)
ax.set_zlim(-limit, limit)


ax.set_xlabel("X (AU)")
ax.set_ylabel("Y (AU)")
ax.set_zlabel("Z (AU)")

ax.xaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))
ax.yaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))
ax.zaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))

ax.grid(False)

plt.plot(0, 0, 0, marker="o", markersize=10, markerfacecolor="yellow", markeredgecolor=(0.6, 0.6, 0))

ani_list = []
for count, planet in enumerate(solar_system):
    plan_class = Planet(solar_system[planet], count)
    plan_class.plot_orbit()
    ani_list.append(FuncAnimation(fig, plan_class.step_function, repeat=True, interval=1, init_func=plan_class.init_func()))

plt.legend(loc="upper right")
plt.title(title)

plt.show()
