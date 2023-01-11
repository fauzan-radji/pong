import Paddle from "./Paddle.js";
import Puck from "./Puck.js";
import Vector from "./Vector.js";

export default class Pong {
  #canvas;
  constructor({ canvas, paddleSize, puckSize }) {
    this.#canvas = canvas;
    this.paddles = [
      new Paddle({
        size: paddleSize,
        position: new Vector(10, this.canvas.center.y),
        canvas: this.canvas,
      }),
      new Paddle({
        size: paddleSize,
        position: new Vector(this.canvas.width - 10, this.canvas.center.y),
        canvas: this.canvas,
      }),
    ];
    this.puck = new Puck({
      size: puckSize,
      canvas: this.canvas,
    });
  }

  draw() {
    this.puck.draw();
    for (const paddle of this.paddles) {
      paddle.draw();
    }
  }

  get canvas() {
    return this.#canvas;
  }
}
