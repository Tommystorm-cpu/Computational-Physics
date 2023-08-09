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
frame_cutter_value = 100  # Amount of frames each step
fix_reference_frame = False
timeStep = 86400
max_time = 25*12*3.156e+7

R = 7.785e11
M1 = 1.989 * (10 ** 30)
M2 = 1.898 * (10 ** 27)

# Essential Values
mu = M2 / (M1 + M2)
baryDistance = R * mu
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

# Change position here
init_position = [L5X+1e10, L5Y-1e10]


class TestMass:
    def __init__(self, initial_position, initial_v):
        self.position = initial_position
        self.velocity = initial_v
        self.mass = 10000

        self.x_list = []
        self.y_list = []
        self.x_list.append(initial_position[0])
        self.y_list.append(initial_position[1])

        self.planet_patch = Circle((self.x_list[0], self.y_list[0]), radius=R*0.05, color="b", alpha=1)
        ax.add_patch(self.planet_patch)

    def update_position(self, m1, m2, pos1, pos2, time_step):
        sun_force = (- (G_constant * m1 * self.mass) / (numpy.linalg.norm((numpy.subtract(self.position, pos1))) ** 3)) * (numpy.subtract(self.position, pos1))
        planet_force = (- (G_constant * m2 * self.mass) / (numpy.linalg.norm((numpy.subtract(self.position, pos2))) ** 3)) * (numpy.subtract(self.position, pos2))
        gravity_force = numpy.add(sun_force, planet_force)

        acceleration = gravity_force / self.mass
        delta_velocity = acceleration * time_step
        self.velocity = numpy.add(self.velocity, delta_velocity)
        delta_position = self.velocity * time_step

        self.position = numpy.add(delta_position, self.position)

        self.x_list.append(self.position[0])
        self.y_list.append(self.position[1])

    def plot_path(self):
        if fix_reference_frame:
            plot_x_list = []
            plot_y_list = []
            for i in range(len(self.x_list)):
                rotation_amount = -earthParticle.theta_list[i]
                initial_position = [self.x_list[i], self.y_list[i]]
                offset_matrix = np.array([
                    [math.cos(rotation_amount), -math.sin(rotation_amount)],
                    [math.sin(rotation_amount), math.cos(rotation_amount)]
                ])
                transformed_position = offset_matrix @ initial_position
                plot_x_list.append(transformed_position[0])
                plot_y_list.append(transformed_position[1])
            plt.plot(plot_x_list, plot_y_list, color="g")
        else:
            plt.plot(self.x_list, self.y_list, color="g")


class BigMass:
    def __init__(self, mass, initial_position):
        self.position = initial_position
        self.mass = mass

        self.x_list = []
        self.y_list = []
        self.theta_list = [0]
        self.x_list.append(initial_position[0])
        self.y_list.append(initial_position[1])

        self.planet_patch = Circle((self.x_list[0], self.y_list[0]), radius=R*0.05, color="g", alpha=1)
        ax.add_patch(self.planet_patch)

    def update_position(self, angular_velocity, time_step):
        angular_velocity = angular_velocity[2]
        delta_theta = angular_velocity * time_step
        self.theta_list.append(self.theta_list[-1] + delta_theta)

        rotation_matrix = np.array([
            [math.cos(delta_theta),  -math.sin(delta_theta)],
            [math.sin(delta_theta), math.cos(delta_theta)]
        ])

        self.position = rotation_matrix @ self.position

        self.x_list.append(self.position[0])
        self.y_list.append(self.position[1])

    def plot_path(self):
        plt.plot(self.x_list, self.y_list)


class LPoint:
    def __init__(self, initial_position):
        self.position = initial_position

        self.x_list = []
        self.y_list = []
        self.x_list.append(initial_position[0])
        self.y_list.append(initial_position[1])

        self.planet_patch = Circle((initial_position[0], initial_position[1]), radius=R*0.03, color="r", alpha=0.5)
        ax.add_patch(self.planet_patch)

    def update_position(self, angular_velocity, time_step):
        angular_velocity = angular_velocity[2]
        delta_theta = angular_velocity * time_step

        rotation_matrix = np.array([
            [math.cos(delta_theta),  -math.sin(delta_theta)],
            [math.sin(delta_theta), math.cos(delta_theta)]
        ])

        self.position = rotation_matrix @ self.position

        self.x_list.append(self.position[0])
        self.y_list.append(self.position[1])


