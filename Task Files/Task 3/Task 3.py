import matplotlib.pyplot as plt
import numpy as np
import math
import PlanetData as Pd
from matplotlib.animation import FuncAnimation

fig = plt.figure()
ax = fig.add_subplot()
ax.set_aspect('equal', adjustable='box')

for i in range(len(Pd.inner_planets)):
    x_coords = []
    y_coords = []
    for theta in np.arange(0, (2*math.pi)+1, 0.1):
        semi_major = float(Pd.inner_planets[i][1])
        eccen = float(Pd.inner_planets[i][2])
        radius = (semi_major*(1-(eccen*eccen)))/(1-eccen*math.cos(theta))
        x = radius * math.cos(theta)
        y = radius * math.sin(theta)
        x_coords.append(x)
        y_coords.append(y)
    plt.plot(x_coords, y_coords, label=Pd.inner_planets[i][7])


class Planet:
    def __init__(self, data):
        self.period = float(data[6])
        self.semi_major = float(data[1])
        self.eccen = float(data[2])
        self.colour = (1, 0, 0)

        self.point, _ = plt.plot(0, 0, 0, 'o', markersize=7, markerfacecolor=self.colour,
                                      markeredgecolor=self.colour)

    def step_function(self, time):
        theta = (2 * math.pi * time) / self.period
        r = (self.semi_major*(1-self.eccen**2)) / (1 - (self.eccen * math.cos(theta)))
        x = r * math.cos(theta)
        y = r * math.sin(theta)

        self.point.set_data(x, y)
        return self.point


plt.plot(0, 0, marker="o", markersize=20, markerfacecolor="yellow")
plt.title("Inner Solar System")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")
plt.legend(loc="upper right")

mercury = Planet(Pd.inner_planets[0])
frame_count = int(round((360 * mercury.period) / (2 * math.pi)))

anim = FuncAnimation(fig, mercury.step_function, frames=frame_count, interval=1, repeat=True)

plt.show()
