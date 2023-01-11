import Vector from "./Vector.js";

export default class Puck {
  #canvas;
  #direction;

  constructor({ size, canvas }) {
    this.#canvas = canvas;
    this.size = size;
    this.reset();
  }

  reset() {
    this.position = this.#canvas.center;
    this.#direction = Vector.random();
    this.speed = 5;
  }

  draw() {
    this.#canvas.circle(this.position, this.size);
  }
}
