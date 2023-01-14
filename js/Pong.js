import Controller from "./Controller.js";
import Line from "./Line.js";
import Paddle from "./Paddle.js";
import Ball from "./Ball.js";
import Vector from "./Vector.js";

export default class Pong {
  #canvas;
  #boundaries;
  #corners;
  #isPlaying;
  constructor({ canvas, ballSize, playerCount }) {
    this.#canvas = canvas;

    this.paddles = [];
    for (let i = 0; i < playerCount; i++)
      this.paddles.push(
        new Paddle({
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

    this.#initBoundary();

    this.ball = new Ball({
      size: ballSize,
      canvas: this.canvas,
      pong: this,
    });

    this.#isPlaying = false;
  }

  #initBoundary() {
    this.#boundaries = [];
    this.#corners = [];

    const canvasMin = Math.min(
      this.canvas.width * 0.5,
      this.canvas.height * 0.5
    );
    const angle = +((Math.PI * 2) / (this.paddles.length * 2)).toFixed(4);
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
      if (i % 2 === 0)
        // set paddle track
        // since boundary line is going from right to left,
        // and paddle track is going from left to right
        // then we need to inverse the start and end
        this.paddles[i / 2].resize(boundary.end, boundary.start);
      else this.boundaries.push(boundary);
    }
  }

  resize(width, height) {
    this.canvas.resize(width, height);
    this.#initBoundary();
  }

  update() {
    this.ball.update();
    for (const paddle of this.paddles) paddle.update();
  }

  draw() {
    this.canvas.clear();
    for (const boundary of this.boundaries)
      this.canvas.line(boundary.start, boundary.end).stroke({ color: "#fff" });

    this.ball.draw();
    for (const paddle of this.paddles) paddle.draw();
  }

  #animate() {
    this.update();
    this.draw();
    if (this.#isPlaying) requestAnimationFrame(this.#animate.bind(this));
  }

  play() {
    this.#isPlaying = true;
    this.#animate();
  }

  pause() {
    this.#isPlaying = false;
  }

  get canvas() {
    return this.#canvas;
  }

  get boundaries() {
    return this.#boundaries;
  }

  get isPlaying() {
    return this.#isPlaying;
  }
}
