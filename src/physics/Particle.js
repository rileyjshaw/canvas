import Node from './Node';

const X = 0;
const Y = 1;

class Particle extends Node {
  constructor(x, y, velocity, bounce) {
    super(x, y);
    this.velocity = velocity || [0, 0];
    this.bounce = bounce;
  }

  update() {
    this.x = this.x + this.velocity[X];
    this.y = this.y + this.velocity[Y];
    if (this.bounce) {
      if (this.x < 0 || this.x > this.bounce[0]) {this.velocity[X] = -this.velocity[X]}
      if (this.y < 0 || this.y > this.bounce[1])  {this.velocity[Y] = -this.velocity[Y]}
    }
  }
}

export default Particle;
