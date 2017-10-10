const X = 0;
const Y = 1;

class Node {
  constructor(x, y, velocity, bounce) {
    this.x = x;
    this.y  = y;
    this.velocity = velocity || [0, 0];
    this.bounce = bounce;
  }

  update() {
    this.x = this.x + this.velocity[X];
    this.y = this.y + this.velocity[Y];
    if (this.bounce) {
      if (this.x < 0 || this.x > 120) {this.velocity[X] = -this.velocity[X]}
      if (this.y < 0 || this.y > 70)  {this.velocity[Y] = -this.velocity[Y]}
    }
  }
}

export default Node;
