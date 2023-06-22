import matplotlib.pyplot as plt
import numpy as np
import math
import PlanetData as Pd
from matplotlib.animation import FuncAnimation


input_system = Pd.GJ_system


class Planet:
    def __init__(self, data, index, solar_system, axis):
        self.period = float(data[6])
        self.semi_major = float(data[1])
        self.eccen = float(data[2])
        self.name = str(data[7])
        self.index = index
        self.point = 0
        self.ax = axis
        self.solar_system = solar_system
        self.time_scale = float(solar_system[len(solar_system)-1][6]) / 1000

    def plot_orbit(self):
        x_coords = []
        y_coords = []
        for theta in np.arange(0, (2 * math.pi) + 1, 0.1):
            semi_major = float(self.solar_system[self.index][1])
            eccen = float(self.solar_system[self.index][2])
            radius = (semi_major * (1 - (eccen * eccen))) / (1 - eccen * math.cos(theta))
            x = radius * math.cos(theta)
            y = radius * math.sin(theta)
            x_coords.append(x)
            y_coords.append(y)
        plt.plot(x_coords, y_coords, label=self.name)

    def init_func(self):
        self.point, = self.ax.plot(0, 0, 'o', markersize=7)

    def step_function(self, time):
        time = time * self.time_scale
        theta = (2 * math.pi * time) / self.period
        r = (self.semi_major*(1-self.eccen**2)) / (1 - (self.eccen * math.cos(theta)))
        x = r * math.cos(theta)
        y = r * math.sin(theta)

        self.point.set_data(x, y)
        return self.point


def plot_animation(input_system):
    input_system = Pd.outer_planets
    fig = plt.figure()
    ax = fig.add_subplot()
    ax.set_aspect('equal', adjustable='box')

    plt.plot(0, 0, marker="o", markersize=20, markerfacecolor="yellow")
    plt.xlabel("X (AU)")
    plt.ylabel("Y (AU)")

    ani_list = []
    for count, planet in enumerate(input_system):
        plan_class = Planet(input_system[planet], count, input_system, ax)
        plan_class.plot_orbit()
        ani_list.append(FuncAnimation(fig, plan_class.step_function, repeat=True, interval=1, init_func=plan_class.init_func()))

    plt.legend(loc="upper right")
    plt.title("Solar System")

    return ax
