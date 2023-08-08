import matplotlib.pyplot as plt
import numpy as np
import math

fig = plt.figure()
ax = fig.add_subplot(projection='3d')
ax.set_aspect('equal', adjustable='box')

# Inputs
R = 1
M1 = 1
M2 = 0.1

"""
The types of plots:
"Gravitational"
"Rotational"
"Effective"
"""

# Choose plot type here
plot_type = "Effective"

x = np.arange(-20, 20, 1)
y = np.arange(-20, 20, 1)
x = x / 10
y = y / 10

X, Y = np.meshgrid(x, y)
Z = np.zeros(1600).reshape(40, 40)

mu = M2 / (M1 + M2)

baryDistance = R * mu

M1Coords = [-baryDistance, 0]
M2Coords = [R - baryDistance, 0]

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
        rotatePotential = -(1/2) * (tempX**2 + tempY**2)
        effectivePotential = gravPotential + rotatePotential

        effectivePotential += 1

        if effectivePotential < -3:
            effectivePotential = -3

        if plot_type == "Gravitational":
            output = gravPotential
        elif plot_type == "Rotational":
            output = rotatePotential
        else:
            output = effectivePotential

        Z[yIterable][xIterable] = output

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


plt.title("Inner Solar System")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")

plt.show()
