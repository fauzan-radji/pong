import Vector from "./Vector.js";

export default class Puck {
  #canvas;
  #direction;
  #pong;
  #speed;

  constructor({ size, canvas, pong }) {
    this.#canvas = canvas;
    this.size = size;
    this.#pong = pong;
    this.reset();
  }

  reset() {
    this.position = new Vector(0, 0);
    this.#direction = Math.random() * Math.PI * 2;
    this.#speed = 5;
    this.velocity = Vector.fromPolar(this.#speed, this.#direction);
  }

  edges() {
    console.log(this.pong.boundaries);
  }

  update() {
    this.edges();
    this.position.add(this.velocity);
  }

  draw() {
    this.canvas.polygon(this.position, 12, this.size).fill();
  }

  get canvas() {
    return this.#canvas;
  }

  get pong() {
    return this.#pong;
  }
}
