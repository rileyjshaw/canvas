import React, {Component} from 'react';
import TextCanvas from 'text-canvas';
import Canvas from './Canvas';
import './Middle.css';

const {atan2, cos, sin, floor, random} = Math;

const N = 20;
const DETAIL = 10;
const SPREAD_PX = 40;
const OPACITY = 0.1;
const SPEED = 6;

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
  componentDidMount() {
    const textCanvas = (new TextCanvas('dors\nbien!', {
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: 260,
      textAlign: 'center',
    })).render();
    const H = this.H = textCanvas.height;
    const W = this.W = textCanvas.width;
    this.textData = textCanvas.getContext('2d').getImageData(0, 0, W, H).data;

    // [x, y, color].
    this.points = Array.from({length: N}, (_, i) => {
      return [ri(W), ri(H), `hsla(${ri(80) - 20}, 50%, 60%, ${OPACITY})`];
    });

    this.forceUpdate();  // Hehe.
  }


  setup = ctx => {
    ctx.lineWidth = 1;
    document.body.style.background = 'black';
  }

  step = ctx => {
    const {H, W, points, textData} = this;

    points.forEach(p => {
      let x = Math.round(p[0] + SPEED * (random() * 2 - 1));
      let y = Math.round(p[1] + SPEED * (random() * 2 - 1));
      while (!textData[(x + y * W) * 4 + 3]) {
        x = ri(W);
        y = ri(H);
      }
      p[0] = x;
      p[1] = y;
    });

    points.forEach((p0, i) => {
      points.slice(i + 1).forEach((p1, j) => {
        if (Math.random() < 0.5) return;
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
    const {setup, step, H, W} = this;

    return H ? <Canvas
      height={H}
      setup={setup}
      step={step}
      width={W}
    /> : null;
  }
}
