import React, {Component} from 'react';
import Canvas from './Canvas';
import Particle from './physics/Particle';
import './Middle.css';

const {cos, max, min, PI, random, round, sin} = Math;

const W = 10;
const H = 10;
const SIZE_PX = 300;
const N_AGENTS = 100;
const MAX_AGENT_SIZE = 4;
const SPEED = 1;

// Computed.
const W_PX = W * SIZE_PX;
const H_PX = H * SIZE_PX;

let angle = 0;
const initAgent = () => {
  ++angle;
  const agent = new Particle(SIZE_PX * random(), SIZE_PX * random());
  agent.angle = random() * 2 * PI;

  agent.color = `hsl(${180 + (angle % 60)}, 100%, 80%)`;
  agent.size = random() * MAX_AGENT_SIZE;
  return agent;
};

export default class Tiletile extends Component {
  agents = Array.from({length: N_AGENTS}, initAgent);

  setup = (ctx) => ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';

  step = (ctx, t) => {
    ctx.fillRect(0, 0, W_PX, H_PX);

    this.agents.forEach((agent, i, agents) => {
      const {y: y0Even, x: x0Even} = agent;
      // agent.x += SPEED * sin(agent.angle);
      agent.y += SPEED * cos(agent.angle);
      agent.angle += (random() - 0.5) * 4 * PI / 10;
      agent.size = max(0, min(MAX_AGENT_SIZE, agent.size + (agent.angle - PI) / 10));

      if (agent.x < 0 || agent.x > SIZE_PX || agent.y < 0 || agent.y > SIZE_PX) {
        return agents[i] = initAgent();
      }
      const {y: y1Even, x: x1Even} = agent;
      const x0Odd = SIZE_PX - x0Even;
      const y0Odd = SIZE_PX - y0Even;
      const x1Odd = SIZE_PX - x1Even;
      const y1Odd = SIZE_PX - y1Even;

      ctx.strokeStyle = agent.color;
      ctx.lineWidth = agent.size;
      for (let gridY = 0; gridY < H; ++gridY) {
        const y0 = SIZE_PX * gridY + (gridY % 2 ? y0Odd : y0Even);
        const y1 = SIZE_PX * gridY + (gridY % 2 ? y1Odd : y1Even);
        for (let gridX = 0; gridX < W; ++gridX) {
          const x0 = SIZE_PX * gridX + (gridX % 2 ? x0Odd : x0Even);
          const x1 = SIZE_PX * gridX + (gridX % 2 ? x1Odd : x1Even);

          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.stroke();
        }
      }
    });
  }

  render() {
    return <Canvas
      height={H_PX}
      step={this.step}
      setup={this.setup}
      width={W_PX}
    />
  }
}
