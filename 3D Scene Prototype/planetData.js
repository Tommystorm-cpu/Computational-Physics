// Semi-major axis, eccentricity, orbital inclination/degrees,
// Radius in earth radii, Rotational period/days, orbital period/years, Texture Type, Clouds?

// For the stars: radius in earth radii, luminosity in sol lumens, texture

const solarSystem = {
    "Sun": [109.076, 1, "Sun"],
    "Mercury": [0.387, 0.21, 7, 0.383, 58.646, 0.243, "Mercury", 0],
    "Venus": [0.723, 0.01, 3.39, 0.949, 243.018,  0.615, "Venus", 0],
    "Earth": [1, 0.02, 0, 1, 0.997, 1, "Earth", 1],
    "Mars": [1.523, 0.09, 1.85, 0.533, 1.026, 1.881, "Mars", 0],
    "Jupiter": [5.202, 0.05, 1.31, 11.209, 0.413, 11.861, "Jupiter", 0],
    "Saturn": [9.576, 0.06, 2.49, 9.449, 0.444, 29.628, "Saturn", 0],
    "Uranus": [19.293, 0.05, 0.77, 4.007, 0.718, 84.747, "Uranus", 0],
    "Neptune": [30.246, 0.01, 1.77, 3.883, 0.671, 166.344, "Neptune", 0],
    "Pluto": [39.509, 0.25, 17.5, 0.187, 6.387, 248.348, "Pluto", 0]
};

// Pluto radius 0.187

export {solarSystem};