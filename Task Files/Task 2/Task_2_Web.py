import matplotlib.pyplot as plt
import numpy as np
import math
import PlanetData as Pd

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

plt.plot(0, 0, marker="o", markersize=20, markerfacecolor="yellow")
plt.title("Inner Solar System")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")
plt.legend(loc="upper right")

display(fig, target="graph-area", append=False)
