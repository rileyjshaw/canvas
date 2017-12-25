// This is just a mash-up of weird doodles :) plenty of room for optimization.
import React, {Component} from 'react'
import Canvas from './Canvas'
import './Middle.css'
import SimplexNoise from 'simplex-noise'
import averageColor from 'average-color'
import {hpluvToHex, hexToHpluv} from 'hsluv'

const {ceil, floor, max, min, pow, random, round, sqrt} = Math
const simplex = new SimplexNoise(random)

const SIZE_PX = 4000
const INITIAL_OFFSET_PX = 400
const DETAIL = 10
const MIN_SATURATION = 25
const MAX_SATURATION = 75
const MIN_LIGHTNESS = 40
const MAX_LIGHTNESS = 80
const CHAOS = 5 / 8

// Derived.
const D_H = 360
const D_S = MAX_SATURATION - MIN_SATURATION
const D_L = MAX_LIGHTNESS - MIN_LIGHTNESS
const SQUARE_GRID_SIZE = pow(2, DETAIL)
const OFFSET_GRID_SIZE = SQUARE_GRID_SIZE + 1
const MARGIN_PX = INITIAL_OFFSET_PX * 2
const SPACING_PX = (SIZE_PX - MARGIN_PX * 2) / SQUARE_GRID_SIZE
const FLOAT_SIZE = Float32Array.BYTES_PER_ELEMENT

const rib = (min, max) => floor(min + random() * (max - min))
const off = offset => (random() * 2 - 1) * offset

const offsetBuffer = new ArrayBuffer(OFFSET_GRID_SIZE * OFFSET_GRID_SIZE * FLOAT_SIZE * 4)

export default class DiamondSquare extends Component {
  offsets = new Float32Array(offsetBuffer)
  _offsetIdx = (x, y) => FLOAT_SIZE * (x + y * OFFSET_GRID_SIZE)
  getOffsets = (x, y) => {
    const idx = this._offsetIdx(x, y)
    return [this.offsets[idx], this.offsets[idx + 1]]
  }
  setOffsets = (x, y, xVal, yVal) => {
    const idx = this._offsetIdx(x, y)
    this.offsets[idx] = xVal
    this.offsets[idx + 1] = yVal
  }
  getPosition = (x, y) => {
    const [dX, dY] = this.getOffsets(x, y)
    return [MARGIN_PX + dX + SPACING_PX * x, MARGIN_PX + dY + SPACING_PX * y]
  }

  colors = [
    [
      [rib(0, 360), rib(MIN_SATURATION, MAX_SATURATION), rib(MIN_LIGHTNESS, MAX_LIGHTNESS)],  // Top left.
      [rib(0, 360), rib(MIN_SATURATION, MAX_SATURATION), rib(MIN_LIGHTNESS, MAX_LIGHTNESS)],  // Top right.
    ],
    [
      [rib(0, 360), rib(MIN_SATURATION, MAX_SATURATION), rib(MIN_LIGHTNESS, MAX_LIGHTNESS)],  // Bottom left.
      [rib(0, 360), rib(MIN_SATURATION, MAX_SATURATION), rib(MIN_LIGHTNESS, MAX_LIGHTNESS)],  // Bottom right.
    ],
  ]

