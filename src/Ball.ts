import Line from "./Line";
import Vector from "./Vector";
import Kanvas from "./Kanvas";
import Pong from "./Pong";

export default class Ball {
  #canvas;
  #direction: Vector = new Vector(1, 1);
  #pong;
  #speed: number = 5;
  #positionLine: Line = new Line(new Vector(0, 0), new Vector(0, 0));
  #size;
  #velocity: Vector = new Vector(0, 0);
  #position;
  #diagonals;

  constructor({
    size,
    canvas,
    pong,
  }: {
    size: number;
    canvas: Kanvas;
    pong: Pong;
  }) {
    this.#canvas = canvas;
    this.#size = size;
    this.#pong = pong;

    // FIXME: When updating position, update all of the properties corresponding to new position; best case to use setter method
    this.#position = this.canvas.center.copy();
    this.reset();

    this.#diagonals = [];
    const angle = (Math.PI * 2) / 8;
    for (let i = angle; i <= Math.PI * 2; i += angle)
      this.#diagonals.push(
        new Line(
          this.#position,
          Vector.fromPolar(this.#size, +i.toFixed(4)).add(this.#position)
        )
      );
  }

  reset() {
    const randomAngle = Math.random() * Math.PI * 2;
    this.#direction = Vector.fromPolar(1, randomAngle);
    this.#speed = 5;
    this.#velocity = Vector.multiply(this.#direction, this.#speed);
    this.#position.x = 0;
    this.#position.y = 0;
    this.#positionLine = new Line(this.canvas.center, this.#position); // position line used for collision check

    if (this.#diagonals) this.#updateDiagonals();
  }

  #updateDiagonals() {
    let angle = 0;
    const increment = (Math.PI * 2) / 8;
    for (const diagonal of this.#diagonals) {
      diagonal.end = Vector.fromPolar(this.#size, angle).add(this.#position);
      angle += increment;
    }
  }

  #edges() {
    for (const diagonal of [this.#positionLine, ...this.#diagonals]) {
      // check boundaries collision
      for (const boundary of this.#pong.boundaries) {
        const intersection = Line.intersect(diagonal, boundary);
        if (intersection) {
          // do resolution first
          this.#position.subtract(
            Vector.subtract(diagonal.end, diagonal.start).multiply(
              1 - intersection.offset1
            )
          );

          // reflect the velocity vector by this boundary
          this.#direction = boundary.reflect(this.#direction);
          this.#velocity = Vector.multiply(this.#direction, this.#speed);

          return;
        }
      }

      for (const paddle of this.#pong.paddles) {
        // check paddle collision
        const paddleIntersection = Line.intersect(diagonal, paddle.top);
        if (paddleIntersection) {
          // do resolution first
          this.#position.subtract(
            Vector.subtract(diagonal.end, diagonal.start).multiply(
              1 - paddleIntersection.offset1
            )
          );

          // reflect the velocity vector by this boundary
          // this.#direction = paddle.top.reflect(this.#direction);
          this.#direction = paddle.getBounceVector(paddleIntersection.offset2);
          this.#velocity = Vector.multiply(this.#direction, this.#speed);

          return;
        }

        // check paddles track collision
        const trackIntersection = Line.intersect(diagonal, paddle.track);
        if (trackIntersection) {
          this.reset();
          this.#pong.pause();
          return;
        }
      }
    }
  }

  update() {
    this.#position.add(this.#velocity);
    this.#updateDiagonals();
    this.#edges();
  }

  draw(debug = false) {
    this.canvas.circle(this.#position, this.#size).fill();

    if (debug) this.#drawVectors();
  }

  #drawVectors() {
    // velocity
    this.canvas
      .line(
        this.#position,
        Vector.multiply(this.#direction, Math.max(innerWidth, innerHeight)).add(
          this.#position
        )
      )
      .stroke({ color: "#0f0" });

    // position line
    // this.canvas
    //   .line(this.#positionLine.start, this.#positionLine.end)
    //   .stroke({ color: "#fff" });

    // diagonals
    for (const diagonal of this.#diagonals)
      this.canvas.line(diagonal.start, diagonal.end).stroke({ color: "#f00" });
  }

  get canvas() {
    return this.#canvas;
  }
}
