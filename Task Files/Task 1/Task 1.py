import matplotlib.pyplot as plt  # imports modules
import numpy as np
import PlanetData as Pd
plt.ylabel("T/Yr")  # labels axis
plt.xlabel("(a/AU)^(3/2)")

y = []  # data set for y axis
x = []   # data set for x axis
size = len(Pd.object_data)  # number of entries in object_data library

for a in range(size):
    x.append(float(Pd.object_data[a][1]) ** 1.5)  # computes data for the x axis
    y.append(float(Pd.object_data[a][6]))

line = np.polyfit(x, y, 1)   # computes line of best fit in the form y = mx + c
m = line[0]
c = line[1]
plt.axline(xy1=(0, c), slope=m, color="r", label=f'$ y = {m}x$')  # plots line of best fit, assigns gradient as legend
plt.plot(x, y, "bs")  # plots data as points

plt.legend(loc="upper right")
plt.show()
