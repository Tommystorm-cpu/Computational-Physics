import matplotlib.pyplot as plt  #imports modules
import numpy as np

plt.ylabel("T/Yr")  #labels axis
plt.xlabel("(a/AU)^(3/2)")

y = [0.24, 0.62, 1, 1.88, 11.86, 29.63, 84.75, 166.34, 248.35] # data set for orbital period in years (starting from mercury and ending in pluto) 
d = [0.387, 0.723, 1, 1.523, 5.2, 9.58, 19.29, 30.25, 39.51] # data set for semi-major azis(starting from mercury and ending in pluto)
x = []   #data set for x axis 
size = len(y) #size of data set

for a in range(size):
    x.append(d[a] ** 1.5) #computes data for the x axis

m, b = np.polyfit(x, y, 1)   #computes line of best fit in the form y = mx + b
plt.axline(xy1=(0, 0), slope=m, color="r", label=f'$ y = {m}x$') #plots line of best fit and assigns gradient as legend
plt.axis([0, x[size-1]*1.1, 0, y[size -1]*1.1]) #defines limits on axis
plt.plot(x, y, "bs") #plots data as points 

plt.legend()
plt.show()
