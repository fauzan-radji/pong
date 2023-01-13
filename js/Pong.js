import Controller from "./Controller.js";
import Line from "./Line.js";
import Paddle from "./Paddle.js";
import Puck from "./Puck.js";
import Vector from "./Vector.js";

export default class Pong {
  #canvas;
  #boundaries;
  #corners;
  constructor({ canvas, paddleSize, puckSize }) {
    this.#canvas = canvas;
    this.paddles = [
      // bottom paddle
      new Paddle({
        size: paddleSize,
        trackStart: new Vector(this.canvas.left, this.canvas.bottom),
        trackEnd: new Vector(this.canvas.right, this.canvas.bottom),
        canvas: this.canvas,
        controller: new Controller({
          ArrowRight: function (p) {
            p.goRight();
          },
          ArrowLeft: function (p) {
            p.goLeft();
          },
        }),
      }),
      // top paddle
      new Paddle({
        size: paddleSize,
        trackStart: new Vector(this.canvas.right, this.canvas.top),
        trackEnd: new Vector(this.canvas.left, this.canvas.top),
        canvas: this.canvas,
        controller: new Controller({
          KeyD: function (p) {
            p.goRight();
          },
          KeyA: function (p) {
            p.goLeft();
          },
        }),
      }),
    ];
    this.puck = new Puck({
      size: puckSize,
      canvas: this.canvas,
      pong: this,
    });
    this.#initBoundary();
  }

  #initBoundary() {
    this.#boundaries = [];
    this.#corners = [];

    const canvasMin = Math.min(
      this.canvas.width * 0.5,
      this.canvas.height * 0.5
    );
    const sidesCount = this.paddles.length * 2;
    const angle = (Math.PI * 2) / sidesCount;
    for (let i = 0; i < Math.PI * 2; i += angle) {
      const ninetyDegrees = Math.PI * 0.5;
      const halfAngle = angle * 0.5;
      this.#corners.push(
        Vector.fromPolar(canvasMin, i + ninetyDegrees - halfAngle)
      );
    }

    for (let i = 0; i < this.#corners.length; i++) {
      const j = (i + 1) % this.#corners.length;
      const boundary = new Line(this.#corners[i], this.#corners[j]);
      this.boundaries.push(boundary);
    }
  }

  resize(width, height) {
    this.canvas.resize(width, height);
    this.#initBoundary();
  }

  update() {
    this.puck.update();
    for (const paddle of this.paddles) paddle.update();
  }

  draw() {
    this.canvas.clear();
    this.puck.draw();
    for (const paddle of this.paddles) paddle.draw();

    for (const boundary of this.boundaries)
      this.canvas.line(boundary.start, boundary.end).stroke();
  }

  play() {
    this.update();
    this.draw();

    requestAnimationFrame(this.play.bind(this));
  }

  get canvas() {
    return this.#canvas;
  }

  get boundaries() {
    return this.#boundaries;
  }
}
