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
  #paddles;
  #ball;
  #debug;

  constructor({ canvas, ballSize, playerCount }) {
    this.#canvas = canvas;

    this.#paddles = [];
    for (let i = 0; i < playerCount; i++)
      this.#paddles.push(
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

    this.#ball = new Ball({
      size: ballSize / (playerCount * 0.5),
      canvas: this.canvas,
      pong: this,
    });

    this.#isPlaying = false;
  }

  #initBoundary() {
    this.#boundaries = [];
    this.#corners = [];

    // this line used for avoid the boundary out of canvas
    const canvasMin = Math.min(
      this.canvas.width * 0.5,
      this.canvas.height * 0.5
    );
    // generate the corners based on how much paddles are
    const angleIncrement = (Math.PI * 2) / this.#paddles.length;
    for (let i = 0; i < Math.PI * 2; i = +(i + angleIncrement).toFixed(4)) {
      const ninetyDegrees = Math.PI * 0.5;
      const angle = +i.toFixed(4) + ninetyDegrees;
      const anggleOffset = angleIncrement * 0.2;
      const angle1 = angle - anggleOffset;
      const angle2 = angle + anggleOffset;
      this.#corners.push(Vector.fromPolar(canvasMin, angle1));
      this.#corners.push(Vector.fromPolar(canvasMin, angle2));
    }

    for (let i = 0; i < this.#corners.length; i++) {
      const j = (i + 1) % this.#corners.length;
      const boundary = new Line(this.#corners[i], this.#corners[j]);
      if (i % 2 === 0)
        // set paddle track
        // since boundary line is going from right to left,
        // and paddle track is going from left to right
        // then we need to inverse the start and end
        this.#paddles[i / 2].resize(boundary.end, boundary.start);
      else this.#boundaries.push(boundary);
    }
  }

  resize(width, height) {
    this.canvas.resize(width, height);
    this.#initBoundary();
  }

  update() {
    this.#ball.update();
    for (const paddle of this.#paddles) paddle.update();
  }

  draw() {
    this.canvas.clear();
    for (const boundary of this.#boundaries)
      this.canvas.line(boundary.start, boundary.end).stroke({ color: "#fff" });

    this.#ball.draw(this.#debug);
    for (const paddle of this.#paddles) paddle.draw(this.#debug);
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

  set debug(debug) {
    this.#debug = !!debug;
  }

  get debug() {
    return this.#debug;
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

  get paddles() {
    return this.#paddles;
  }
}
