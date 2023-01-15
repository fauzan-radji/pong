import Line from "./Line.js";
import Vector from "./Vector.js";

export default class Ball {
  #canvas;
  #direction;
  #pong;
  #speed;
  #positionLine;
  #size;
  #velocity;
  #position;

  constructor({ size, canvas, pong }) {
    this.#canvas = canvas;
    this.#size = size;
    this.#pong = pong;
    this.reset();
  }

  reset() {
    const randomAngle = Math.random() * Math.PI * 2;
    this.#direction = Vector.fromPolar(1, randomAngle);
    this.#speed = 5;
    this.#velocity = Vector.multiply(this.#direction, this.#speed);
    this.#position = this.canvas.center.copy();
    this.#positionLine = new Line(this.canvas.center, this.#position); // position line used for collision check
  }

  edges() {
    // check boundaries collision
    for (const boundary of this.#pong.boundaries) {
      const intersection = Line.intersect(this.#positionLine, boundary);
      if (intersection) {
        // do resolution first
        this.#position.subtract(
          Vector.multiply(this.#position, 1 - intersection.offset)
        );

        // reflect the velocity vector by this boundary
        this.#direction = boundary.reflect(this.#direction);
        this.#velocity = Vector.multiply(this.#direction, this.#speed);

        return;
      }
    }

    for (const paddle of this.#pong.paddles) {
      // check paddles track collision
      const trackIntersection = Line.intersect(
        this.#positionLine,
        paddle.track
      );
      if (trackIntersection) {
        this.reset();
        return;
      }

      // check paddle collision
      const paddleIntersection = Line.intersect(this.#positionLine, paddle.top);
      if (paddleIntersection) {
        // do resolution first
        this.#position.subtract(
          Vector.multiply(this.#position, 1 - paddleIntersection.offset)
        );

        // reflect the velocity vector by this boundary
        this.#direction = paddle.top.reflect(this.#direction);
        this.#velocity = Vector.multiply(this.#direction, this.#speed);

        return;
      }
    }
  }

  update() {
    this.edges();
    this.#position.add(this.#velocity);
  }

  draw() {
    this.canvas.polygon(this.#position, 12, this.#size).fill();
    // this.drawVectors();
  }

  drawVectors() {
    // velocity
    this.canvas
      .line(
        this.#position,
        Vector.multiply(this.#direction, 10).add(this.#position)
      )
      .stroke({ color: "#f00" });

    // position
    this.canvas.line({ x: 0, y: 0 }, this.#position).stroke({ color: "#fff" });
  }

  get canvas() {
    return this.#canvas;
  }
}
