import React, {Component} from 'react';
import Canvas from './Canvas';
import './Middle.css';

const W = 60;
const H = 60;
const SIZE_PX = 30;
const MAX_LINE_LENGTH = 4;

// Computed.
const W_PX = W * SIZE_PX;
const H_PX = H * SIZE_PX;


export default class Billow extends Component {
  // Usage: grid[y][x].
  grid = Array.from({length: H}, () => Array.from({length: W}, () => false));

  // Safe array access.
  get = (arr, i) => arr && i >= 0 && i < arr.length && arr[i];

  setup = ctx => {
    const {get, grid} = this;

    for (let y = 0; y < H; ++y) {
      for (let x = 0; x < W; ++x) {
        const row = grid[y];
        const aboveRow = get(grid, y - 1);

        // `down` and `right` aren't initialized yet.
        const up   = get(aboveRow, x);
        const left = get(row, x - 1);

        const diagUpLeft  = get(aboveRow, x - 1);
        const diagUpRight = get(aboveRow, x + 1);

        // We usually skip rendering if an upper diagonal space is already filled.
        if (diagUpLeft || diagUpRight) {
          // Prevent separate structures from touching on the diagonal.
          if (!up) continue;

          // Prevent rendering blocks of 4 together.
          if (left && diagUpLeft) continue;
        }

        // Don't allow anything too long.
        let tooTall = true;
        let tooWide = true;
        for (let i = 1; i <= MAX_LINE_LENGTH; ++i) {
          if (tooTall && !get(get(grid, y - 1), x)) tooTall = false;
          if (tooWide && !get(row, x - i)) tooWide = false;
        }
        if (tooTall || tooWide) continue;

        // Sometimes, just don't render it anyway.
        if (Math.random() < 0.3) continue;

        grid[y][x] = true;
        ctx.fillRect(x * SIZE_PX, y * SIZE_PX, SIZE_PX, SIZE_PX);
      }
    }
  }

  render() {
    return <Canvas
      height={H_PX}
      setup={this.setup}
      width={W_PX}
    />
  }
}
