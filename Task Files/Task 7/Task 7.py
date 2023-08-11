import matplotlib.pyplot as plt
import numpy as np
import math
import os.path
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))
import PlanetData as Pd
import Theta_Function


def task7(planet_system, planet):
    # Calculates time to run the simulation for
    run_time = int(round(-1 * math.log10(float(planet_system[len(planet_system)-1][1])) * 13 + 31))

    # Loops through planets
    for i in range(len(planet_system)):
        x_coords = []
        y_coords = []

        # Loop through time, scaled by planet period
        for t in np.arange(0, run_time*float(planet_system[i][6]), 0.01*float(planet_system[i][6])):
            # Calculates position of planet
            theta = Theta_Function.get_angle(planet_system[i], t)
            semi_major = float(planet_system[i][1])
            eccen = float(planet_system[i][2])
            radius = (semi_major*(1-(eccen*eccen)))/(1-eccen*math.cos(theta))
            x = radius * math.cos(theta)
            y = radius * math.sin(theta)

            # Calculates position of centre planet                                         
            centre_theta = Theta_Function.get_angle(planet_system[planet], t)
            centre_semi_major = float(planet_system[planet][1])
            centre_eccen = float(planet_system[planet][2])
            centre_radius = (centre_semi_major*(1-(centre_eccen*centre_eccen)))/(1-centre_eccen*math.cos(centre_theta))
            centre_x = centre_radius *math.cos(centre_theta)
            centre_y = centre_radius *math.sin(centre_theta)

            # Translates position                      
            x_coords.append(float(x - centre_x))
            y_coords.append(float(y - centre_y))
        
        # Plot planets path
        plt.plot(x_coords, y_coords, label=planet_system[i][7])

    # Sun
    sun_x_coords =[]
    sun_y_coords = []
    
    # Loop through theta
    for theta in np.arange(0, (2*math.pi)+1, 0.0001):
        # Plot perfect ellipse as it'll be the same shape as center planets normal orbit
        sun_radius = (centre_semi_major*(1-(centre_eccen*centre_eccen)))/(1-centre_eccen*math.cos(theta))
        sun_x = -(sun_radius *math.cos(theta))
        sun_y = -(sun_radius *math.sin(theta))

        sun_x_coords.append(sun_x)
        sun_y_coords.append(sun_y)
    # Plot sun's path
    plt.plot(sun_x_coords, sun_y_coords, color="y", label="Sun")

# Create figure
fig = plt.figure()
ax = fig.add_subplot()
ax.set_aspect('equal', adjustable='box')

# Choose system and planet
system_name = "Inner Solar"
planet = 2 # Starts at 0, the innermost planet

# Plot spirograph
planet_system = Pd.system_list[system_name]
task7(planet_system, planet)

# Format graph
plt.title(system_name + " System")
plt.xlabel("X (AU)")
plt.ylabel("Y (AU)")
plt.legend(loc="upper right")

# Display graph
plt.show()
