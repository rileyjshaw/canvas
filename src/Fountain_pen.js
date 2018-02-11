import React, {Component} from 'react';
import Canvas from './Canvas';
import Particle from './physics/Particle';
import './Middle.css';

const WIDTH_PX = 1400;
const HEIGHT_PX = 1400;
const N_AGENTS = 2;
const STEP_LENGTH = 6;

class Hills extends Component {
  agents = Array.from({length: N_AGENTS}, () => {
    const agent = new Particle(WIDTH_PX / 2, HEIGHT_PX);
    agent.angle = (Math.random() * 0.4 + 0.3) * Math.PI;

    agent.color = '#333';
    return agent;
  });

  step = (ctx, t, i) => {
    this.agents.forEach(agent => {
      ctx.strokeStyle = agent.color;
      ctx.lineWidth = Math.floor(agent.angle * 50) + 1;
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
