import React, {Component} from 'react';
import Canvas from './Canvas';
import SimplexNoise from 'simplex-noise';
import Node from './physics/Node';

const {abs, random, cos, sin, PI} = Math;

const SPACING_PX = 4;
const STEP_LENGTH_PX = 2;
const N_AGENTS = 400;

// Computed.
const HALF_N_AGENTS = N_AGENTS / 2;
const SIZE_PX = HALF_N_AGENTS * SPACING_PX;
const noiseMax = 1; //  This implementation is [-1, 1], not sqrt(DIMENSIONALITY) / 2.
const noiseMin = -noiseMax;
const noiseRange = noiseMax - noiseMin;

const simplex = new SimplexNoise(random);

export default class GlassWindow extends Component {
  agents = Array.from({length: N_AGENTS}, (_, i) => {
    const a = abs(i - HALF_N_AGENTS) * SPACING_PX;
    const b = 0;
    const [x, y] = i < HALF_N_AGENTS ? [a, b] : [b, a];
    const noise = simplex.noise2D(x / 600, y / 600);
    const node = new Node(x, y);
    node.angle = PI / 2 * (3 + (noise - noiseMin) / noiseRange);
    return node;
  });

  step = (ctx) => {
    ctx.globalAlpha = 0.05;
    ctx.globalCompositeOperation = 'multiply';
    this.agents = this.agents.filter(({x: x1, y: y1}, i1, agents) => {
      if (!(x1 >= 0 && y1 >= 0 && x1 < SIZE_PX && y1 < SIZE_PX)) return false;

      return !agents.some(({x: x2, y: y2}, i2) => {
        return i1 !== i2 && abs(x1 - x2) < 1 && abs(y1 - y2) < 1;
      });
    });

    this.agents.forEach(agent => {
      const {x, y, angle} = agent;

      // Change the noise2D output range to [270deg, 0deg].
      const noise = simplex.noise2D(x / 600, y / 600);
      const dAngle = PI / 2 * (3 + (noise - noiseMin) / noiseRange);

      const angle1 = 0.9 * angle + 0.1 * PI / 2 * (3 + (noise - noiseMin) / noiseRange);
      const x1 = x + (1 + cos(angle1)) * STEP_LENGTH_PX;
      const y1 = y + (1 - sin(angle1)) * STEP_LENGTH_PX;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = '#a64';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.moveTo(SIZE_PX - x, y);
      ctx.lineTo(SIZE_PX - x1, y1);
      ctx.strokeStyle = '#a64';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.moveTo(x, SIZE_PX - y);
      ctx.lineTo(x1, SIZE_PX - y1);
      ctx.strokeStyle = '#a64';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.moveTo(SIZE_PX - x, SIZE_PX - y);
      ctx.lineTo(SIZE_PX - x1, SIZE_PX - y1);
      ctx.strokeStyle = '#a64';
      ctx.lineWidth = 2;
      ctx.stroke();

      agent.x = x1;
      agent.y = y1;
      agent.angle = angle1;

      if (random() < 0.05) {
        const branch = new Node(x, y);
        branch.angle = angle1 + (random() - 0.5) * 2;
        this.agents.push(branch);
      } else agent.angle = angle1;
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
