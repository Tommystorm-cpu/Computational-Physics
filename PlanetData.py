import numpy as np

# Mass in Earth masses, semi-major axis, eccentricity, orbital inclination/degrees,
# Radius in earth radii, Rotational period/days, orbital period/years, planet name,
#task 5 time increment 

object_data = {
    0: np.array([0.055, 0.387, 0.21, 7, 0.383, 58.646, 0.243, "Mercury", 0.01]),
    1: np.array([0.815, 0.723, 0.01, 3.39, 0.949, 243.018,  0.615, "Venus", 0.01]),
    2: np.array([1, 1, 0.02, 0, 1, 0.997, 1, "Earth", 0.1]),
    3: np.array([0.107, 1.523, 0.09, 1.85, 0.533, 1.026, 1.881, "Mars", 0.1]),
    4: np.array([317.85, 5.202, 0.05, 1.31, 11.209, 0.413, 11.861, "Jupiter", 1]),
    5: np.array([95.159, 9.576, 0.06, 2.49, 9.449, 0.444, 29.628, "Saturn", 1]),
    6: np.array([14.5, 19.293, 0.05, 0.77, 4.007, 0.718, 84.747, "Uranus", 1]),
    7: np.array([17.204, 30.246, 0.01, 1.77, 3.883, 0.671, 166.344, "Neptune", 2]),
    8: np.array([0.003, 39.509, 0.25, 17.5, 0.187, 6.387, 248.348, "Pluto", 2])
}
    
inner_planets = {
    0: np.array([0.055, 0.387, 0.21, 7, 0.383, 58.646, 0.243, "Mercury"]),
    1: np.array([0.815, 0.723, 0.01, 3.39, 0.949, 243.018,  0.615, "Venus"]),
    2: np.array([1, 1, 0.02, 0, 1, 0.997, 1, "Earth"]),
    3: np.array([0.107, 1.523, 0.09, 1.85, 0.533, 1.026, 1.881, "Mars"])
}

outer_planets = {
    0: np.array([317.85, 5.202, 0.05, 1.31, 11.209, 0.413, 11.861, "Jupiter"]),
    1: np.array([95.159, 9.576, 0.06, 2.49, 9.449, 0.444, 29.628, "Saturn"]),
    2: np.array([14.5, 19.293, 0.05, 0.77, 4.007, 0.718, 84.747, "Uranus"]),
    3: np.array([17.204, 30.246, 0.01, 1.77, 3.883, 0.671, 166.344, "Neptune"]),
    4: np.array([0.003, 39.509, 0.25, 17.5, 0.187, 6.387, 248.348, "Pluto"])
}
    
