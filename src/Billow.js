import React, {Component} from 'react';
import Canvas from './Canvas';
import SimplexNoise from 'simplex-noise';

const WIDTH = 120;
const HEIGHT = 80;
const SPACING_PX = 30;
const MIN_STRAND_ITERATIONS = 20;
const MAX_STRAND_ITERATIONS = 100;
const STEP_LENGTH_PX = 20;
const DIMENSIONALITY = 2;

// Computed.
const WIDTH_PX = WIDTH * SPACING_PX;
const HEIGHT_PX = HEIGHT * SPACING_PX;
const noiseMax = Math.sqrt(DIMENSIONALITY) / 2;
const noiseMin = -noiseMax;
const noiseRange = noiseMax - noiseMin;

const simplex = new SimplexNoise(Math.random);

export default class Billow extends Component {
  setup = (ctx) => {
    ctx.lineWidth = 1;
    ctx.fillRect(0, 0, WIDTH_PX, HEIGHT_PX);
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    for (let x = 0; x <= WIDTH; ++x) {
      for (let y = 0; y <= HEIGHT; ++y) {
        // Use the noise2D output to determine how long the strand at this
        // (x, y) should be.
        const noiseA = simplex.noise2D(x / 150, y / 150);
        const length = MIN_STRAND_ITERATIONS + (noiseA - noiseMin) / noiseRange * (MAX_STRAND_ITERATIONS - MIN_STRAND_ITERATIONS);
        let xPx = (x + 0.5 + (Math.random() - 0.5) * 3) * SPACING_PX;
        let yPx = (y + 0.5 + (Math.random() - 0.5) * 3) * SPACING_PX;

        for (let i = 0; i < length; ++i) {
          const noiseB = simplex.noise2D((4000 + xPx / SPACING_PX / 100), (4000 + yPx / SPACING_PX / 20));
          const angle = (noiseB - noiseMin) / noiseRange * Math.PI * 2;
          ctx.beginPath();
          ctx.strokeStyle = 'hsla(' + (length / MAX_STRAND_ITERATIONS) * 360 + ', 100%, 70%, ' + (i + 1) * 2 / length + ')';
          ctx.moveTo(xPx, yPx);
          xPx += Math.cos(angle) * STEP_LENGTH_PX;
          yPx += Math.sin(angle) * STEP_LENGTH_PX;
          ctx.lineTo(xPx, yPx);
          ctx.stroke();
        }
      }
    }
  }

  render() {
    return <Canvas
      height={HEIGHT_PX}
      setup={this.setup}
      width={WIDTH_PX}
    />
  }
}
