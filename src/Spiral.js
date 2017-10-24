import React, {Component} from 'react';
import Canvas from './Svg';

const L = 1000;
const X_0 = L / 2;
const Y_0 = L / 2;
const DENSITY = 1;
const DETAIL = 50;

// Derived.
const c = L / 2;
const max = c * DENSITY * 0.716;
const dθ = 1 / DETAIL;
const size = c / 20;

const {cos, sin} = Math;

class Spiral extends Component {
  setup = (ctx) => {
    ctx.beginPath();
    for (let i = 0, θ = 0, x, y; θ < max; ++i, θ += dθ) {
      const xSpiral = cos(θ) * θ / DENSITY + θ;
      const ySpiral = sin(θ) * θ / DENSITY + θ;
      i && ctx.moveTo(x, y);
      x = X_0 + ((xSpiral - θ) * 2.4 + sin(xSpiral / size) * cos(ySpiral / size) * size * 1.6) / 2;
      y = Y_0 + ((ySpiral - θ) * 2.4 + cos(xSpiral / size) * cos(ySpiral / size) * size * 1.6) / 2;
      i && ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  render() {
    return <Canvas height={L} setup={this.setup} width={L} />
  }
}

export default Spiral;
