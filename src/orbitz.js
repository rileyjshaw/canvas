import React, {Component} from 'react';
import Canvas from './Canvas';
import Particle from './physics/Particle';
import './Middle.css';
import './Orbitz.css';

const {min, max, cos, sin, sqrt, PI} = Math;

const N_AGENTS = 60;
const SIZE_PX = 2000;
const PATH_R_PX = 600;
const INITIAL_R_PX = 400;
const PERIOD_MS = 30000;
const GRAVITY = 120;
const MAX_V = 20;

// Computed.
const CENTER_PX = SIZE_PX / 2;

export default class VecField extends Component {
  agents = Array.from({length: N_AGENTS}, (_, i) => {
    const angle = PI * 2 * i / N_AGENTS;
    const x = CENTER_PX + PATH_R_PX + cos(angle) * INITIAL_R_PX;
    const y = CENTER_PX + sin(angle) * INITIAL_R_PX;
    const particle = new Particle(x, y, null, [SIZE_PX, SIZE_PX]);
    return particle;
  });

  step = (ctx, t, step) => {
    if (step > 2200) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
    ctx.fillRect(0, 0, SIZE_PX, SIZE_PX);

    ctx.globalCompositeOperation = 'multiply';

    const lightness = min(255, step);
    const fadeShift = min(255, max(0, step - 1200));

    const targetX = CENTER_PX + PATH_R_PX * cos(t / PERIOD_MS * 2 * PI);
    const targetY = CENTER_PX + PATH_R_PX * sin(t / PERIOD_MS * 2 * PI);
    const shearingY = sin(t / PERIOD_MS * 100) * 0; //20;

    // // Debug.
    // ctx.beginPath();
    // ctx.arc(targetX, targetY, 40, 0, 2 * PI);
    // ctx.fill();

    this.agents.forEach(agent => {
      const {x, y, velocity} = agent;

      ctx.beginPath();
      ctx.moveTo(x, y + shearingY);

      // TODO(riley): Efficiency? Correctness? What's that?
      const dX = targetX - x;
      const dY = targetY - y;
      const d = sqrt(dX * dX + dY * dY);
      velocity[0] = min(MAX_V, max(-MAX_V, velocity[0] + GRAVITY / d / d * dX));
      velocity[1] = min(MAX_V, max(-MAX_V, velocity[1] + GRAVITY / d / d * dY));

      agent.update();

      ctx.lineTo(agent.x, agent.y + shearingY);
      // ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      // ctx.lineWidth = 4;
      // ctx.stroke();
      ctx.strokeStyle = `rgba(${lightness - fadeShift}, ${lightness - fadeShift}, ${lightness - fadeShift}, 0.2)`;
      ctx.lineWidth = 2;
      ctx.stroke();
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
