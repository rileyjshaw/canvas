// With eye
import React, {Component} from 'react';
import Canvas from './Canvas';
import Node from './physics/Node';

const WIDTH_PX = 1000;
const HEIGHT_PX = 1000;
const RESET_I = 100;

class Hills extends Component {
  agents = Array.from({length: 160}, () => {
    const red = Math.round(Math.random() * 255);
    const agent = new Node(WIDTH_PX / 2, HEIGHT_PX / 2);
    agent.angle = Math.random() * 2 * Math.PI;

    agent.color = `rgb(${355 - red}, ${255 - red}, 255)`;
    return agent;
  });

  setup = (ctx) => {ctx.fillRect(0, 0, WIDTH_PX, HEIGHT_PX);}

  step = (ctx, t, i) => {
    // i = i % RESET_I;
    const lineWidth = ctx.lineWidth = Math.max((40 - i / 2), 3);
    // ctx.fillRect(0, 0, WIDTH_PX, HEIGHT_PX);
    if (t > 2800) return;
    if (t > 2000 && !(i % RESET_I) && !this._bleh) {
      ctx.beginPath();
      ctx.arc(WIDTH_PX / 2, HEIGHT_PX / 2, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(WIDTH_PX / 2, HEIGHT_PX / 2, 100, 0, Math.PI * 2);
      const grd = ctx.createRadialGradient(WIDTH_PX / 2, HEIGHT_PX / 2, 20, WIDTH_PX / 2, HEIGHT_PX / 2, 100);
      grd.addColorStop(0, 'rgba(0, 0, 0, 1)');
      grd.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grd;
      for (let i = 0; i < 10; ++i) {
        ctx.fill();
      }
      this._bleh = true;
      return;
    }
    this.agents.forEach(agent => {
      if (!i) {
        agent.x = WIDTH_PX / 2;
        agent.y = HEIGHT_PX / 2;
      }

      ctx.strokeStyle = agent.color;
      ctx.beginPath();
      ctx.moveTo(agent.x, agent.y);
      agent.angle += (Math.random() - 0.5) * 4 * Math.PI / 16;
      agent.x += 4 * Math.sin(agent.angle);
      agent.y += 4 * Math.cos(agent.angle);
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
