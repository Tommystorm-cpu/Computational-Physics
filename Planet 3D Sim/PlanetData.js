export { system_list, object_data, system_scales, sun_radii, distance_thresholds, intensity_params }

//all the planets
const object_data = {
    "Mercury": 0,
    "Venus": 1,
    "Earth": 2,
    "Mars": 3,
    "Jupiter": 4,
    "Saturn": 5,
    "Uranus": 6,
    "Neptune": 7,
    "Pluto": 8,
    "47 Ursae Majoris b": 9,
    "47 Ursae Majoris c": 10,
    "47 Ursae Majoris d": 11,
    "55 Cancri b": 12,
    "55 Cancri c": 13,
    "55 Cancri d": 14,
    "55 Cancri e": 15,
    "55 Cancri f": 16,
    "61 Virginis b": 17,
    "61 Virginis c": 18,
    "61 Virginis d": 19,
    "CoRoT-7 b": 20,
    "CoRoT-7 c": 21,
    "DMPP-1 b": 22,
    "DMPP-1 c": 23,
    "DMPP-1 d": 24,
    "DMPP-1 e": 25,
    "EPIC 249893012 b": 26,
    "EPIC 249893012 c": 27,
    "EPIC 249893012 d": 28,
    "GJ 1061 b": 29,
    "GJ 1061 c": 30,
    "GJ 1061 d": 31,
    "GJ 163 b": 32,
    "GJ 163 c": 33,
    "GJ 163 d": 34,
    "Kepler-106 b": 35,
    "Kepler-106 c": 36,
    "Kepler-106 d": 37,
    "Kepler-106 e": 38,
    "TOI-700 b": 39,
    "TOI-700 c": 40,
    "TOI-700 d": 41,
    "TOI-700 e": 42,
    "HR 5183 b": 43
};

/*
 Mass in Earth masses, semi-major axis, eccentricity, orbital inclination/degrees,
 Radius in earth radii, Rotational period/days, orbital period/years, planet name, texture type, cloud type
*/

// inner_planets
const inner_planets = {
    0: [0.055, 0.387, 0.21, 7, 0.383, 58.646, 0.243, "Mercury", "Mercury", 0],
    1: [0.815, 0.723, 0.01, 3.39, 0.949, 243.018, 0.615, "Venus", "Venus", 0],
    2: [1, 1, 0.02, 0, 1, 0.997, 1, "Earth", "Earth", 1],
    3: [0.107, 1.523, 0.09, 1.85, 0.533, 1.026, 1.881, "Mars", "Mars", 0],
};

// outer_planets
const outer_planets = {
    0: [317.85, 5.202, 0.05, 1.31, 11.209, 0.413, 11.861, "Jupiter", "Jupiter", 0],
    1: [95.159, 9.576, 0.06, 2.49, 9.449, 0.444, 29.628, "Saturn", "Saturn", 0],
    2: [14.5, 19.293, 0.05, 0.77, 4.007, 0.718, 84.747, "Uranus", "Uranus", 0],
    3: [17.204, 30.246, 0.01, 1.77, 3.883, 0.671, 166.344, "Neptune", "Neptune", 0],
    4: [0.003, 39.509, 0.25, 17.5, 0.187, 6.387, 248.348, "Pluto", "Pluto", 0],
};

// solar_system, GJ_system, Ursae_Majoris_47, Cancri_55, Virginis_61, CoRoT_7, DMPP_1, EPIC_249893012, GJ_1061, GJ_163, Kepler_106, TOI_700, HR_5183
const solar_system = {
    0: [0.055, 0.387, 0.21, 7, 0.383, 58.646, 0.243, "Mercury", "Mercury", 0],
    1: [0.815, 0.723, 0.01, 3.39, 0.949, 243.018, 0.615, "Venus", "Venus", 0],
    2: [1, 1, 0.02, 0, 1, 0.997, 1, "Earth", "Earth", 1],
    3: [0.107, 1.523, 0.09, 1.85, 0.533, 1.026, 1.881, "Mars", "Mars", 0],
    4: [317.85, 5.202, 0.05, 1.31, 11.209, 0.413, 11.861, "Jupiter", "Jupiter", 0],
    5: [95.159, 9.576, 0.06, 2.49, 9.449, 0.444, 29.628, "Saturn", "Saturn", 0],
    6: [14.5, 19.293, 0.05, 0.77, 4.007, 0.718, 84.747, "Uranus", "Uranus", 0],
    7: [17.204, 30.246, 0.01, 1.77, 3.883, 0.671, 166.344, "Neptune", "Neptune", 0],
    8: [0.003, 39.509, 0.25, 17.5, 0.187, 6.387, 248.348, "Pluto", "Pluto", 0],
};

