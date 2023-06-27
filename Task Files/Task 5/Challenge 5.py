import matplotlib.pyplot as plt
import numpy as np

import os.path
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))

import PlanetData as Pd
import math
# number planet to be used (will eventually become and input)
def task_5(a):
    fig = plt.figure()
    ax = fig.add_subplot()
    x1= [] # x and y array for eccentric orbit 
    y1= []
    x2= [] # x and y array for circular orbit
    y2= []
    
    ecc = float(Pd.object_data[a][2]) # eccentricity 
    p = float(Pd.object_data[a][6]) # orbital time
    time = p*3 # calculates time for 3 orbits
    increment = float(Pd.object_data[a][8]) # amount time incrememnts (makes pluto not take a whole minute to calculate) 
    
    # defines function to integrate
    def f(x):           
        return (2*math.pi/p)*(1+ecc*math.cos(x))**-2   
    
    # function, upper limit, number of subintervals
    def integration(f, b, n):
      h = (b ) / n
      s = f(b)
      for i in range(1, n, 2):
        s += 4 * f(i * h)
      for i in range(2, n-1, 2):
        s += 2 * f(i * h)
      return s * h / 3
    # determines number of subintervals
    n = 1000
    # generates coordinate arrays for eccentric orbits
    t= 0 
    while t <= time:
        N = (t/p)
        b = 2*math.pi*N
        x1.append(t)
        result = ((integration(f, b, n)) *(p*((1-ecc**2))**(3/2 )*(1/(2*math.pi)) ))
        y1.append(result)
        t += increment
    # generates coordinate arrays for circular orbits 
    t=0
    while t<= time:
        ecc = 0
        N = (t/p) 
        b = 2*math.pi*N
        x2.append(t)
        result = ((integration(f, b, n)) *(p*((1-ecc**2)**(3/2))*(1/(2*math.pi)) ))
        y2.append(result)
        t += increment
    # plots and displays coordinates for both eccentric and circular orbit lines   
    plt.plot(x1, y1, "r", label=f'Epsilon = {Pd.object_data[a][2]}')
    plt.plot(x2, y2, "b",label="Epsilon = 0")
    # labels the axis and gives a title 
    plt.title(f'Orbit angle vs Time for {Pd.object_data[a][7]}')
    plt.ylabel("Orbit polar angle /rad")
    plt.xlabel("Time /years")
    plt.legend()
    plt.show() 
    return fig
task_5(43)
