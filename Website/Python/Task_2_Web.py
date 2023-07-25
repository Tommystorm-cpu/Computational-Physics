import matplotlib.pyplot as plt
import numpy as np
import math
import PlanetData as Pd


def cool_function(input):
    print(input)


def plot_orbit(solar_type):
    data = 0
    if solar_type == "Inner":
        data = Pd.inner_planets
    elif solar_type == "Outer":
        data = Pd.outer_planets
    elif solar_type == "GJ":
        data = Pd.GJ_system
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

    plt.plot(0, 0, marker="o", markersize=20, markerfacecolor="yellow")
    plt.title(solar_type + " Solar System")
    plt.xlabel("X (AU)")
    plt.ylabel("Y (AU)")
    plt.legend(loc="upper right")

    return fig