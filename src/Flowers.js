import React, {Component} from 'react';
import Canvas from './Canvas';
import Particle from './physics/Particle';
import './Middle.css';

const WIDTH_PX = 300;
const HEIGHT_PX = 300;
const GROUND_I = 40;
const RESET_I = 150;

class Hills extends Component {
  agents = Array.from({length: 3}, () => {
    const agent = new Particle(WIDTH_PX / 2, HEIGHT_PX);
    agent.angle = (Math.random() * 0.2 + 0.4) * Math.PI;

    agent.color = `rgb(${0}, ${0}, 0)`;
    return agent;
  });

  setup() {
    const p = document.createElement('p');
    p.textContent = 'city plants';
    document.body.appendChild(p);
    window.setTimeout(() => window.location.reload(), 8000);
  }

  step = (ctx, t, i) => {
    if (i < GROUND_I) {
      ctx.beginPath();
      const a = WIDTH_PX / 2 + (i / GROUND_I - 0.5) * 120;
      const b = WIDTH_PX / 2 + ((i + 1) / GROUND_I - 0.5) * 120;
      ctx.moveTo(a, HEIGHT_PX);
      ctx.lineTo(b, HEIGHT_PX);
      ctx.stroke();
      return;
    }
    i -= GROUND_I;
    if (i > RESET_I) return;
    ctx.lineWidth = i - 90;

    this.agents.forEach(agent => {
      ctx.strokeStyle = agent.color;
      ctx.beginPath();
      ctx.moveTo(agent.x, agent.y);
      agent.angle = Math.max(0, Math.min(Math.PI, agent.angle + (Math.random() - 0.5) * 4 * Math.PI / 40));
      agent.x += 1 * Math.cos(agent.angle);
      agent.y -= 1 * Math.sin(agent.angle);
      ctx.lineTo(agent.x, agent.y);
      ctx.stroke();
    });
  }

  render() {
    return <Canvas
      height={HEIGHT_PX}
      setup={this.setup}
      step={this.step}
      width={WIDTH_PX}
    />
  }
}

export default Hills;
