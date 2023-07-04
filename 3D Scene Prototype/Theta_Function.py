

def get_angle(planet, t):
    ecc = float(planet[2]) # eccentricity
    p = float(planet[6]) # orbital time
    
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
    n = 200
    # generates coordinate arrays for eccentric orbits
    scale_factor = t/p
    subtract_amount = p * math.floor(scale_factor)
    scaled_t = t - subtract_amount
    N = (scaled_t/p)
    b = 2*math.pi*N
    result = ((integration(f, b, n)) * (p*((1-ecc**2))**(3/2 )*(1/(2*math.pi)) ))

    return result