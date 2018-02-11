import React, {Component} from 'react';
import Canvas from './Canvas';
import './Middle.css';

const {hypot, min, random, PI} = Math;

const MAX_DOTS_PER_LAYER = 10000;
const SIZE_PX = 2200;
const R_MAX_PX = 300;
const N_LAYERS = 2;
const MAX_RETRIES = 50;

export default class VecField extends Component {
  setup = ctx => {
    ctx.globalCompositeOperation = 'xor';

    for (let layer = 0; layer < N_LAYERS; ++layer) {
      const dots = [];

      for (let dot = 0; dot < MAX_DOTS_PER_LAYER; ++dot) {
        let x, y, r, retries = MAX_RETRIES;
        do {
          x = random() * SIZE_PX;
          y = random() * SIZE_PX;
          r = R_MAX_PX;

          // Naive.
          for (let neighborIdx = 0, _len = dots.length; neighborIdx < _len && r > 0; ++neighborIdx) {
            const neighbor = dots[neighborIdx];
            const dX = neighbor[0] - x;
            const dY = neighbor[1] - y;
            r = min(r, hypot(dX, dY) - neighbor[2]);
          }
        } while (r <= 0 && retries--)
        if (retries < 0) break;

        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2 * PI);
        ctx.fillStyle = `hsl(${Math.random() * 360}, 25%, 10%)`;
        ctx.fill();
        dots.push([x, y, r]);
      }
    }
  }

  render() {
    return <Canvas
      height={SIZE_PX}
      setup={this.setup}
      width={SIZE_PX}
    />
  }
}
