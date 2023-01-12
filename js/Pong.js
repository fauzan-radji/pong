import Controller from "./Controller.js";
import Paddle from "./Paddle.js";
import Puck from "./Puck.js";
import Vector from "./Vector.js";

export default class Pong {
  #canvas;
  constructor({ canvas, paddleSize, puckSize }) {
    this.#canvas = canvas;
    this.paddles = [
      // bottom paddle
      new Paddle({
        size: paddleSize,
        trackStart: new Vector(0, this.canvas.height),
        trackEnd: new Vector(this.canvas.width, this.canvas.height),
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
        trackStart: new Vector(this.canvas.width, 0),
        trackEnd: new Vector(0, 0),
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
    });
  }

  update() {
    this.puck.update();
    for (const paddle of this.paddles) paddle.update();
  }

  draw() {
    this.canvas.clear();
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
}
