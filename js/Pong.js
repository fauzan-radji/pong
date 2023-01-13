import Controller from "./Controller.js";
import Line from "./Line.js";
import Paddle from "./Paddle.js";
import Puck from "./Puck.js";
import Vector from "./Vector.js";

export default class Pong {
  #canvas;
  #boundaries;
  #corners;
  constructor({ canvas, puckSize, playerCount }) {
    this.#canvas = canvas;
    this.#initBoundary(playerCount * 2); // boundary is twice of players

    this.paddles = [];
    for (let i = 0; i < this.boundaries.length; i += 2) {
      const boundary = this.boundaries[i];

      this.paddles.push(
        new Paddle({
          // since boundary line is going from right to left,
          // and paddle track is going from left to right
          // then we need to inverse the start and end
          trackStart: boundary.end,
          trackEnd: boundary.start,
          canvas: this.canvas,
          controller: new Controller({
            ArrowRight: function (p) {
              p.goRight();
            },
            ArrowLeft: function (p) {
              p.goLeft();
            },
          }),
        })
      );
    }
    this.puck = new Puck({
      size: puckSize,
      canvas: this.canvas,
      pong: this,
    });
  }

  #initBoundary(boundaryCount) {
    this.#boundaries = [];
    this.#corners = [];

    const canvasMin = Math.min(
      this.canvas.width * 0.5,
      this.canvas.height * 0.5
    );
    const angle = +((Math.PI * 2) / boundaryCount).toFixed(4);
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
    for (const boundary of this.boundaries)
      this.canvas.line(boundary.start, boundary.end).stroke({ color: "#fff" });

    this.puck.draw();
    for (const paddle of this.paddles) paddle.draw();
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
