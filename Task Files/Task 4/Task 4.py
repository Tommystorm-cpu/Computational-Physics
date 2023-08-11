import matplotlib.pyplot as plt
import numpy as np
import math
import os.path

from matplotlib.animation import FuncAnimation
import mpl_toolkits.mplot3d.art3d as art3d
import matplotlib.animation as animation
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))
import PlanetData as Pd
import Theta_Function


# The planet class. An instance is made for each planet
class Planet:
    def __init__(self, data, index, ax, max_period):
        # Initialise variables
        self.period = float(data[6])
        self.semi_major = float(data[1])
        self.eccen = float(data[2])
        self.name = str(data[7])
        self.incline = data[3]
        if self.incline == "N/A":
            self.incline = 0
        else:
            self.incline = math.radians(float(self.incline))
        self.index = index
        self.point = 0
        self.data = data
        self.time_scale = max_period / 1000
        self.colour = (0, 0, 0)
        self.xArray = []
        self.yArray = []
        self.zArray = []

        # Plot the orbit path
        self.plot_orbit()

        # Create the animation path
        self.create_animation_list()

        # Comes after initialisation so that the colour is determined by matplotlib
        self.point, = ax.plot(self.xArray[0], self.yArray[0], self.zArray[0], 'o', markersize=7, color=self.colour)

    def plot_orbit(self):
        x_coords = []
        y_coords = []
        z_coords = []
        # Loops through values of theta
        for theta in np.arange(0, (2 * math.pi) + 1, 0.1):
            semi_major = float(self.data[1])
            eccen = float(self.data[2])

            # Calculate radius based on orbit data
            radius = (semi_major * (1 - (eccen * eccen))) / (1 - eccen * math.cos(theta))

            # Calculate coordinates
            x = radius * math.cos(theta)
            y = radius * math.sin(theta)

            # Offset coordinates for incline
            z = x * math.sin(self.incline)
            x = x * math.cos(self.incline)

            # Append coordinates to list
            x_coords.append(x)
            y_coords.append(y)
            z_coords.append(z)

        # Plot orbit
        line = plt.plot(x_coords, y_coords, z_coords,  label=self.name)
        self.colour = line[0].get_color() # Used for planet colour

    def create_animation_list(self):
        num_of_orbits = 2 # Number of orbits of the outer planet to run the animation for

        # Loop through values of time
        for time_passed in np.arange(0, num_of_orbits *1000, 1):
            time = time_passed * self.time_scale # Scales based on orbital period
            theta = Theta_Function.get_angle(self.data, time) # Uses task 5 to get angle at a given time

            # Calculates radius
            r = (self.semi_major*(1-self.eccen**2)) / (1 - (self.eccen * math.cos(theta)))

            # Calculate coordinates
            x = r * math.cos(theta)
            y = r * math.sin(theta)

            # Adjust for incline
            z = x * math.sin(self.incline)
            x = x * math.cos(self.incline)

            # Append to animation list
            self.xArray.append(x)
            self.yArray.append(y)
            self.zArray.append(z)


def animation_init():
    # Creates the animation scene
    output = []
    for planet in planet_list:
        planet.point.set_data_3d([planet.xArray[0]], [planet.yArray[0]], [planet.zArray[0]])
        output.append(planet.point)
    return output


def animate_func(i):
    # Called every frame (i) to update planet positions
    output = []
    for planet in planet_list:
        planet.point.set_data_3d([planet.xArray[i]], [planet.yArray[i]], [planet.zArray[i]])
        output.append(planet.point)
    return output


# Input planet system here
planet_system_name = "Outer Solar"

# Create figure
fig = plt.figure()
ax = fig.add_subplot(projection="3d")
title = planet_system_name + " System"
planet_system = Pd.system_list[planet_system_name]

ax.set_aspect('equal')
limit = float(planet_system[len(planet_system)-1][1])

ax.set_xlim(-limit, limit)
ax.set_ylim(-limit, limit)
ax.set_zlim(-limit, limit)

ax.set_xlabel("X (AU)")
ax.set_ylabel("Y (AU)")
ax.set_zlabel("Z (AU)")

ax.xaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))
ax.yaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))
ax.zaxis.set_pane_color((1.0, 1.0, 1.0, 0.0))

ax.grid(False)

plt.title(title)

# Plot sun
plt.plot(0, 0, 0, marker="o", markersize=10, markerfacecolor="yellow", markeredgecolor=(0.6, 0.6, 0))

planet_list = []

# Get the largest orbital period
max_period = 0
for planet in planet_system:
    planet = planet_system[planet]
    if float(planet[6]) > max_period:
        max_period = float(planet[6])

# Loop through planets and create a list of them
for count, planet in enumerate(planet_system):
    plan_class = Planet(planet_system[planet], count, ax, max_period)
    planet_list.append(plan_class)

# Labels created
#plt.legend(loc="upper right")

# Start animation
anim = FuncAnimation(fig, animate_func, init_func=animation_init, frames=len(planet_list[0].xArray), interval=0.1, blit=True, repeat=True)

# Show graph
plt.show()