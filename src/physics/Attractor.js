import Node from './Node';

class Attractor extends Node {
  constructor(x, y, strength, radius, velocity, bounce) {
    super(x, y, velocity, bounce);
    this.strength = strength;
    this.radius = radius || 3;
  }

  mag = (x, y) => {
    const dX = this.x - x;
    const dY = (this.y - y) * 3 / 2;
    const d = Math.hypot(dX, dY);
    const r = this.radius;

    if (d < r) {
      const sign = this.strength < 0 ? -1 : 1;
      if (d === 0) return [sign * dX, sign * dY];

      const ramp = 1.8;
      const s = Math.pow(d / r, 1 / ramp)
      const f = s * 9 * (1 / (s + 1) + ((s - 3) / 4)) * this.strength / d;
      return [f * dX, f * dY];
    }
  }
}

export default Attractor;
