// From https://ravenkwok.tumblr.com/post/166471127400/inspired-by-johan-rijpma
import React, {Component} from 'react';
import Canvas from './Canvas';
import SimplexNoise from 'simplex-noise';
import './Middle.css';

const {random, PI} = Math;

const AMPLITUDE = 6;
const CANVAS_SCALE = 100;
const SPREAD = 40;
const SIMILARITY = 100;
const CHAOS = 300;
const LINE_WIDTH = 8;
const JAGGEDNESS = 100;
const H = 16 * CANVAS_SCALE;
const W = 16 * CANVAS_SCALE;
const simplex = new SimplexNoise(random);

const canvas1 = document.createElement('canvas');
const canvas2 = document.createElement('canvas');
const ctx1 = canvas1.getContext('2d');
const ctx2 = canvas2.getContext('2d');
canvas1.width = canvas2.width = W;
canvas1.height = canvas2.height = H;

export default class GlassWindow extends Component {
  state = {image: null}

  fillCtx(ctx) {
    // ctx.fillStyle = '#000';
    // ctx.fillRect(0, 0, W, H);
    ctx.drawImage(this.state.image, 0, 0, W, H);
  }

  setup = ctx => {
    this.fillCtx(ctx);

    ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
    ctx.fillRect(0, 0, W, H);
    ctx1.strokeStyle = ctx2.strokeStyle = '#fff';
    ctx1.lineWidth = ctx2.lineWidth = LINE_WIDTH;
    ctx1.canvas.className = 'ctx1';
    ctx2.canvas.className = 'ctx2';
    ctx.canvas.style.borderRadius = '50%';

    let _i = 0;
    setInterval(() => this.step(ctx, null, _i++), 100);
  }

  step = (ctx, t, i) => {
    ctx1.clearRect(0, 0, W, H);
    ctx2.clearRect(0, 0, W, H);
    ctx1.drawImage(ctx.canvas, 0, 0);
    ctx2.drawImage(ctx.canvas, 0, 0);
    this.fillCtx(ctx);

    ctx1.beginPath();
    ctx2.beginPath();

    const isOdd = i % 2;

    ctx1.moveTo(-2, -2);
    if (isOdd) {
      ctx2.moveTo(W, -2);
      const x0 = W / 2 + (random() * 2 - 1) * CHAOS;
      for (let y = 0; y < H; ++y) {
        const x = x0 + simplex.noise2D(i / SIMILARITY, y / 1000 * JAGGEDNESS) * AMPLITUDE;
        if (!y) {
          ctx1.lineTo(x, -2);
          ctx2.lineTo(x, -2);
        }
        ctx1.lineTo(x, y);
        ctx2.lineTo(x, y);
        if (y === H - 1) {
          ctx1.lineTo(x, H + 2);
          ctx2.lineTo(x, H + 2);
        }
      }

      ctx1.lineTo(-2, H + 2);
      ctx2.lineTo(W, H);
    } else {
      ctx2.moveTo(-2, H);
      const y0 = H / 2 + (random() * 2 - 1) * CHAOS;

      for (let x = 0; x < W; ++x) {
        const y = y0 + simplex.noise2D(10000 + i / SIMILARITY, x / 1000 * JAGGEDNESS) * AMPLITUDE;
        if (!x) {
          ctx1.lineTo(-2, y);
          ctx2.lineTo(-2, y);
        }
        ctx1.lineTo(x, y);
        ctx2.lineTo(x, y);
        if (x === W - 1) {
          ctx1.lineTo(W + 2, y);
          ctx2.lineTo(W + 2, y);
        }
      }

      ctx1.lineTo(W + 2, -2);
      ctx2.lineTo(W + 2, H + 2);
    }

    ctx1.closePath();
    LINE_WIDTH && ctx1.stroke();
    ctx1.save();
    ctx1.clip();
    ctx1.clearRect(0, 0, W, H);
    ctx1.restore();

    // Confusing - clears the right side, so it's on the left side.
    ctx2.closePath();
    LINE_WIDTH && ctx2.stroke();
    ctx2.save();
    ctx2.clip();
    ctx2.clearRect(0, 0, W, H);
    ctx2.restore();

    const mainRotation = PI * (random() * 2 - 1) / 30;
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(mainRotation);
    ctx.translate(-W / 2, -H / 2);
    isOdd ? ctx.translate(SPREAD, 0) : ctx.translate(0, SPREAD);
    ctx.drawImage(ctx1.canvas, 0, 0);
    ctx.restore();

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(mainRotation + PI * (random() * 2 - 1) / 50);
    ctx.translate(-W / 2, -H / 2);

    isOdd ? ctx.translate(-SPREAD * 2, 0) : ctx.translate(0, -SPREAD * 2);
    ctx.drawImage(ctx2.canvas, 0, 0);
    ctx.restore();
  }

  handleImageLoaded = ({target}) => {
    this.setState({image: target});
  }

  render() {
    return <div>
      <img
        alt=''
        height={H}
        onLoad={this.handleImageLoaded}
        src='https://fabriccreative.com/wp-content/uploads/2014/05/grace-face-1.jpg'
        style={{display: 'none'}}
        width={W}
      />
      {this.state.image && <Canvas
        height={H}
        setup={this.setup}
        // step={this.step}
        width={W}
      />}
    </div>;
  }
}
