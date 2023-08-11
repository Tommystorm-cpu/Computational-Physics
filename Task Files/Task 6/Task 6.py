import matplotlib.pyplot as plt
import numpy as np
import math
import os.path
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))
import PlanetData as Pd
import Theta_Function

# Create graph
fig = plt.figure()
ax = fig.add_subplot()
ax.set_aspect('equal', adjustable='box')

# Longer orbit goes second!
two_planets = [Pd.Kepler_106[2], Pd.Kepler_106[3]]

# Setting parameters
num_of_orbits = 10
total_time = num_of_orbits * float(two_planets[1][6])
time_interval = total_time / 1234
time_elapsed = 0

# Loop through time
while time_elapsed < total_time:
    x_coords = []
    y_coords = []
    # Determine positions of both planets and put them in the same array
    for i in range(2):
        theta = Theta_Function.get_angle(two_planets[i], time_elapsed)
        semi_major = float(two_planets[i][1])
        eccen = float(two_planets[i][2])
        radius = (semi_major * (1 - (eccen * eccen))) / (1 - eccen * math.cos(theta))
        x = radius * math.cos(theta)
        y = radius * math.sin(theta)
        x_coords.append(x)
        y_coords.append(y)
    time_elapsed += time_interval

    # Plot line between the two points
    plt.plot(x_coords, y_coords, color=(0.3, 0.3, 0.3), linewidth=0.5)

# Plot orbits
for i in range(2):
    x_coords = []
    y_coords = []
    # Loop through whole orbit
    for theta in np.arange(0, (2*math.pi)+1, 0.1):
        semi_major = float(two_planets[i][1])
        eccen = float(two_planets[i][2])
        radius = (semi_major*(1-(eccen*eccen)))/(1-eccen*math.cos(theta))
        x = radius * math.cos(theta)
        y = radius * math.sin(theta)
        x_coords.append(x)
        y_coords.append(y)
    # Plot orbit
    plt.plot(x_coords, y_coords, label=two_planets[i][7])

# Format graph
plt.title(f"{two_planets[0][7]} {two_planets[1][7]} Spirograph")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")
plt.legend(loc="upper right")
plt.savefig("task6preview3.png", bbox_inches = "tight")

# Display graph
plt.show()
