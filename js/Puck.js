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
    this.position = new Vector(0, 0);
    this.#direction = Math.random() * Math.PI * 2;
    this.speed = 5;
    this.velocity = Vector.fromPolar(this.speed, this.#direction);
  }

  update() {
    this.position.add(this.velocity);
  }

  draw() {
    this.canvas.circle(this.position, this.size).fill();
  }

  get canvas() {
    return this.#canvas;
  }
}