const GJ_system = {
    0: [1.37, 0.021, 0.31, "N/A", 1.1, "N/A", 0.008767123, "GJ 1061 b"],
    1: [1.74, 0.035, 0.29, "N/A", 1.18, "N/A", 0.01835616, "GJ 1061 c"],
    2: [1.64, 0.054, 0.53, "N/A", 1.16, "N/A", 0.0356164, "GJ 1061 d"],
};

const Ursae_Majoris_47 = {
    0: [804.30428, 2.1, 0.03, "N/A", 13.226521, "N/A", 3, "47 Ursae Majoris b", "blue giant", 0],
    1: [171.66969, 3.6, 0.1, "N/A", 14.235323, "N/A", 6.6, "47 Ursae Majoris c", "grey giant", 0],
    2: [521.3672, 11.6, 0.16, "N/A", 13.4507, "N/A", 38.4, "47 Ursae Majoris d", "pink giant", 0],
};

const Cancri_55 = {
    0: [9.310125386, 0.1134, 0, "N/A", 13.899055, "N/A", 0.04027397, "55 Cancri b", "orange giant", 0],
    1: [54.48923092, 0.2373, 0.03, "N/A", 8.5187759, "N/A", 0.1216438, "55 Cancri c", "orange giant", 0],
    2: [43.4681751, 5.957, 0.13, "N/A", 13.002342, "N/A", 15.3, "55 Cancri d", "green giant", 0],
    3: [7.99, 0.01544, 0.05, "N/A", 1.875, "N/A", 0.001917808, "55 Cancri e", "lava rock", 0],
    4: [44.8248632, 0.7708, 0.08, "N/A", 7.58843593, "N/A", 0.712054795, "55 Cancri f", "yellow giant", 0],
};

const Virginis_61 = {
    0: [5.1, 0.050201, 0.12, "N/A", 2.11, "N/A", 0.01150685, "61 Virginis b", "purple giant", 0],
    1: [18.2, 0.2175, 0.14, "N/A", 4.46114845, "N/A", 0.10411, "61 Virginis c", "pink giant", 0],
    2: [22.9, 0.476, 0.35, "N/A", 5.11126556, "N/A", 0.3369863, "61 Virginis d", "green giant", 0],
};

const CoRoT_7 = {
    0: [4.07661, 1.681, 0, "N/A", 1.681, "N/A", 0.002465753, "CoRoT-7 b", "red rock", 0],
    1: [8.4, 0.046, 0, "N/A", 2.83585567, "N/A", 0.01013699, "CoRoT-7 c", "yellow giant", 0],
};

const DMPP_1 = {
    0: [24.27, 0.1462, 0.083, "N/A", 5.29060821, "N/A", 0.050958904, "DMPP-1 b", "pink giant", 0],
    1: [9.6, 0.0733, 0.057, "N/A", 3.06003399, "N/A", 0.01808219, "DMPP-1 c", "red giant", 0],
    2: [3.35, 0.0422, 0.07, "N/A", 1.65, "N/A", 0.007945205, "DMPP-1 d", "red rock", 1],
    3: [4.13, 0.0651, 0.07, "N/A", 1.86, "N/A", 0.01506849, "DMPP-1 e", "red rock", 1],
};

const EPIC_249893012 = {
    0: [8.75, 0.047, 0.06, "N/A", 1.95, "N/A", 0.009863014, "EPIC 249893012 b", "red rock", 1],
    1: [14.67, 0.13, 0.07, "N/A", 3.66531544, "N/A", 0.042739726, "EPIC 249893012 c", "grey giant", 0],
    2: [10.18, 0.22, 0.15, "N/A", 3.94553833, "N/A", 0.097808219, "EPIC 249893012 d", "blue giant", 0],
};

const GJ_1061 = {
    0: [1.37, 0.021, 0.31, "N/A", 1.1, "N/A", 0.008767123, "GJ 1061 b", "orange rock", 0],
    1: [1.74, 0.035, 0.29, "N/A", 1.18, "N/A", 0.01835616, "GJ 1061 c", "orange rock", 1],
    2: [1.64, 0.054, 0.53, "N/A", 1.16, "N/A", 0.0356164, "GJ 1061 d", "red rock", 1],
};

