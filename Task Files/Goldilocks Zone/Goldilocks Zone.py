import matplotlib.pyplot as plt
import numpy as np
import math
import os.path
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))
import PlanetData as Pd
from matplotlib.patches import Annulus


def plot_orbit(system_name):
    data = Pd.system_list[system_name]
    fig = plt.figure()
    ax = fig.add_subplot()
    ax.set_aspect('equal', adjustable='box')

    for i in range(len(data)):
        x_coords = []
        y_coords = []
        for theta in np.arange(0, (2*math.pi)+1, 0.1):
            semi_major = float(data[i][1])
            eccen = float(data[i][2])
            radius = (semi_major*(1-(eccen*eccen)))/(1-eccen*math.cos(theta))
            x = radius * math.cos(theta)
            y = radius * math.sin(theta)
            x_coords.append(x)
            y_coords.append(y)
        plt.plot(x_coords, y_coords, label=data[i][7])

    luminosity = Pd.star_luminosity[system_name]
    sun_luminosity = Pd.star_luminosity["Solar"]
    habit_distance = (luminosity / sun_luminosity)**0.5
    inner_distance = habit_distance * 0.95
    outer_distance = habit_distance * 1.37
    habitable_zone = Annulus((0, 0), outer_distance, outer_distance-inner_distance, alpha=0.5, color="g")
    ax.add_patch(habitable_zone)

    plt.plot(0, 0, marker="o", markersize=5, markerfacecolor="yellow")
    plt.title(system_name + " System")
    plt.xlabel("X (AU)")
    plt.ylabel("Y (AU)")
    plt.legend(loc="upper right")
    plt.savefig("Goldilockspreview3.png", bbox_inches = "tight")
    plt.show()

plot_orbit("Kepler-106")
