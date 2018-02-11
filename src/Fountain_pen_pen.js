import React, {Component} from 'react';
import Canvas from './Canvas';
import Particle from './physics/Particle';
import './Middle.css';

const WIDTH_PX = 1400;
const HEIGHT_PX = 3000;
const N_AGENTS = 3000;
const STEP_LENGTH = 6;

class Hills extends Component {
  agents = Array.from({length: N_AGENTS}, () => {
    const agent = new Particle(WIDTH_PX / 2, HEIGHT_PX);
    agent.angle = (Math.random() * 0.2 + 0.4) * Math.PI;

    agent.color = 'rgba(0, 0, 180, 0.1)';
    return agent;
  });

  step = (ctx, t, i) => {
    ctx.globalCompositeOperation = 'multiply';

    this.agents.forEach(agent => {
      ctx.strokeStyle = agent.color;
      ctx.lineWidth = Math.floor(agent.angle * 3) + 1;
      ctx.beginPath();
      agent.angle = Math.max(0, Math.min(Math.PI, agent.angle + (Math.random() - 0.5) * 4 * Math.PI / 200));
      const dX = Math.cos(agent.angle);
      const dY = Math.sin(agent.angle);
      ctx.moveTo(agent.x - STEP_LENGTH * dX, agent.y + STEP_LENGTH * dY);
      agent.x += STEP_LENGTH * dX;
      agent.y -= STEP_LENGTH * dY;
      ctx.lineTo(agent.x, agent.y);
      ctx.stroke();
    });
  }

  render() {
    return <Canvas
      height={HEIGHT_PX}
      step={this.step}
      width={WIDTH_PX}
    />
  }
}

export default Hills;
