// With branching
import React, {Component} from 'react';
import Canvas from './Canvas';
import Node from './physics/Node';
import './Middle.css';

const WIDTH_PX = 1500;
const HEIGHT_PX = 1500;
const RESET_I = 150;

class Hills extends Component {
  agents = Array.from({length: 7}, () => {
    const red = Math.round(Math.random() * 255);
    const agent = new Node(WIDTH_PX / 2, HEIGHT_PX / 2);
    agent.angle = Math.random() * 2 * Math.PI;
    agent.color = `rgb(${red}, ${red}, ${red - 40})`;
    return agent;
  });

  branches = []

  setup = ctx => ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';

  step = (ctx, t, i) => {
    i = i % RESET_I;
    if (!i) {
      ctx.fillRect(0, 0, WIDTH_PX, HEIGHT_PX);
      this.branches = [];
    }
    const lineWidth = ctx.lineWidth = 60 - i / 2;

    [...this.agents, ...this.branches].forEach(agent => {
      if (!i) {
        agent.x = WIDTH_PX / 2;
        agent.y = HEIGHT_PX / 2;
      }

      ctx.strokeStyle = agent.color;
      ctx.beginPath();
      ctx.moveTo(agent.x, agent.y);
      agent.angle += (Math.random() - 0.5) * 4 * Math.PI / 40;
      agent.x += 4 * Math.sin(agent.angle);
      agent.y += 4 * Math.cos(agent.angle);
      ctx.lineTo(agent.x, agent.y);
      ctx.stroke();

      if (Math.random() < 0.024) {
        const branch = new Node(agent.x, agent.y);
        branch.color = agent.color;
        branch.angle = agent.angle;
        this.branches.push(branch);
      }
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
