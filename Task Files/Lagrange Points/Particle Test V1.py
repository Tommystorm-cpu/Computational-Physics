import matplotlib.pyplot as plt
import numpy
import numpy as np
import math
from matplotlib.animation import FuncAnimation
from matplotlib.patches import Circle

fig = plt.figure()
ax = fig.add_subplot()
ax.set_aspect('equal', adjustable='box')

# Inputs
R = 1.496e+11
M1 = 1.989 * (10 ** 30)
M2 = 5.972 * (10 ** 24)

timeStep = 86400
max_time = 50*3.156e+7

# Calculating Essential Values
mu = M2 / (M1 + M2)
baryDistance = R * mu  # distance of sun to centre of mass
M1Coords = [-baryDistance, 0]
M2Coords = [R - baryDistance, 0]

L1X = M2Coords[0] - (R * ((M2/(3 * M1)) ** (1/3)))
L2X = M2Coords[0] + (R * ((M2/(3 * M1)) ** (1/3)))
L3X = -R * (1 + (5/12)*mu)
L4X = (R/2) * ((M1 - M2)/(M1 + M2))
L5X = L4X

L1Y = 0
L2Y = 0
L3Y = 0
L4Y = (math.sqrt(3)/2) * R
L5Y = -L4Y

# Input starting position of the test mass
starting_position = [L4X+1e7, L4Y]


class TestMass:
    def __init__(self, initial_position, initial_v):
        self.position = initial_position
        self.velocity = initial_v
        self.mass = 1

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

plt.plot(M1Coords[0], 0, marker="o", markersize=20, markerfacecolor="yellow")
plt.plot(M2Coords[0], 0, marker="o", markersize=10, markerfacecolor="blue")

testMass = TestMass(starting_position, [0, 0])

time = 0

angularFrequency = math.sqrt((G_constant * (M1 + M2))/(R**3))
angularVelocity = np.array([0, 0, angularFrequency])
while time < max_time:
    time += timeStep
    testMass.update_position(M1, M2, M1Coords, M2Coords, angularVelocity, timeStep)

testMass.plot_path()

plt.plot(L1X, L1Y, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L2X, L2Y, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L3X, L3Y, marker="o", markersize=10, markerfacecolor="red")
plt.plot(L4X, L4Y, marker="o", markersize=10, markerfacecolor="red", alpha=0.5)
plt.plot(L5X, L5Y, marker="o", markersize=10, markerfacecolor="red")

limit = R * 1.5

ax.set_xlim(-limit, limit)
ax.set_ylim(-limit, limit)

plt.title("Lagrange Points")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")

anim = FuncAnimation(fig, animate_func, init_func=animation_init, frames=int(max_time/timeStep), interval=0.1, blit=False, repeat=True)

plt.show()
