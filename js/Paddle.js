export default class Paddle {
  #width;
  #height;
  #canvas;
  constructor({ size, position, canvas }) {
    this.#canvas = canvas;
    this.size = size;
    this.#width = size * 0.1;
    this.#height = size;
    this.position = position;
  }

  draw() {
    this.#canvas.rect(this.position, this.#width, this.#height).fill();
  }
}
