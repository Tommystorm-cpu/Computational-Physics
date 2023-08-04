import matplotlib.pyplot as plt
import numpy as np
import math
import os.path
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))
import PlanetData as Pd

fig = plt.figure()
ax = fig.add_subplot(projection='3d')
ax.set_aspect('equal', adjustable='box')

planet = Pd.object_data[2]

x_coords = []
y_coords = []
for theta in np.arange(0, (2*math.pi)+1, 0.1):
    semi_major = float(planet[1])
    eccen = float(planet[2])
    radius = (semi_major*(1-(eccen*eccen)))/(1-eccen*math.cos(theta))
    x = radius * math.cos(theta)
    y = radius * math.sin(theta)
    x_coords.append(x)
    y_coords.append(y)
#plt.plot(x_coords, y_coords, label=planet[7])

x = np.arange(-20, 20, 1)
y = np.arange(-20, 20, 1)
x = x / 10
y = y / 10

X, Y = np.meshgrid(x, y)
Z = np.zeros(1600).reshape(40, 40)

R = 1

M1 = 1
M2 = 0.1
mu = M2 / (M1 + M2)

baryDistance = R * mu

M1Coords = [-baryDistance, 0]
M2Coords = [R - baryDistance, 0]

plt.plot(M1Coords[0], 0, marker="o", markersize=20, markerfacecolor="yellow")
plt.plot(M2Coords[0], 0, marker="o", markersize=10, markerfacecolor="blue")

for yIterable in range(len(y)):
    for xIterable in range(len(x)):
        tempX = x[xIterable]
        tempY = y[yIterable]

        r1 = math.sqrt((tempX-M1Coords[0])**2 + (tempY-M1Coords[1])**2)
        r2 = math.sqrt((tempX-M2Coords[0])**2 + (tempY-M2Coords[1])**2)

        if r1 == 0:
            r1 = 0.001
        if r2 == 0:
            r2 = 0.001

        gravPotential = -((1-mu)/r1) - (mu/r2)
        effectivePotential = -(1/2) * (tempX**2 + tempY**2) + gravPotential

        effectivePotential += 1

        if effectivePotential < -3:
            effectivePotential = -3

        Z[yIterable][xIterable] = effectivePotential

surf = ax.plot_surface(X, Y, Z)

limit = 1.5

ax.set_xlim(-limit, limit)
ax.set_ylim(-limit, limit)
ax.set_zlim(-limit, limit)

ax.set_xlabel("X (AU)")
ax.set_ylabel("Y (AU)")
ax.set_zlabel("Z (AU)")

ax.xaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))
ax.yaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))
ax.zaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))

#plt.plot(0, 0, 0, marker="o", markersize=20, markerfacecolor="yellow")
#plt.plot(1.02, 0, 0, marker="o", markersize=10, markerfacecolor="blue")
plt.title("Inner Solar System")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")
plt.legend(loc="upper right")

plt.show()
