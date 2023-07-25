import matplotlib.pyplot as plt  # imports modules
import numpy as np
import PlanetData as Pd

def task_1(solar_type):
    fig = plt.figure()
    ax = fig.add_subplot()

    data = 0
    if solar_type == "Solar":
        data = Pd.solar_system
    elif solar_type == "GJ":
        data = Pd.GJ_system
    elif solar_type == "All":
        data = Pd.object_data

    plt.ylabel("T/Yr")  # labels axis
    plt.xlabel("(a/AU)^(3/2)")
    
    y = []  # data set for y axis
    x = []   # data set for x axis
    size = len(data)  # number of entries in object_data library
    
    for a in range(size):
        x.append(float(data[a][1]) ** 1.5)  # computes data for the x axis
        y.append(float(data[a][6]))
    
    line = np.polyfit(x, y, 1)   # computes line of best fit in the form y = mx + c
    m = line[0]
    c = line[1]
    plt.axline(xy1=(0, c), slope=m, color="r", label=f'$ y = {m}x$')  # plots line of best fit, assigns gradient as legend
    plt.plot(x, y, "bs")  # plots data as points
    plt.title(f"Kepler's third law for {solar_type} planets")
    plt.legend(loc="upper right")
    plt.show()
    return fig