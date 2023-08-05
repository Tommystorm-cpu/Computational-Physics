import matplotlib.pyplot as plt
import numpy
import numpy as np
import math
import os.path
import sys
from matplotlib.animation import FuncAnimation
from matplotlib.patches import Circle
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))

fig = plt.figure()
ax = fig.add_subplot()
ax.set_aspect('equal', adjustable='box')


def resolve_vector(pos1, pos2, magnitude):
    x_dif = (pos1[0] - pos2[0])
    y_dif = (pos1[1] - pos2[1])

    if x_dif != 0 and y_dif != 0:
        # Bottom Right
        if y_dif > 0 and x_dif < 0:
            angle = math.atan(abs(x_dif) / abs(y_dif)) + (math.pi * 3 / 2)
        # Top Left
        elif y_dif < 0 and x_dif > 0:
            angle = math.atan(abs(x_dif) / abs(y_dif)) + (math.pi / 2)
        # Top Right
        elif y_dif < 0 and x_dif < 0:
            angle = math.atan(y_dif / x_dif)
        # Bottom Left
        else:
            angle = math.atan(y_dif / x_dif) + math.pi
    else:
        if y_dif == 0:
            output = [math.copysign(magnitude, -x_dif), 0]
            return output
        if x_dif == 0:
            output = [0, math.copysign(magnitude, -y_dif)]
            return output

    return [math.cos(angle) * magnitude, math.sin(angle) * magnitude]


class TestMass:
    def __init__(self, initial_position, initial_v):
        self.position = initial_position
        self.velocity = initial_v
        self.mass = 0.0001

        self.x_list = []
        self.y_list = []
        self.x_list.append(initial_position[0])
        self.y_list.append(initial_position[1])

        self.planet_patch = Circle((self.x_list[0], self.y_list[0]), radius=0.05, color="b", alpha=1)
        ax.add_patch(self.planet_patch)

    def update_position(self, m1, m2, pos1, pos2, angular_velocity, time_step):
        sun_force = (- (G_constant * m1 * self.mass) / (numpy.linalg.norm((numpy.subtract(self.position, pos1))) ** 3)) * (numpy.subtract(self.position, pos1))
        planet_force = (- (G_constant * m2 * self.mass) / (numpy.linalg.norm((numpy.subtract(self.position, pos2))) ** 3)) * (numpy.subtract(self.position, pos2))
        gravity_force = numpy.add(sun_force, planet_force)

        """
        mass_angular = -self.mass * angular_velocity
        position_angular_cross = numpy.cross(angular_velocity, numpy.array(self.position))
        final_cross = np.cross(mass_angular, position_angular_cross)
        centrifugal_force = np.array([final_cross[0], final_cross[1]])

        total_force = numpy.add(total_force, centrifugal_force)

        coriolis_force = -2 * self.mass * np.cross(angular_velocity, self.velocity)
        coriolis_force = [coriolis_force[0], coriolis_force[1]]

        total_force = numpy.add(total_force, coriolis_force)
        """

        coriolis_force = -2 * self.mass * (numpy.cross(angular_velocity, self.velocity))
        coriolis_force = [coriolis_force[0], coriolis_force[1]]
        centrifugal_force = -self.mass * numpy.cross(angular_velocity, (numpy.cross(angular_velocity, self.position)))
        centrifugal_force = [centrifugal_force[0], centrifugal_force[1]]
        effective_force = numpy.add(gravity_force, coriolis_force)
        effective_force = numpy.add(effective_force, centrifugal_force)

        acceleration = effective_force / self.mass
        delta_velocity = acceleration * time_step
        self.velocity = numpy.add(self.velocity, delta_velocity)
        delta_pos = self.velocity * time_step

        self.position = numpy.add(delta_pos, self.position)

        #print(self.position)

        self.x_list.append(self.position[0])
        self.y_list.append(self.position[1])

    def plot_path(self):
        plt.plot(self.x_list, self.y_list)


def animation_init():
    output = []
    testMass.planet_patch.center = (testMass.x_list[0], testMass.y_list[0])
    output.append(testMass.planet_patch)
    return output


def animate_func(i):
    output = []
    testMass.planet_patch.center = (testMass.x_list[i], testMass.y_list[i])
    output.append(testMass.planet_patch)
    return output


G_constant = 6.67 * (10**-11)

R = 10

M1 = 10000
M2 = 1

mu = M2 / (M1 + M2)

baryDistance = R * mu  # distance of sun to centre of mass

M1Coords = [-baryDistance, 0]
M2Coords = [R - baryDistance, 0]

plt.plot(M1Coords[0], 0, marker="o", markersize=20, markerfacecolor="yellow")
plt.plot(M2Coords[0], 0, marker="o", markersize=10, markerfacecolor="blue")


#x = np.arange(-(R+2)*100, (R+2)*100, 1)
#y = np.arange(-(R+2)*100, (R+2)*100, 1)
#x = x / 100
#y = y / 100

L1X = M2Coords[0] - (R * ((M2/(3 * M1)) ** (1/3)))
L2X = M2Coords[0] + (R * ((M2/(3 * M1)) ** (1/3)))
L3X = -R * (1 + (5/12)*mu)
L4X = (R/2) * ((M1 - M2)/(M1 + M2))
L5X = L4X

L4Y = (math.sqrt(3)/2) * R
L5Y = -L4Y

"""
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
"""

testMass = TestMass([L4X+0.001, L4Y], [0, 0])
#-0.0000001
timeStep = 1000
#1000
time = 0

angularFrequency = math.sqrt((G_constant * (M1 + M2))/(R**3))
angularVelocity = np.array([0, 0, angularFrequency])
#angularFrequency = 2 * math.pi
#print(angularFrequency)

#10000
#50000000

#6000000
while time < 6000000:
    time += timeStep
    testMass.update_position(M1, M2, M1Coords, M2Coords, angularVelocity, timeStep)

testMass.plot_path()

"""
x = np.arange(-(R+2)*100, (R+2)*100, 1)
y = np.arange(-(R+2)*100, (R+2)*100, 1)
x = x / 100
y = y / 100

X, Y = np.meshgrid(x, y)
Z = np.zeros(int(((R+2)*200)**2)).reshape(int((R+2)*200), int((R+2)*200))

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
        #effectivePotential = gravPotential + (1/2) * numpy.dot(numpy.cross(angularVelocity, position), numpy.cross(angularVelocity, position))

        if effectivePotential < -3:
            effectivePotential = -3

        Z[yIterable][xIterable] = effectivePotential

plt.contour(X, Y, Z, 50)
"""

plt.plot(L1X, 0, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L2X, 0, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L3X, 0, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L4X, L4Y, marker="o", markersize=10, markerfacecolor="red", alpha=0.5)
plt.plot(L5X, L5Y, marker="o", markersize=10, markerfacecolor="red")

limit = R * 1.5

ax.set_xlim(-limit, limit)
ax.set_ylim(-limit, limit)

plt.title("Inner Solar System")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")

anim = FuncAnimation(fig, animate_func, init_func=animation_init, frames=1050, interval=0.1, blit=False, repeat=True)

plt.show()
