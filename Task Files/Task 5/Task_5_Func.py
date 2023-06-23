import matplotlib.pyplot as plt
import numpy as np
import PlanetData as Pd
import math
# number planet to be used (will eventually become and input)
# function, upper limit, number of subintervals
def integration(f, b, n, p, ecc):
    h = (b ) / n
    s = f(b, p, ecc)
    
    for i in range(1, n, 2):
        s += 4 * f(i * h, p, ecc)
    for i in range(2, n-1, 2):
        s += 2 * f(i * h, p, ecc)
    return s * h / 3

# defines function to integrate
def f(x, p, ecc):           
    return (2*math.pi/p)*(1+ecc*math.cos(x))**-2   

def task_5(a, t):    
    ecc = float(Pd.object_data[a][2]) # eccentricity 
    p = float(Pd.object_data[a][6]) # orbital time

    # determines number of subintervals
    n = 4
    # generates coordinate arrays for eccentric orbits
    N = (t/p)
    b = 2*math.pi*N
    result = ((integration(f, b, n, p, ecc)) *(p*((1-ecc**2))**(3/2 )*(1/(2*math.pi)) ))
    return result

print(task_5(8, 600))
