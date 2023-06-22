import numpy as np
import matplotlib.pyplot as plt
import math
from matplotlib.animation import FuncAnimation
from dataclasses import dataclass


@dataclass
class Planet:
    maj_axis: float
    eta: float
    incline: float
    colour: tuple
    label: str
    graph: plt.Axes
    period: float

    def __post_init__(self):
        self.point, = self.graph.plot(0, 0, 0, 'o', markersize=7, markerfacecolor=self.colour, markeredgecolor=self.colour)
        self.period = self.period / 11.861

    def plot_orbit(self):
        theta = np.arange(0, 360, 0.01)
        radius = np.empty(len(theta))
        x = np.empty(len(theta))
        y = np.empty(len(theta))
        z = np.empty(len(theta))

        for count, value in enumerate(theta):
            radius[count] = (self.maj_axis * (1 - (self.eta ** 2))) / (1 - (self.eta * math.cos(value)))
        for count, value in enumerate(theta):
            x[count] = radius[count] * math.cos(theta[count])
            y[count] = radius[count] * math.sin(theta[count])
            z[count] = x[count] * math.tan(math.radians(self.incline))

        self.graph.plot(x, y, z, color=self.colour, label=self.label)

    def update_pos(self, time):
        theta = (2 * math.pi * time) / self.period
        radius = (self.maj_axis * (1 - (self.eta ** 2))) / (1 - (self.eta * math.cos(math.radians(theta))))
        x = radius * math.cos(math.radians(theta))
        y = radius * math.sin(math.radians(theta))
        z = x * math.tan(math.radians(self.incline))
        self.point.set_data_3d(x, y, z)
        return self.point,


plt.style.use('dark_background')
fig = plt.figure()
ax = fig.add_subplot(projection="3d")

#ax.set_aspect('equal')
limit = 40
ax.set_xlim(-limit, limit)
ax.set_ylim(-limit, limit)
ax.set_zlim(-limit, limit)

ax.set_xlabel("x / AU")
ax.set_ylabel("y / AU")
ax.set_zlabel("z / AU")

ax.xaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))
ax.yaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))
ax.zaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))

ax.grid(False)

"""
plot_orbit(0.387, 0.21, 7, (0.4, 0.4, 0.4), "Mercury", ax)
plot_orbit(0.723, 0.01, 3.39, (0.6, 0.6, 0), "Venus", ax)
plot_orbit(1, 0.02, 0, "b", "Earth", ax)
plot_orbit(1.523, 0.09, 1.85, "r", "Mars", ax)
"""

planet_list = []

"""
mercury = Planet(0.387, 0.21, 7, (0.4, 0.4, 0.4), "Mercury", ax, 0.241)
venus = Planet(0.723, 0.01, 3.39, (0.6, 0.6, 0), "Venus", ax, 0.615)
earth = Planet(1, 0.02, 0, (0, 0, 1), "Earth", ax, 1)
mars = Planet(1.523, 0.09, 1.85, (1, 0, 0), "Mars", ax, 1.881)
"""

jupiter = Planet(5.2, 0.05, 1.3, (1, 0, 0), "Jupiter", ax, 11.861)
uranus = Planet(19.293, 0.05, 0.77, (0.1, 1, 0.1), "Uranus", ax, 84.747)
neptune = Planet(30.246, 0.01, 1.77, (0, 0, 1), "Neptune", ax, 166.344)
pluto = Planet(39.509, 0.25, 17.5, (0.8, 0.8, 0.8), "Pluto", ax, 248.348)

planet_list.append(jupiter)
planet_list.append(uranus)
planet_list.append(neptune)
planet_list.append(pluto)

ani_list = []
for planet in planet_list:
    planet.plot_orbit()
    frame_count = int(round((360 * planet.period) / (2 * math.pi)))
    ani_list.append(FuncAnimation(fig, planet.update_pos, interval=0.5, repeat=True))

ax.legend()
ax.plot(0, 0, 'o', markersize=10, markerfacecolor=(1, 1, 0), markeredgecolor=(1, 1, 0))

ax.set_title("Outer Solar System", va='bottom')
plt.show()
