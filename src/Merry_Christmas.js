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

export default class MerryChristmas extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/terra/1.5.0-beta/mainfile';
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

      const terrarium = new window.terra.Terrarium(W, H * 3, {
        cellSize: 1,
        trails: 0.94,
        periodic: true,
        background: [255, 255, 255],
      });

      window.terra.registerCreature({
        type: 'wanderer',
        colorFn: function () { return this.red ? [255, 0, 0] : [0, 200, 0] },
        initialEnergy: 100,
        process: function (neighbors, x, y) {
          y -= H;

          var step;
          var spots = neighbors.filter(function (spot) {
            let {x: x2, y: y2} = spot.coords;
            y2 -= H;
            return !spot.creature && textData[(x2 + y2 * W) * 4 + 3];
          });
          var numSpots = spots.length;

          if (numSpots === 0 && !textData[(x + y * W) * 4 + 3]) {
            spots = neighbors.filter(function (spot) {
              return !spot.creature;
            });
            numSpots = spots.length;
          }

          if (numSpots) {
            step = spots[Math.floor(Math.random() * numSpots)].coords;
            step.creature = this; step.observed = true;
            return step;
          }
        },
        wait: function () {}
      }, function () { this.red = Math.random() < 0.5 });

      terrarium.grid = terrarium.makeGridWithDistribution([['wanderer', 10]]);
      terrarium.animate();
    }, 3000);
  }

  render() {
    return null;
  }
}
