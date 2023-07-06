function intFunction(x, eccen, period) {
  return (2 * Math.PI / period) * Math.pow(1 + eccen * Math.cos(x), -2);
}

function integration(upLimit, subIntervals, eccen, period) {
  const h = upLimit / subIntervals;
  var s = intFunction(upLimit, eccen, period);
  for (var i = 1; i < subIntervals; i += 2) {
    s += 4 * intFunction(i * h, eccen, period);
  }
  for (var i = 2; i < subIntervals - 1; i += 2) {
    s += 2 * intFunction(i * h, eccen, period);
  }
  return s * h / 3;
}

export function GetAngle(eccen, period, t) {
  const subIntervals = 200;
  const scaleFactor = t / period;
  const subtractAmount = period * Math.floor(scaleFactor);
  const scaledT = t - subtractAmount;
  const N = scaledT / period;
  const b = 2 * Math.PI * N;
  const result = integration(b, subIntervals, eccen, period) * (period * Math.pow((1 - eccen ** 2), 3 / 2) * (1 / (2 * Math.PI)));

  return result;
}