const GJ_163 = {
    0: [10.6, 0.0607, 0.07, "N/A",  3.2505856, "N/A", 0.02356164, "GJ 163 b", "green giant", 0],
    1: [6.8, 0.1254, 0.1, "N/A", 2.4995882, "N/A", 0.070136986, "GJ 163 c", "green giant", 0],
    2: [29.4, 1.0304, 0.37, "N/A", 5.91830749, "N/A",  1.7, "GJ 163 d", "blue giant", 0],
};

const Kepler_106 = {
    0: [5.3, 0.0648, 0, "N/A", 0.82, "N/A", 0.0169863, "Kepler-106 b", "red rock", 2],
    1: [10.44, 0.1096, 0, "N/A", 2.4995882, "N/A", 0.037260274, "Kepler-106 c", "orange rock", 1],
    2: [8.1, 0.1602, 0, "N/A", 0.95, "N/A", 0.0657534, "Kepler-106 d", "red rock", 1],
    3: [11.17, 0.2395, 0, "N/A", 2.55563278, "N/A", 0.12, "Kepler-106 e", "red rock", 1],
};

const TOI_700 = {
    0: [0.704, 0.0677, 0.08, "N/A", 0.914, "N/A", 0.0273973, "TOI-700 b", "orange rock", 2],
    1: [7.27, 0.0929, 0.07, "N/A", 2.60046844, "N/A", 0.044109589, "TOI-700 c", "purple giant", 0],
    2: [1.25, 0.1633, 0.04, "N/A", 1.073, "N/A", 0.10246575, "TOI-700 d", "red rock", 1],
    3: [0.818, 0.134, 0.06, "N/A",  0.953, "N/A", 0.076164384, "TOI-700 e", "red rock", 1],
};

const HR_5183 = {
    0: [1052.272, 18, 0.84, "N/A", 13.11443, "N/A", 74, "HR 5183 b", "pink giant", 0],
};

const system_list = {
    "Solar": solar_system,
    "Inner Solar": inner_planets,
    "Outer Solar": outer_planets,
    "47 Ursae Majoris": Ursae_Majoris_47,
    "55 Cancri": Cancri_55,
    "61 Virginis": Virginis_61,
    "CoRoT-7": CoRoT_7,
    "DMPP-1": DMPP_1,
    "EPIC 249893012": EPIC_249893012,
    "GJ 1061": GJ_1061,
    "GJ 163": GJ_163,
    "Kepler-106": Kepler_106,
    "TOI-700": TOI_700,
    "HR 5183": HR_5183,
};

const system_scales = {
    "Solar": 200,
    "Inner Solar": 200,
    "Outer Solar": 200,
    "47 Ursae Majoris": 50,
    "55 Cancri": 5,
    "61 Virginis": 10,
    "CoRoT-7": 10,
    "DMPP-1": 5,
    "EPIC 249893012": 5,
    "GJ 1061": 5,
    "GJ 163": 5,
    "Kepler-106": 7,
    "TOI-700": 7,
    "HR 5183": 100,
};

const sun_radii = {
    "Solar": 109.29,
    "Inner Solar": 109.29,
    "Outer Solar": 109.29,
    "47 Ursae Majoris": 127.97,
    "55 Cancri": 125.78,
    "61 Virginis": 107.74,
    "CoRoT-7": 1.57,
    "DMPP-1": 141.95,
    "EPIC 249893012": 198.74,
    "GJ 1061": 16.61,
    "GJ 163": 44.69,
    "Kepler-106": 113.66,
    "TOI-700": 1.19,
    "HR 5183": 167.21,
}

const distance_thresholds = {
    "Solar": 25000,
    "Inner Solar": 25000,
    "Outer Solar": 25000,
    "47 Ursae Majoris": 25000,
    "55 Cancri": 10000,
    "61 Virginis": 2500,
    "CoRoT-7": 2500,
    "DMPP-1": 2500,
    "EPIC 249893012": 5000,
    "GJ 1061": 250,
    "GJ 163": 2500,
    "Kepler-106": 800,
    "TOI-700": 200,
    "HR 5183": 25000
}

const intensity_params = {
    "Solar": [10000, 100],
    "Inner Solar": [10000, 100],
    "Outer Solar": [10000, 100],
    "47 Ursae Majoris": [10000, 100],
    "55 Cancri": [500, 25],
    "61 Virginis":[1000, 50],
    "CoRoT-7":[100, 25],
    "DMPP-1":[100, 25],
    "EPIC 249893012":[100, 25],
    "GJ 1061": [100, 25],
    "GJ 163":[100, 25],
    "Kepler-106": [100, 25],
    "TOI-700": [100, 25],
    "HR 5183": [10000, 250]
}