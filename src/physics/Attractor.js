import Node from './Node';

const X = 0;
const Y = 1;
const R = 200;

class Attractor extends Node {
  constructor(x, y, strength) {
    super(x, y);
    this.strength = strength;
  }

  mag = (x, y) => {
    const dX = this.x - x;
    const dY = this.y - y;
    const d = Math.hypot(dX, dY);

    if (d > 0 && d < R) {
      const f = (1 / Math.sqrt(d / R) - 1) / R * this.strength;
      return [f * dX, f * dY];
    } else return [0, 0];
  }
}

export default Attractor;
