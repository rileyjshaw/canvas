// Kampyle of Eudoxus from https://generateme.wordpress.com/2016/04/24/drawing-vector-field/

import React, {Component} from 'react';
import Canvas from './Canvas';
import fastUniformNoise from 'fast-uniform-noise';  // BETTER! UNIFORM SCALING [0, 1].
import Node from './physics/Node';
import angles from 'angles';

const {min, max, abs, random, cos, sin, tan, PI, sqrt} = Math;

const SPACING_PX = 80;
const STEP_LENGTH_PX = 10;
const N_AGENTS_PER_SIDE = 20;

// Computed.
const SIZE_PX = N_AGENTS_PER_SIDE * SPACING_PX;
const noiseMax = 1; // sqrt(2) / 2;
const noiseMin = 0;
const noiseRange = noiseMax - noiseMin;

const simplex = new fastUniformNoise({random});

// angle average.
const aAvg = (a, b, pct = 0.5) => angles.lerp(a, b, pct, angles.shortestDirection(a, b));

export default class VecField extends Component {
  agents = Array.from({length: N_AGENTS_PER_SIDE * N_AGENTS_PER_SIDE}, (_, i) => {
    const x = (i % N_AGENTS_PER_SIDE) * SPACING_PX;
    const y = Math.floor(i / N_AGENTS_PER_SIDE) * SPACING_PX;
    const node = new Node(x, y);
    return node;
  });

  step = (ctx, t) => {
    ctx.globalCompositeOperation = 'multiply';

    this.agents = this.agents.filter(({x: x1, y: y1}, i1, agents) => {
      if (!(x1 >= 0 && y1 >= 0 && x1 < SIZE_PX && y1 < SIZE_PX)) return false;

      return !agents.some(({x: x2, y: y2}, i2) => {
        return i1 < i2 && abs(x1 - x2) < 1 && abs(y1 - y2) < 1;
      });
    });

    this.agents.forEach(agent => {
      const {x, y} = agent;

      // Change the noise2D output range to [0, 360deg].
      const noise = simplex.in2D(x / 300, y / 300);
      const ssss = sin(noise * 2 * PI);
      const sss = (ssss * 3 + ssss / abs(ssss) * 2) / 5;  // Avoids the [-0.4, 0.4] range.
      const sec = 1 / sss;
      const xt = sec;
      const yt = tan(noise) * sec;

      const x1 = x + xt * STEP_LENGTH_PX;
      const y1 = y - yt * STEP_LENGTH_PX;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = '#fff';
      // ctx.lineWidth = 12;
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0, 0, 180, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      agent.x = x1;
      agent.y = y1;
    });
  }

  render() {
    return <Canvas
      height={SIZE_PX}
      step={this.step}
      width={SIZE_PX}
    />
  }
}
