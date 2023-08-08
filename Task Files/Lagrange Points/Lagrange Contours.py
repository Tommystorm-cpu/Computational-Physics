import matplotlib.pyplot as plt
import numpy as np
import math


fig = plt.figure()
ax = fig.add_subplot()
ax.set_aspect('equal', adjustable='box')

# Inputs
R = 1
M1 = 1
M2 = 0.01

# Essential Values
mu = M2 / (M1 + M2)
baryDistance = R * mu  # distance of sun to centre of mass

M1Coords = [-baryDistance, 0]
M2Coords = [R - baryDistance, 0]

plt.plot(M1Coords[0], 0, marker="o", markersize=20, markerfacecolor="yellow")
plt.plot(M2Coords[0], 0, marker="o", markersize=10, markerfacecolor="blue")


x = np.arange(-(R+2)*100, (R+2)*100, 1)
y = np.arange(-(R+2)*100, (R+2)*100, 1)
x = x / 100
y = y / 100

X, Y = np.meshgrid(x, y)
Z = np.zeros(int(((R+2)*200)**2)).reshape(int((R+2)*200), int((R+2)*200))

G_constant = 6.67 * (10**-11)
angularFrequency = math.sqrt((G_constant * (M1 + M2))/(R**3))
angularVelocity = np.array([0, 0, angularFrequency])

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
        position = [tempX, tempY, 0]

        gravPotential = -((1-mu)/r1) - (mu/r2)
        effectivePotential = -(1/2) * (tempX**2 + tempY**2) + gravPotential

        if effectivePotential < -3:
            effectivePotential = -3

        Z[yIterable][xIterable] = effectivePotential

plt.contour(X, Y, Z, 50)

L1X = M2Coords[0] - (R * ((M2/(3 * M1)) ** (1/3)))
L2X = M2Coords[0] + (R * ((M2/(3 * M1)) ** (1/3)))
L3X = -R * (1 + (5/12)*mu)
L4X = (R/2) * ((M1 - M2)/(M1 + M2))
L5X = L4X

L4Y = (math.sqrt(3)/2) * R
L5Y = -L4Y

plt.plot(L1X, 0, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L2X, 0, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L3X, 0, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L4X, L4Y, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L5X, L5Y, marker="o", markersize=10, markerfacecolor="red")

limit = R + 1

ax.set_xlim(-limit, limit)
ax.set_ylim(-limit, limit)

plt.title("Inner Solar System")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")

plt.show()
