import matplotlib.pyplot as plt
import numpy as np
import math
import os.path

from matplotlib.animation import FuncAnimation
import mpl_toolkits.mplot3d.art3d as art3d
import matplotlib.animation as animation
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))
import PlanetData as Pd
import Theta_Function

plt.rcParams['animation.ffmpeg_path'] = r'C:\\Users\\Alex Arnold\\Desktop\\ffmpeg\\bin\\ffmpeg.exe'


class Planet:
    def __init__(self, data, index, ax, max_period, max_semi_major):
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
        self.time_scale = max_period / 1000
        self.colour = (0, 0, 0)
        self.xArray = []
        self.yArray = []
        self.zArray = []

        self.plot_orbit()
        self.create_animation_list()

        self.point, = ax.plot(self.xArray[0], self.yArray[0], self.zArray[0], 'o', markersize=7, color = self.colour)

    def plot_orbit(self):
        x_coords = []
        y_coords = []
        z_coords = []
        for theta in np.arange(0, (2 * math.pi) + 1, 0.1):
            semi_major = float(self.data[1])
            eccen = float(self.data[2])
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

    def create_animation_list(self):
        num_of_orbits = 2
        for time_passed in np.arange(0, num_of_orbits *1000, 1):
            time = time_passed *self.time_scale
            theta = Theta_Function.get_angle(self.data, time)
            r = (self.semi_major*(1-self.eccen**2)) / (1 - (self.eccen * math.cos(theta)))
            x = r * math.cos(theta)
            y = r * math.sin(theta)
            z = x * math.sin(self.incline)
            x = x * math.cos(self.incline)
            self.xArray.append(x)
            self.yArray.append(y)
            self.zArray.append(z)


def create_video(planet_system_name):
    def animation_init():
        output = []
        for planet in planet_list:
            planet.point.set_data_3d([planet.xArray[0]], [planet.yArray[0]], [planet.zArray[0]])
            output.append(planet.point)
        return output

    def animate_func(i):
        output = []
        for planet in planet_list:
            planet.point.set_data_3d([planet.xArray[i]], [planet.yArray[i]], [planet.zArray[i]])
            output.append(planet.point)
        return output

    plt.style.use('dark_background')
    fig = plt.figure()
    ax = fig.add_subplot(projection="3d")
    title = planet_system_name + " System"
    planet_system = Pd.system_list[planet_system_name]

    ax.set_aspect('equal')
    limit = float(planet_system[len(planet_system)-1][1])

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

    anim = FuncAnimation(fig, animate_func, init_func=animation_init, frames=len(planet_list[0].xArray), interval=0.1, blit=False, repeat=True)

    plt.legend(loc="upper right")
    plt.title(title)

    #writervideo = animation.FFMpegWriter(fps=60)
    #anim.save(f"{planet_system_name}.mp4", writer=writervideo, dpi=200)

    plt.show()

create_video("Inner Solar")
