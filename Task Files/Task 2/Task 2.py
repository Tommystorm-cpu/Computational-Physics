import matplotlib.pyplot as plt
import numpy as np
import math

# alpha, eccentricity, name
inner_planets = {
    0: np.array([0.387, 0.21, "Mercury"]),
    1: np.array([0.712, 0.01, "Venus"]),
    2: np.array([1, 0.02, "Earth"]),
    3: np.array([1.523, 0.09, "Mars"])
}

fig = plt.figure()
ax = fig.add_subplot()
ax.set_aspect('equal', adjustable='box')

for i in range(len(inner_planets)):
    x_coords = []
    y_coords = []
    for theta in np.arange(0, (2*math.pi)+1, 0.1):
        alpha = float(inner_planets[i][0])
        eccen = float(inner_planets[i][1])
        radius = (alpha*(1-(eccen*eccen)))/(1-eccen*math.cos(theta))
        x = radius * math.cos(theta)
        y = radius * math.sin(theta)
        x_coords.append(x)
        y_coords.append(y)
    plt.plot(x_coords, y_coords, label=inner_planets[i][2])

plt.plot(0, 0, marker="o", markersize=20, markerfacecolor="yellow")
plt.title("Inner Solar System")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")
plt.legend(loc="upper right")

plt.show()
