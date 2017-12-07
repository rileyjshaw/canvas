// BAD! Since we're creating a grid top-to-bottom, left-to-right, this is
// always going to be biased towards one type of "staircases". I left an "OOPS"
// comment below to show where this happens.boolean
//
// Going to rename this to Gridbits_bad try again in Gridwormz by growing
// individual structures.

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


export default class Gridbitz extends Component {
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

        // Prevent distinct structures from touching on the diagonal.
        if ((diagUpLeft && !(up || left)) || (diagUpRight && !up)) continue;  // <-- OOPS!

        // Prevent rendering blocks of 4 together.
        if (up && left && diagUpLeft) continue;

        // Don't allow anything too long.
        let tooTall = true;
        let tooWide = true;
        for (let i = 1; i <= MAX_LINE_LENGTH; ++i) {
          if (i && tooTall && !get(get(grid, y - i), x)) tooTall = false;
          if (tooWide && !get(row, x - i)) tooWide = false;
        }
        if (tooTall || tooWide) continue;

        // Sometimes, just don't render it anyway.
        if (Math.random() < 0.3) continue;

        grid[y][x] = true;
      }
    }

    grid.forEach((row, Y) => row.forEach((square, X) => {
      if (square && (get(grid, Y - 1)[X] ||  // Up.
                     get(grid, Y + 1)[X] ||  // Down.
                     get(row, X - 1)     ||  // Left.
                     get(row, X + 1)         // Right.
      )) ctx.fillRect(X * SIZE_PX, Y * SIZE_PX, SIZE_PX, SIZE_PX);
    }));
  }

  render() {
    return <Canvas
      height={H_PX}
      setup={this.setup}
      width={W_PX}
    />
  }
}
