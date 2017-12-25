import React, {Component} from 'react';
import Canvas from './Canvas';
import './Middle.css';

const {atan2, cos, sin, floor, random} = Math;

const N = 20;
const DETAIL = 10;
const SPREAD_PX = 60;
const OPACITY = 0.1;
const SPEED = 8;
const H = 2560;
const W = 3840;

// Random int [0, max].
function ri(max) {
  return floor(random() * (max + 1));
}

// Returns 6 points a fixed distance out from p1 towards p2.
function pointsFrom(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const angle = atan2(dy, dx);

  return Array.from({length: DETAIL}, (_, i) => {
    const mag = (i + 1) * SPREAD_PX / DETAIL;
    return [p1[0] + mag * cos(angle), p1[1] + mag * sin(angle)];
  });
}

export default class Bend extends Component {
  // [x, y, color].
  points = Array.from({length: N}, (_, i) => {
    return [ri(W), ri(H), `hsla(${ri(360)}, 95%, 70%, ${OPACITY})`];
  })

  setup = ctx => {
    ctx.lineWidth = 1;
    document.body.style.background = 'black';
  }

  step = ctx => {
    const {points} = this;

    points.forEach(p => {
      p[0] += SPEED * (random() * 2 - 1);
      p[1] += SPEED * (random() * 2 - 1);
      if (p[0] < -SPREAD_PX || p[0] > W + SPREAD_PX || p[1] < -SPREAD_PX || p[1] > H + SPREAD_PX) {
        p[0] = ri(W); p[1] = ri(H);
      }
    });

    points.forEach((p0, i) => {
      points.slice(i + 1).forEach((p1, j) => {
        if (random() < 0.5) return;
        ctx.beginPath();
        ctx.fillStyle = ctx.strokeStyle = p0[2];
        // Draw curves.
        points.slice(i + j + 2).forEach((p2, k) => {
          if (random() < 0.4) return;
          const triad = [p0, p1, p2];
          triad.forEach((pa, x) => {
            const pb = triad[(x + 1) % 3];
            const pc = triad[(x + 2) % 3];
            const l1 = pointsFrom(pa, pb);
            const l2 = pointsFrom(pa, pc).reverse();
            l1.forEach((p, y) => {
              ctx.moveTo(...p);
              ctx.lineTo(...l2[y]);
              ctx.lineTo(...pa);
              ctx.lineTo(...p);
            });
          });
        });
        ctx.fill();
      });
    });
  }

  render() {
    return <Canvas
      height={H}
      setup={this.setup}
      step={this.step}
      width={W}
    />
  }
}
