import React, {Component} from 'react';
import * as d3 from 'd3-path';


class Canvas extends Component {
  componentWillMount() {
    const {width, height, setup, step} = this.props;

    const path = d3.path();
    path.beginPath = () => {};  // No-op for SVG.
    path.clearRect = (x0, y0, x1, y1) => {
      if (x0 !== 0 || y0 !== 0 || x1 !== width || y1 !== height) {
        console.warn('You can only clear the whole path for SVG, dummy.');
      }


    };
    path.stroke = path.closePath;
    this._context = path;

    if (setup) {
      setup(this._context, 0);
    }

    if (step) {
      this._animationFrame = window.requestAnimationFrame(this.step);
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this._animationFrame);
  }

  step = (t) => {
    const {step} = this.props;
    step(this._context, t);
    this._animationFrame = window.requestAnimationFrame(this.step);
  }

  render() {
    const {width, height} = this.props;
    console.log(this._context);
    return <svg width={width} height={height}>
      <path stroke="black" strokeWidth="1" d={this._context.toString()} />
    </svg>
  }
}

export default Canvas;
