const X = 0;
const Y = 1;

class Node {
  constructor(x, y, velocity) {
    this.x = x;
    this.y  = y;
    this.velocity = velocity || [0, 0];
  }

  update() {
    this.x = this.x + this.velocity[X];
    this.y = this.y + this.velocity[Y];
  }
}

export default Node;
