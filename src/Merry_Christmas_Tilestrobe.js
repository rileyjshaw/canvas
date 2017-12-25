import React, {Component} from 'react';
import TextCanvas from 'text-canvas';
import Canvas from './Canvas';
import './Middle.css';

const {atan2, cos, sin, floor, random} = Math;

const N = 20;
const DETAIL = 10;
const SPREAD_PX = 40;
const OPACITY = 0.1;
const SPEED = 6;

// Random int [0, max].
function ri(max) {
  return floor(random() * (max + 1));
}

// Returns 6 points a fixed distance out from p1 towards p2.
function pointsFrom(p1, p2) {
  const dx = p2[0] - p1[0];
  const dy = p2[1] - p1[1];
  const angle = atan2(dy, dx);

  return Array.from({length: DETAIL}, (_, i) => {
    const mag = (i + 1) * SPREAD_PX / DETAIL;
    return [p1[0] + mag * cos(angle), p1[1] + mag * sin(angle)];
  });
}

export default class Bend extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'http://cdn.jsdelivr.net/terra/1.5.0-beta/mainfile';
    script.async = false;
    document.head.insertBefore(script, document.head.firstChild);

    window.setTimeout(() => {
      const textCanvas = (new TextCanvas('MERRY\nXMAS!', {
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: 20,
        textAlign: 'center',
      })).render();
      const W = this.W = textCanvas.width;
      const H = this.H = textCanvas.height;
      const textData = textCanvas.getContext('2d').getImageData(0, 0, W, H).data;

var bbTerrarium = new window.terra.Terrarium(100, 100, {cellSize: 1, background: [130, 220, 255], periodic: true});

window.terra.registerCreature({
  type: 'plant',
  color: [0, 120, 0],
  size: 10,
  initialEnergy: 5,
  maxEnergy: 20,
  wait: function() {
    // photosynthesis :)
    this.energy += 1;
  },
  move: false,
  reproduceLv: 0.65,
});

window.terra.registerCreature({
  type: 'brute',
  color: [255, 255, 255],
  maxEnergy: 50,
  initialEnergy: 10,
  size: 20
});

window.terra.registerCreature({
  type: 'bully',
  color: [255, 255, 255],
  initialEnergy: 20,
  reproduceLv: 0.6,
  sustainability: 3
});

bbTerrarium.grid = bbTerrarium.makeGridWithDistribution([['plant', 50], ['brute', 5], ['bully', 5]]);
  document.body.style.backgroundRepeat = "repeat";
  document.body.style.backgroundColor = "rgb(130, 220, 255)";
(function aaa () {
  bbTerrarium.draw();
  document.body.style.backgroundImage = "url(" + bbTerrarium.canvas.toDataURL("image/png") + ")";
  bbTerrarium.canvas.style.visiblity = 'hidden';
  bbTerrarium.grid = bbTerrarium.step();
  setTimeout(aaa, 16)
})();
    }, 3000);
  }

  render() {
    return null;
  }
}
