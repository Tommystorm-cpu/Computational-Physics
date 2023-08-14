import matplotlib.pyplot as plt
import numpy as np
from matplotlib.animation import FuncAnimation
from matplotlib.patches import Circle

import os.path
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath("__file__")))))

import math

"""Input values"""

#semi-major axis of mutual star orbit in AU
a = 3
#planet (initial) circular orbit radius about star 1
ap = a/3.11
#initial angle from x axis (anticlockwise) of planet / radians
theta0 = math.pi/4
#masses of stars in solar masses
M1 = 3
M2 = 2
#Initial vy velocity multiplier from mutually circular of stars
k = 1.1
#determines which star the planet orbits
star_orbit = 1

""" gravity function"""
def gravity( x, y, x1, y1, M1 ):
    r = ((x - x1)**2 +(y-y1)**2)**(1/2)
    if r > 0.01:
        ax = -(4 * (math.pi**2))*M1* (x-x1)/ (r**3)
        ay =  -(4 * (math.pi**2))*M1* (y-y1)/ (r**3)
    else:
        ax = 0
        ay = 0
    return ax, ay

"""Initial conditions"""
#Determine period in years via Kepler III for binary stars
T = ((1/(M1+M2))*(a**3))**(1/2)

#Set initial x,y,vx,vy,t parameters

#Star 1
X1 = [-M2*a/(M1+M2)]
Y1= [0]
VX1 = 0
VY1 = k*2*math.pi*X1[0]/T

#Star 2
X2 = [M1*a/(M1+M2)]
Y2 = [0]
VX2 = 0
VY2 = k*2*math.pi*X2[0]/T

#Planet
if star_orbit == 1:
    s = X1[0]
    starVY = VY1
    starM = M1
elif star_orbit == 2:
    s = X2[0]
    starVY = VY2
    starM = M2

t = [0]
x = [s + ap*math.cos(theta0)]
y=  [ap*math.sin(theta0)]
vx = -2 * np.pi * (starM / ap)**(1/2) * np.sin(theta0)
vy = 2 * np.pi * (starM / ap)**(1/2) * np.cos(theta0) + starVY

#initial acceleration of star 1
aX1, aY1 = gravity( X1[0],Y1[0], X2[0], Y2[0], M2 )

#initial acceleration of star 2
aX2, aY2 = gravity( X2[0],Y2[0], X1[0], Y1[0], M1 )

#initial acceleration of planet
ax1, ay1 = gravity( x[0],y[0], X1[0], Y1[0], M1 )
ax2, ay2 = gravity( x[0],y[0], X2[0], Y2[0], M2 )
ax = ax1 + ax2
ay = ay1 + ay2

"""verlet method computing"""

n = 0
#number of orbital periods
num_periods = 22
#timestep in years
dt = 0.001
while t[-1] < num_periods * T:
    t.append(t[n] + dt)

    #x,y update for stars and planet
    X1.append(X1[n] + VX1*dt + 0.5*aX1*dt**2)
    Y1.append(Y1[n] + VY1*dt + 0.5*aY1*dt**2)
    X2.append(X2[n] + VX2*dt + 0.5*aX2*dt**2)
    Y2.append(Y2[n] + VY2*dt + 0.5*aY2*dt**2)
    x.append(x[n] + vx*dt + 0.5*ax*dt**2)
    y.append(y[n] + vy*dt + 0.5*ay*dt**2)

    ax_old = ax
    ay_old = ay
    aX1_old = aX1
    aY1_old = aY1
    aX2_old = aX2
    aY2_old = aY2

    aX1, aY1 = gravity( X1[-1],Y1[-1], X2[-1], Y2[-1], M2 )
    aX2, aY2 = gravity( X2[-1],Y2[-1], X1[-1], Y1[-1], M1 )
    ax1, ay1 = gravity( x[-1],y[-1], X1[-1], Y1[-1], M1 )
    ax2, ay2 = gravity( x[-1],y[-1], X2[-1], Y2[-1], M2 )
    ax = ax1 + ax2
    ay = ay1 + ay2

    VX1 = VX1 + 0.5*dt*( aX1_old + aX1 )
    VY1 = VY1 + 0.5*dt*( aY1_old + aY1 )
    VX2 = VX2 + 0.5*dt*( aX2_old + aX2 )
    VY2 = VY2 + 0.5*dt*( aY2_old + aY2 )
    vx = vx + 0.5*dt*( ax_old + ax )
    vy = vy + 0.5*dt*( ay_old + ay )
    
    n = n + 1

"""plotting"""

# Create a figure and axis for the animation
fig, ax = plt.subplots()
ax.set_aspect('equal', adjustable='box')

plt.plot(0, 0, marker="+", markersize=5, color='k')

# Create an empty line for the trail of the planet
planet_trail_line, = ax.plot([], [], 'g', lw=1, alpha=0.75, zorder = 2, label = "Planet")

# Create circular patches for the stars and planet
planet_patch = Circle((x[0], y[0]), 0.1, color='g', alpha=1, zorder = 2)
star1_patch = Circle((X1[0], Y1[0]), 0.1 * M1, color='r', alpha=1, zorder = 3)
star2_patch = Circle((X2[0], Y2[0]), 0.1 * M2, color='b', alpha=1, zorder = 3)

# Add the patches to the axis
ax.add_patch(planet_patch)
ax.add_patch(star1_patch)
ax.add_patch(star2_patch)

# Set axis limits
ax.set_xlim(-1.1* a, 1.1* a)
ax.set_ylim(-1.1* a, 1.1* a)

# Set axis labels
ax.set_xlabel("X (AU)")
ax.set_ylabel("Y (AU)")

# Animation initialization function
def init():
    planet_trail_line.set_data([], [])
    planet_patch.center = (x[0], y[0])
    star1_patch.center = (X1[0], Y1[0])
    star2_patch.center = (X2[0], Y2[0])
    return  planet_trail_line, planet_patch, star1_patch, star2_patch
v = 3 # controls the speed of the simulation 
# Animation update function
def animate(i):
    planet_patch.center = (x[v*i], y[v*i])
    star1_patch.center = (X1[v*i], Y1[v*i])
    star2_patch.center = (X2[v*i], Y2[v*i])
    planet_trail_line.set_data(x[:v*i], y[:v*i])  # Set the trail line data
    return  planet_patch, star1_patch, star2_patch, planet_trail_line

# Create the animation
anim = FuncAnimation(fig, animate, init_func=init, frames=len(x)//v, interval=33.3, blit=False, repeat = False)
ax.plot(x, y, "g", lw=0.5, alpha=0.25, zorder=1)
ax.plot(X1, Y1, "r", lw=0.5, zorder = 1, label= "Star 1")
ax.plot(X2, Y2,  "b", lw=0.5, zorder = 1, label = "Star 2")
plt.legend(loc="upper right")
plt.title("Binary Star System Simulation")
# Display the animation
plt.show()

    
              
    
    
