import React, {Component} from 'react';

class Canvas extends Component {
  componentDidMount() {
    const {setup, step} = this.props;

    if (setup) {
      setup(this._canvas.getContext('2d'), 0);
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
    this._canvas && step(this._canvas.getContext('2d'), t);
    this._animationFrame = window.requestAnimationFrame(this.step);
  }

  render() {
    const {width, height} = this.props;

    return <canvas
      height={height}
      ref={el => this._canvas = el}
      width={width}
    ></canvas>;
  }
}

export default Canvas;
