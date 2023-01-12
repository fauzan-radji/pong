import Vector from "./Vector.js";

export default class Paddle {
  #width;
  #height;
  #canvas;
  #corners;
  #angle;

  constructor({ size, trackStart, trackEnd, canvas }) {
    this.#canvas = canvas;
    this.track = {
      start: trackStart,
      end: trackEnd,
    };
    this.t = 0.5;
    this.position = Vector.lerp(this.track.start, this.track.end, this.t);

    this.size = size;
    this.#width = size;
    this.#height = size * 0.1;

    this.#corners = [
      // top left corner
      new Vector(
        this.position.x - this.width * 0.5,
        this.position.y - this.height * 0.5
      ),
      // top right corner
      new Vector(
        this.position.x + this.width * 0.5,
        this.position.y - this.height * 0.5
      ),
      // bottom right corner
      new Vector(
        this.position.x + this.width * 0.5,
        this.position.y + this.height * 0.5
      ),
      // bottom left corner
      new Vector(
        this.position.x - this.width * 0.5,
        this.position.y + this.height * 0.5
      ),
    ];
    this.#angle = Vector.angle(this.track.start, this.track.end);
    for (const corner of this.#corners) {
      corner.subtract(this.position);
      corner.rotateZ(this.#angle);
      corner.add(this.position);
    }
  }

  update() {}

  draw() {
    this.canvas
      .beginPath()
      .line(this.track.start, this.track.end)
      .closePath()
      .stroke();

    // draw the paddle
    this.canvas.beginPath().moveTo(this.#corners[0]);
    for (let i = 1; i < this.#corners.length; i++)
      this.canvas.lineTo(this.#corners[i]);
    this.canvas.closePath().fill();
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
