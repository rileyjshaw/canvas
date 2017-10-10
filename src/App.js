import React, {Component} from 'react';
import Canvas from './Canvas';
import Attractor from './physics/Attractor';
import Node from './physics/Node';
import './App.css';
import {hsluvToHex} from 'hsluv';

const WIDTH = 900;
const HEIGHT = 600;
const SPACING_PX = 12;

// Computed.
const WIDTH_PX = WIDTH * SPACING_PX;
const HEIGHT_PX = HEIGHT * SPACING_PX;


function smoothCurveBetween(ctx, ball, prevBall) {
  let x0, y0;
  if (prevBall) {
    x0 = prevBall.x * SPACING_PX ;
    y0 = prevBall.y * SPACING_PX ;
  } else {
    x0 = 0;
    y0 = ball.y;
  }
  const x1 = (x0 + ball.x * SPACING_PX) / 2;
  const y1 = (y0 + ball.y * SPACING_PX) / 2;

  ctx.quadraticCurveTo(x0, y0, x1, y1);
}


class App extends Component {
  attractors = Array.from({length: 900}, (_, i) => {
    const x = Math.random() * WIDTH;
    const y = Math.random() * HEIGHT;
    return new Attractor(x, y, 3 * (Math.random() / 0.9 - 1), 80);
  });

  balls = Array.from({length: WIDTH * HEIGHT}, (_, i) => {
    const x = i % WIDTH;
    const y = Math.floor(i / WIDTH);
    return new Node(x, y);
  });

  setup = (ctx) => {
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 4; ++i) {
      window.requestAnimationFrame(() => {
        console.log(i, new Date());
        this.step(ctx, 0);
      });
    }
    window.requestAnimationFrame(() => {
      this.step(ctx, 0, true);
    });
  }

  step = (ctx, t, draw) => {
    ctx.clearRect(0, 0, WIDTH_PX, HEIGHT_PX);

    this.balls.forEach((ball, i) => {
      this.attractors.forEach(attractor => {
        if (!i) attractor.update();
        const velocity = attractor.mag(ball.x, ball.y);
        if (velocity) {
          ball.velocity[0] += velocity[0];
          ball.velocity[1] += velocity[1];
        }
      });
      ball.update();
    });

    if (draw) {
    console.log('drawing!');
    this.balls.forEach((ball, i) => {
      const prevBall = this.balls[i - 1];

      if (!((i) % WIDTH)) {
        if (i) {
          // ctx.fillStyle = hsluvToHex([Math.floor(i / 10) % 360, 100, 60]);

          smoothCurveBetween(ctx, {x: WIDTH, y: prevBall.y}, prevBall);
          ctx.lineTo(WIDTH_PX, HEIGHT_PX);
          ctx.lineTo(0, HEIGHT_PX);
          ctx.fillStyle = (Math.floor(i / WIDTH) % 2) ? '#fff' : '#000';
          ctx.fill();
          ctx.stroke();
          console.log(prevBall.y);
        }
        ctx.beginPath();
        ctx.moveTo(0, ball.y * SPACING_PX);
        return;
      }

      smoothCurveBetween(ctx, ball, prevBall);
    });
    }
  }

  render() {
    return <Canvas
      height={HEIGHT_PX}
      setup={this.setup}
      // step={this.step}
      width={WIDTH_PX}
    />
  }
}

export default App;
