import React, {Component} from 'react';
import Canvas from './Canvas';
import SimplexNoise from 'simplex-noise';

const WIDTH = 1000;
const HEIGHT = 1000;
const SPACING_PX = 5;
const HAIR_LENGTH_PX = 20;
const DIMENSIONALITY = 2;

// Computed.
const WIDTH_PX = WIDTH * SPACING_PX;
const HEIGHT_PX = HEIGHT * SPACING_PX;
const noiseMax = Math.sqrt(DIMENSIONALITY) / 2;
const noiseMin = -noiseMax;
const noiseRange = noiseMax - noiseMin;

const simplex = new SimplexNoise(Math.random);

class Hair extends Component {
  setup = (ctx) => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
    for (let x = 0; x <= WIDTH; ++x) {
      for (let y = 0; y <= HEIGHT; ++y) {
        // Change the noise2D output range to [0, 360deg].
        const noise = simplex.noise2D(x / 144, y / 144);
        const angle = (noise - noiseMin) / noiseRange * Math.PI * 2;

        // Using the same gridOffset value for both x and y components shifts
        // the origin diagonally, which creates cool patchy bits full of
        // parallel lines.
        const gridOffset = (Math.random() - 0.5) * 5;

        const xPx = (x + 0.5 + gridOffset) * SPACING_PX;
        const yPx = (y + 0.5 + gridOffset) * SPACING_PX;
        const xOffset = Math.cos(angle) * HAIR_LENGTH_PX;
        const yOffset = Math.sin(angle) * HAIR_LENGTH_PX;

        ctx.beginPath();
        ctx.moveTo(xPx, yPx);
        // ctx.moveTo(xPx - xOffset, yPx - yOffset);
        ctx.lineTo(xPx + xOffset, yPx + yOffset);
        ctx.stroke();
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

export default Hair;