  setup = ctx => {
    const {getOffsets, setOffsets, getPosition} = this

    // Top left.
    setOffsets(0, 0, off(INITIAL_OFFSET_PX), off(INITIAL_OFFSET_PX))
    // Top right.
    setOffsets(SQUARE_GRID_SIZE, 0, off(INITIAL_OFFSET_PX), off(INITIAL_OFFSET_PX))
    // Bottom left.
    setOffsets(0, SQUARE_GRID_SIZE, off(INITIAL_OFFSET_PX), off(INITIAL_OFFSET_PX))
    // Bottom right.
    setOffsets(SQUARE_GRID_SIZE, SQUARE_GRID_SIZE, off(INITIAL_OFFSET_PX), off(INITIAL_OFFSET_PX))

    divide(SQUARE_GRID_SIZE, INITIAL_OFFSET_PX)
    function divide (size, offset) {
      if (size < 2) return

      const half = size / 2
      for (let y = half; y < SQUARE_GRID_SIZE; y += size) {
        for (let x = half; x < SQUARE_GRID_SIZE; x += size) {
          square(x, y, half, offset)
        }
      }
      for (let y = 0; y <= SQUARE_GRID_SIZE; y += half) {
        for (let x = (y + half) % size; x <= SQUARE_GRID_SIZE; x += size) {
          diamond(x, y, half, offset)
        }
      }

      divide(half, offset * CHAOS)
    }

    let i = 2
    while (this.colors.length < SQUARE_GRID_SIZE) {
      this.colors = Array.from({length: this.colors.length * 2}, (_, y) => {
        return Array.from({length: this.colors.length * 2}, (_, x) => {
          const x0 = floor(x / 2)
          const y0 = floor(y / 2)
          const rando = [random() * 360, rib(MIN_SATURATION, MAX_SATURATION), rib(MIN_LIGHTNESS, MAX_LIGHTNESS)]
          const parent = this.colors[x0][y0]
          const neighbors = []

          // Quilt!
          // let newH = parent[0] + off(D_H / pow(2, i))
          // let newS = parent[1] + off(D_S / pow(2, i))
          // let newL = parent[2] + off(D_L / pow(2, i))

          // Other quilt!
          for (let dY = -1; dY <= 1; dY += 1) {
            for (let dX = -3; dX <= 3; dX += 1) {
              const row = this.colors[y0 + dY];
              if (row) {
                const color = row[x0 + dX]
                neighbors.push(random() < 0.4 ? parent : rando)
                for (let z = 1; color && (z < sqrt(i)); ++z) {
                  neighbors.push(color)
                }
              }
            }
          }
          let [newH, newS, newL] = averageColor(neighbors)

          newH = round(newH % 360)
          newS = round(min(max(newS, MIN_SATURATION), MAX_SATURATION))
          newL = round(min(max(newL, MIN_LIGHTNESS), MAX_LIGHTNESS))

          return [newH, newS, newL]
        })
      })
      ++i
    }

    let y = 0
    const drawRow = () => {
      for (let x = 0; x < SQUARE_GRID_SIZE; ++x) {
        const [h1, s1, l1] = this.colors[x][y]

        // Camo!
        const h2 = round((simplex.noise2D(x / 810, y / 330) / (sqrt(2) / 2) + 1) / 2 * 360) % 360
        const s2 = round(min(max(((simplex.noise2D(x / 350 + 10000, y / 110 + 10000) / (sqrt(2) / 2) + 1) / 2 * (MAX_SATURATION - MIN_SATURATION) + MIN_SATURATION), MIN_SATURATION), MAX_SATURATION))
        const l2 = round(min(max((simplex.noise2D(x / 875 + 11000, y / 160 + 11000) / (sqrt(2) / 2) + 1) / 2 * (MAX_LIGHTNESS - MIN_LIGHTNESS) + MIN_LIGHTNESS, MIN_LIGHTNESS), MAX_LIGHTNESS))

        const [h, s, l] = averageColor(hexToHpluv(hpluvToHex([h1, s1, l1])), hexToHpluv(hpluvToHex([h1, s1, l1])), [h1, s1, l1], [h2, s2, l2])
        ctx.beginPath()
        ctx.strokeStyle = ctx.fillStyle = `hsl(${h}, ${s}%, ${l}%)`
        ctx.moveTo(...getPosition(x, y))
        ctx.lineTo(...getPosition(x + 1, y))
        ctx.lineTo(...getPosition(x + 1, y + 1))
        ctx.lineTo(...getPosition(x, y + 1))
        ctx.closePath()
        ctx.stroke()
        ctx.fill()
      }

      if (++y < SQUARE_GRID_SIZE) requestAnimationFrame(drawRow)
    }
    drawRow()

    function square(x, y, size, offset) {
      const neighbors = [
        [x - size, y - size],  // Upper left.
        [x + size, y - size],  // Upper right.
        [x + size, y + size],  // Lower right.
        [x - size, y + size],  // Lower left.
      ].filter(neighbor => neighbor[0] >= 0 && neighbor[1] >= 0 && neighbor[0] <= SQUARE_GRID_SIZE && neighbor[1] <= SQUARE_GRID_SIZE
      ).map(neighbor => getOffsets(...neighbor))

      const {dX, dY} = neighbors.reduce((acc, cur, _, {length}) => {
        acc.dX += cur[0] / length
        acc.dY += cur[1] / length
        return acc
      }, {dX: 0, dY: 0})

      setOffsets(x, y, dX + off(offset * 2), dY + off(offset / 4))
    }

    function diamond(x, y, size, offset) {
      const neighbors = [
        [x, y - size],  // Top.
        [x + size, y],  // Right.
        [x, y + size],  // Bottom.
        [x - size, y],  // Left.
      ].filter(neighbor => neighbor[0] >= 0 && neighbor[1] >= 0 && neighbor[0] <= SQUARE_GRID_SIZE && neighbor[1] <= SQUARE_GRID_SIZE
      ).map(neighbor => getOffsets(...neighbor))

      const {dX, dY} = neighbors.reduce((acc, cur, _, {length}) => {
        acc.dX += cur[0] / length
        acc.dY += cur[1] / length
        return acc
      }, {dX: 0, dY: 0})

      setOffsets(x, y, dX + off(offset * 2), dY + off(offset * 2))
    }
  }

  render() {
    return <Canvas
      height={SIZE_PX}
      setup={this.setup}
      width={SIZE_PX}
    />
  }
}
