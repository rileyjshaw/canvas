import React, {Component} from 'react';
import Canvas from './Canvas';
import Attractor from './physics/Attractor';
import Node from './physics/Node';
import './App.css';

const WIDTH = 10;
const HEIGHT = 5;
const SPACING_PX = 60;

// Computed.
const N = WIDTH * HEIGHT;
const WIDTH_PX = WIDTH * SPACING_PX;
const HEIGHT_PX = HEIGHT * SPACING_PX;

class App extends Component {
  attractors = Array.from({length: 10}, (_, i) => {
    i = Math.floor(WIDTH * HEIGHT * Math.random());
    return new Attractor(i % WIDTH * SPACING_PX, Math.floor(i / WIDTH) * SPACING_PX, Math.random() / 8);
  });

  balls = Array.from({length: WIDTH * HEIGHT}, () => {
    const x = Math.random() * WIDTH_PX;
    const y = Math.random() * HEIGHT_PX;
    return new Node(x, y);
  });

  setup(ctx) {
    ctx.lineWidth = 1;
  }

  step = (ctx, t) => {
    ctx.clearRect(0, 0, WIDTH_PX, HEIGHT_PX);

    this.balls.forEach(ball => {
      this.attractors.forEach(attractor => {
        const velocity = attractor.mag(ball.x, ball.y);
        ball.velocity[0] += velocity[0];
        ball.velocity[1] += velocity[1];
      });
      ctx.beginPath();
      ctx.moveTo(ball.x, ball.y);
      ball.update();
      ctx.lineTo(ball.x, ball.y);
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

export default App;
