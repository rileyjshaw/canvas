import React, {Component} from 'react';

class Canvas extends Component {
  componentDidMount() {
    const {width, height, setup, step} = this.props;

    this._canvas.style.width = width / 2 + 'px';
    this._canvas.style.height = height / 2 + 'px';

    if (setup) {
      setup(this._canvas.getContext('2d'), 0);
    }

    if (step) {
      this._i = 0;
      this._animationFrame = window.requestAnimationFrame(this.step);
    }
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this._animationFrame);
  }

  step = (t) => {
    const {step} = this.props;
    this._canvas && step(this._canvas.getContext('2d'), t, this._i++);
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
