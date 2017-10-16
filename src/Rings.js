import React, {Component} from 'react';
import Canvas from './Canvas';
import './Middle.css';

const OUTER_R_PX = 200;
const MIN_BEAD_R_PX = 30;
const MAX_BEAD_R_PX = 60;

// Computed.
const PI2 = 2 * Math.PI;
let C_X_PX, C_Y_PX = C_X_PX = OUTER_R_PX + MAX_BEAD_R_PX + 10;
const SIDE_LENGTH_PX = 2 * C_X_PX;
const CIRCUMFERENCE_PX = PI2 * OUTER_R_PX;
const BEAD_THICKNESS_PX = 16;

class Hills extends Component {
  setup = (ctx) => {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.arc(C_X_PX, C_Y_PX, OUTER_R_PX, 0, PI2);
    ctx.stroke();
    ctx.lineWidth = BEAD_THICKNESS_PX;

    for (let i = 0, _len = 2 * (3 + Math.ceil(Math.random() * 3)); i < _len; ++i) {
      const r = MIN_BEAD_R_PX + Math.random() * (MAX_BEAD_R_PX - MIN_BEAD_R_PX);
      const wiggle = Math.random() * (1 / _len - (r + MAX_BEAD_R_PX + BEAD_THICKNESS_PX) / CIRCUMFERENCE_PX) * PI2;
      const angle = wiggle + PI2 * i / _len;
      const x = C_X_PX + OUTER_R_PX * Math.cos(angle);
      const y = C_Y_PX + OUTER_R_PX * Math.sin(angle);

      ctx.beginPath();
      ctx.fillStyle = '#fff';
      ctx.arc(x, y, r, angle - Math.PI * (i % 2), angle + Math.PI * ((i + 1) % 2));
      ctx.fill();

      ctx.beginPath();
      ctx.fillStyle = '#000';
      ctx.arc(x, y, 6, 0, PI2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, r, 0, PI2);
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(C_X_PX, C_Y_PX, 6, 0, PI2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(C_X_PX, C_Y_PX, MIN_BEAD_R_PX, 0, PI2);
    ctx.stroke();
  }

  render() {
    return <Canvas
      height={SIDE_LENGTH_PX}
      setup={this.setup}
      width={SIDE_LENGTH_PX}
    />
  }
}

export default Hills;
