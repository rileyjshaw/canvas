import React, {Component} from 'react';
import Canvas from './Canvas';
import fastUniformNoise from 'fast-uniform-noise';  // BETTER! UNIFORM SCALING [0, 1].
import Node from './physics/Node';
import angles from 'angles';

const {abs, random, cos, sin, PI, sqrt} = Math;

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
    const noise = simplex.in2D(x / 600, y / 600);
    node.angle = PI * 2 * (noise - noiseMin) / noiseRange;
    return node;
  });

  step = (ctx, t) => {
    this.agents = this.agents.filter(({x: x1, y: y1}, i1, agents) => {
      if (!(x1 >= 0 && y1 >= 0 && x1 < SIZE_PX && y1 < SIZE_PX)) return false;

      return !agents.some(({x: x2, y: y2}, i2) => {
        return i1 < i2 && abs(x1 - x2) < 1 && abs(y1 - y2) < 1;
      });
    });

    let aaa = 0, bbb = 0;
    this.agents.forEach(agent => {
      const {x, y, angle} = agent;

      // Change the noise2D output range to [0, 360deg].
      const noise = simplex.in2D(x / sqrt(t / 100) / 10, y / sqrt(t / 100) / 10);

      const angle1 = aAvg(angle, PI * 2 * (noise - noiseMin) / noiseRange);
      const x1 = x + cos(angle1) * STEP_LENGTH_PX / sqrt(sqrt(t));
      const y1 = y - sin(angle1) * STEP_LENGTH_PX / sqrt(sqrt(t));

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 12;
      ctx.stroke();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.stroke();

      agent.x = x1;
      agent.y = y1;
      agent.angle = angle1;

      if (random() < 0.005) {
        const branch = new Node(x, y);
        branch.angle = angle1 + (random() - 0.5) * 2;
        this.agents.push(branch);
      }
    });
    console.log(aaa, bbb);
  }

  render() {
    return <Canvas
      height={SIZE_PX}
      step={this.step}
      width={SIZE_PX}
    />
  }
}
