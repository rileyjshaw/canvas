import React, {Component} from 'react';
import Canvas from './Canvas';
import Node from './physics/Node';

const WIDTH_PX = 1000;
const HEIGHT_PX = 1000;
const RESET_I = 150;

class Hills extends Component {
  agents = Array.from({length: 160}, () => {
    const red = Math.round(Math.random() * 255);
    const agent = new Node(WIDTH_PX / 2, HEIGHT_PX / 2);
    agent.angle = Math.random() * 2 * Math.PI;

    agent.color = `rgb(${355 - red}, ${255 - red}, 255)`;
    return agent;
  });

  step = (ctx, t, i) => {
    i = i % RESET_I;
    const lineWidth = ctx.lineWidth = 60 - i / 2;

    this.agents.forEach(agent => {
      if (!i) {
        agent.x = WIDTH_PX / 2;
        agent.y = HEIGHT_PX / 2;
      }

      ctx.strokeStyle = agent.color;
      ctx.beginPath();
      ctx.moveTo(agent.x, agent.y);
      agent.angle += (Math.random() - 0.5) * 4 * Math.PI / 10;
      agent.x += 4 * Math.sin(agent.angle);
      agent.y += 4 * Math.cos(agent.angle);
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