def animation_init():
    output = []
    testMass.planet_patch.center = (testMass.x_list[0], testMass.y_list[0])
    output.append(testMass.planet_patch)
    earthParticle.planet_patch.center = (earthParticle.x_list[0], earthParticle.y_list[0])
    output.append(earthParticle.planet_patch)
    sunParticle.planet_patch.center = (sunParticle.x_list[0], sunParticle.y_list[0])
    output.append(sunParticle.planet_patch)

    for lpoint in L_Array:
        lpoint.planet_patch.center = (lpoint.x_list[0], lpoint.y_list[0])
        output.append(lpoint.planet_patch.center)

    return output


def animate_func(i):
    i *= frame_cutter_value

    output = []
    testMass.planet_patch.center = (testMass.x_list[i], testMass.y_list[i])
    output.append(testMass.planet_patch)
    earthParticle.planet_patch.center = (earthParticle.x_list[i], earthParticle.y_list[i])
    output.append(earthParticle.planet_patch)
    sunParticle.planet_patch.center = (sunParticle.x_list[i], sunParticle.y_list[i])
    output.append(sunParticle.planet_patch)

    for lpoint in L_Array:
        lpoint.planet_patch.center = (lpoint.x_list[i], lpoint.y_list[i])
        output.append(lpoint.planet_patch)

    if fix_reference_frame:
        rotation_amount = -earthParticle.theta_list[i]
        for artist in output:
            initial_center = [artist.center[0], artist.center[1]]
            offset_matrix = np.array([
                [math.cos(rotation_amount),  -math.sin(rotation_amount)],
                [math.sin(rotation_amount), math.cos(rotation_amount)]
            ])
            transformed_center = offset_matrix @ initial_center
            artist.center = (transformed_center[0], transformed_center[1])

    return output


G_constant = 6.67 * (10**-11)

L1_point = LPoint([L1X, 0])
L2_point = LPoint([L2X, 0])
L3_point = LPoint([L3X, 0])
L4_point = LPoint([L4X, L4Y])
L5_point = LPoint([L5X, L5Y])

L_Array = [L1_point, L2_point, L3_point, L4_point, L5_point]

earthParticle = BigMass(M2, M2Coords)
sunParticle = BigMass(M1, M1Coords)

angularFrequency = math.sqrt((G_constant * (M1 + M2))/(R**3))
angularVelocity = np.array([0, 0, angularFrequency])

# get planet velocity
start_pos = earthParticle.position
earthParticle.update_position(angularVelocity, 0.001)
end_pos = earthParticle.position
delta_pos = numpy.subtract(end_pos, start_pos)
init_velocity = delta_pos / 0.001

perpendicular_matrix = np.array([
    [math.cos(math.pi / 2),  -math.sin(math.pi / 2)],
    [math.sin(math.pi / 2), math.cos(math.pi / 2)]
])

perpendicular_vector = perpendicular_matrix @ init_position
perpendicular_vector = perpendicular_vector / numpy.linalg.norm(perpendicular_vector)

velocity_vector = perpendicular_vector * numpy.linalg.norm(init_velocity)

testMass = TestMass(init_position, velocity_vector)

time = 0
while time < max_time:
    time += timeStep
    earthParticle.update_position(angularVelocity, timeStep)
    sunParticle.update_position(angularVelocity, timeStep)
    testMass.update_position(M1, M2, sunParticle.position, earthParticle.position, timeStep)

    for l_point in L_Array:
        l_point.update_position(angularVelocity, timeStep)

if fix_reference_frame:
    testMass.plot_path()
earthParticle.plot_path()
sunParticle.plot_path()

limit = R * 1.5

ax.set_xlim(-limit, limit)
ax.set_ylim(-limit, limit)

plt.title("Inner Solar System")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")

anim = FuncAnimation(fig, animate_func, init_func=animation_init, frames=int((max_time/timeStep)/frame_cutter_value), interval=0.1, blit=False, repeat=True)

plt.show()