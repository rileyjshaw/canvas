import React, {Component} from 'react';
import Canvas from './Canvas';
import Node from './physics/Node';
import './Middle.css';

const FG1 = [220, 221, 210];
const FG2 = [176, 237, 242];
const BG = [11, 13, 12];

const W = 200;
const H = 200;
const SIZE_PX = 4;
const MAX_AGE = 100;
const MIN_DIST = 1;  // Between worms.
const MIN_INITIAL_DIST = 4;  // Between worms.
const MAX_WORM_LENGTH = 200;

// Computed.
const W_PX = W * SIZE_PX;
const H_PX = H * SIZE_PX;

const directions = [[1, 0], [0, -1], [-1, 0], [0, 1]];

export default class Gridwormz extends Component {
  // Silly terminology: each "worm" is an array of "bit"s.
  worms = []

  newWormPlz(x, y, day, direction, options) {
    const bit = this.makeABitYayy(x, y, day + MAX_AGE, {newWorm: true, ...options});
    if (!bit) return;

    const worm = {bits: [bit], direction, isBlue: Math.random() < 0.5};
    this.worms.push(worm);
    return worm;
  }

  addARandomWormLol(day) {
    const x = Math.floor(Math.random() * W);
    const y = Math.floor(Math.random() * H);
    return this.newWormPlz(x, y, day, directions[
      Math.floor(Math.random() * directions.length)]);
  }

  setup(ctx) {
    document.body.style.backgroundColor = `rgb(${BG})`;
    ctx.canvas.style.transform = `perspective(${W_PX}px) rotateX(55deg) rotateZ(45deg) translateZ(100px)`;
  }

  makeABitYayy(x, y, expiry, {wormRef, newWorm}) {
    const minDist = newWorm ? MIN_INITIAL_DIST : MIN_DIST;

    // Worms are scared of each-other. If we try to create a new bit too close
    // to another worm, we return `undefined`.
    const tooClose = this.worms.some((worm, i) => {
      const {bits, direction} = worm;

      // A worm can create bits in front of itself, so we ignore that case.
      if (worm === wormRef) {
        return bits.some(bit => {
          const isMostRecentBit = bit.x === x - direction[0] &&
                                  bit.y === y - direction[1];
          if (isMostRecentBit) return false;

          const a = Math.abs(x - bit.x);
          const b = Math.abs(y - bit.y);

          return (a + b <= MIN_DIST);
        });
      }

      // These law abiding worms should be within the canvas bounds.
      if (x < 0 || x > W || y < 0 || y > H) return true;

      // Go through each bit of the other worms and make sure we're far away.
      return worm.bits.some(bit =>
        Math.abs(x - bit.x) <= minDist && Math.abs(y - bit.y) <= minDist);
    });

    if (tooClose) return;

    // We're in the clear, create a new bit!
    const bit = new Node(x, y);
    bit.expiry = expiry;
    return bit;
  }

  step = (ctx, _, day) => {
    const {worms} = this;
    window.ctx = ctx;
    ctx.clearRect(0, 0, W_PX, H_PX);

    worms.forEach((worm, i) => {
      if (worm.length > MAX_WORM_LENGTH) return;

      const rand = Math.random();
      // A new direction that we might use to turn or branch the worm.
      const newDirection = worm.direction.map(d =>
        (Math.random() < 0.5 ? 1 : -1) * (1 - Math.abs(d)));

      // The worm turns!
      if (rand < 0.01) worm.direction = newDirection;

      const {bits, direction} = worm;
      const oldBit = bits[bits.length - 1];
      if (oldBit.dead) return;
      const newBit = this.makeABitYayy(
        oldBit.x + direction[0],
        oldBit.y + direction[1],
        day + MAX_AGE * Math.random(),
        {wormRef: worm});
      if (newBit) {
        if (rand > 0.44 && rand < 0.5) {
          newBit.dead = true;
        }

        worm.bits.push(newBit);
      }
    });

    this.addARandomWormLol(day);
    this.pruneWorms(day);
    this.drawWorms(ctx);
  }

  pruneWorms(day) {
    this.worms = this.worms
      .map(worm => ({
        ...worm,
        bits: worm.bits.filter(bit => bit.expiry > day),
      }))
      .filter(({bits}) => bits.length > 0);
  }

  drawWorms(ctx) {
    // Draw each of the bits.
    this.worms.forEach(({bits, isBlue}, i) => {
      bits.forEach(bit => {
        ctx.fillStyle = isBlue ? `rgb(${FG2})` : `rgb(${FG1})`;
        ctx.fillRect(bit.x * SIZE_PX, bit.y * SIZE_PX, SIZE_PX, SIZE_PX);
      });
    });
  }

  render() {
    return <Canvas
      height={H_PX}
      setup={this.setup}
      step={this.step}
      width={W_PX}
    />
  }
}
