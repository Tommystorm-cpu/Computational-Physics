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
    8: np.array([0.003, 39.509, 0.25, 17.5, 0.187, 6.387, 248.348, "Pluto", 2]),         # 0-8 are celestial bodies that orbit sol, 9 and above orbit other stars
    9: np.array([804.30428,	2.1,	0.03,	N/A	,13.226521,	N/A,	3, "47 Ursae Majoris b", 0.1]),
    10: np.array([171.66969,	3.6,	0.1,	N/A,	14.235323,	N/A,	6.6, "47 Ursae Majoris c", 0.1]),
    11: np.array([521.3672,	11.6,	0.16,	N/A,	13.4507,	N/A,	38.4, "47 Ursae Majoris d", 1]),
    12: np.array([9.310125386,	0.1134,	0,	N/A,	13.899055,	N/A,	0.04027397, "55 Cancri b", 0.0001]),
    13: np.array([54.48923092,	0.2373,	0.03,	N/A,	8.5187759,	N/A,	0.1216438, "55 Cancri c", 0.0001]),
    14: np.array([43.4681751,	5.957,	0.13,	N/A,	13.002342,	N/A,	15.3, "55 Cancri d", 0.01]),
    15: np.array([7.99,	0.01544,	0.05,	N/A,	1.875,	N/A,	0.001917808, "55 Cancri e", 0.000001]),
    16: np.array([44.8248632,	0.7708,	0.08,	N/A,	7.58843593,	N/A,	0.712054795, "55 Cancri f", 0.001])
    
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
    
