import React, {Component} from 'react';
import Canvas from './Canvas';
import './Middle.css';

const {atan2, cos, sin, floor, random, PI} = Math;
const PI2 = PI * 2;

const R = 400;
const N = 170;
const DETAIL = 10;
const SPREAD_PX = 600;
const OPACITY = 0.1;
const MAX_SPEED = PI2 / 1000;

// Computed.
const SIZE = R * 2.2;
const C = SIZE / 2;

// Cartesian coordinate around the circle from an angle.
const cart = a => [C + R * cos(a), C + R * sin(a)];

// Returns 6 points a fixed distance out from p1 towards p2.
function pointsFrom(p1, p2) {
  debugger;
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const angle = atan2(dy, dx);

  return Array.from({length: DETAIL}, (_, i) => {
    const mag = (i + 1) * SPREAD_PX / DETAIL;
    return [p1[0] + mag * cos(angle), p1[1] + mag * sin(angle)];
  });
}

export default class Bend extends Component {
  // [angle, radial velocity]. Placed around the outer circle.
  points = Array.from({length: N}, () =>
    [random() * PI2, (random() - 0.5) * 2 * MAX_SPEED])

  setup = ctx => {
    ctx.lineWidth = 1;
    // document.body.style.background = 'black';
  }

  step = ctx => {
    const {points} = this;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.fillStyle = ctx.strokeStyle = 'rgb(20, 8, 0)';

    // // Draw circle.
    // ctx.beginPath();
    // ctx.arc(C, C, R, 0, PI2);
    // ctx.stroke();

    points.forEach(p => p[0] = (p[0] + p[1]) % PI2);

    points
      .sort((a, b) => a[0] - b[0])
      .forEach(([a0], i, sorted) => {
        // Draw line to center.
        // ctx.beginPath();
        // ctx.moveTo(C, C);
        // ctx.lineTo(...cart(a0));
        // ctx.stroke();

        // Next point in the order.
        const a1 = sorted[(i + 1) % points.length][0];

        // Draw curve between the two lines.
        ctx.beginPath();
        const center = [C, C];
        const l0 = pointsFrom(center, cart(a0));
        const l1 = pointsFrom(center, cart(a1)).reverse();
        l0.forEach((p, j) => {
          ctx.moveTo(...p);
          ctx.lineTo(...l1[j]);
          ctx.lineTo(...center);
          ctx.lineTo(...p);
        });
        ctx.fill();
      });
  }

  render() {
    return <Canvas
      height={SIZE}
      setup={this.setup}
      step={this.step}
      width={SIZE}
    />
  }
}
