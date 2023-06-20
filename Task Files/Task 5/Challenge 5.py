import matplotlib.pyplot as plt
import numpy as np
import PlanetData as Pd
import math

plt.ylabel("orbit polar angle /rad")
plt.xlabel("time /years")

w= []
y= []
k= []
l= []
#time /years, planet number
ecc = float(Pd.object_data[8][2]) #eccentricity 
p = float(Pd.object_data[8][6]) # orbital time

def f(x):           
    return (1-ecc*math.cos(x))**2    # Define function to integrate

# function, lower limit, upper limit, number of subintervals
def integration(f, a, b, n,):
  h = (b - a) / n
  s = f(a) + f(b)
  for i in range(1, n, 2):
    s += 4 * f(a + i * h)
  for i in range(2, n-1, 2):
    s += 2 * f(a + i * h)
  return s * h / 3

a = 0
n = 10000

for t in range(0, 800):
    N = (t/p) # number of orbits
    b = 2*math.pi*N
    w.append(t)
    result = integration(f, a, b, n)
    y.append(result)

for t in range(0, 800):
    ecc = 0
    N = (t/p) # number of orbits
    b = 2*math.pi*N
    k.append(t)
    result = integration(f, a, b, n)
    l.append(result)
plt.plot(w, y, "r")
plt.plot(k, l, "b")
plt.show()

