import Line from "./Line.js";
import Vector from "./Vector.js";

export default class Paddle {
  #width;
  #height;
  #canvas;
  #corners;
  #angle;
  #controller;
  #t;

  constructor({ canvas, controller }) {
    this.#canvas = canvas;
    this.#controller = controller;
    this.#controller.userData = this;

    this.t = 0.5;
    this.track = new Line();
  }

  #calculatePosition() {
    this.position = Vector.lerp(this.track.start, this.track.end, this.t);
    const left = this.position.x - this.width * 0.5;
    const right = this.position.x + this.width * 0.5;
    const top = this.position.y - this.height * 1.5;
    const bottom = this.position.y - this.height * 0.5;

    this.#corners = [
      // top left corner
      new Vector(left, top),
      // top right corner
      new Vector(right, top),
      // bottom right corner
      new Vector(right, bottom),
      // bottom left corner
      new Vector(left, bottom),
    ];
    for (const corner of this.#corners) {
      corner.subtract(this.position);
      corner.rotateZ(this.#angle);
      corner.add(this.position);
    }
  }

  update() {
    this.#controller.control();
    this.#calculatePosition();
  }

  goRight() {
    this.t += 0.01;
  }

  goLeft() {
    this.t -= 0.01;
  }

  draw() {
    this.canvas
      .line(this.track.start, this.track.end)
      .stroke({ color: "#f00" });

    // draw the paddle
    this.canvas.beginPath().moveTo(this.#corners[0]);
    for (let i = 1; i < this.#corners.length; i++)
      this.canvas.lineTo(this.#corners[i]);
    this.canvas.closePath().fill();
  }

  resize(trackStart, trackEnd) {
    this.track.start = trackStart;
    this.track.end = trackEnd;
    this.#angle = Vector.angle(this.track.start, this.track.end);

    this.size = this.track.length * 0.25;
    this.#width = this.size;
    this.#height = this.size * 0.1;

    this.#calculatePosition();
  }

  set t(t) {
    this.#t = Math.min(Math.max(t, 0.125), 0.875);
  }

  get t() {
    return this.#t;
  }

  get canvas() {
    return this.#canvas;
  }

  get width() {
    return this.#width;
  }

  get height() {
    return this.#height;
  }
}
