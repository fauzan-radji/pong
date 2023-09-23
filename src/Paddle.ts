import Controller from "./Controller";
import Kanvas from "./Kanvas";
import Line from "./Line";
import Vector from "./Vector";

export default class Paddle {
  track: Line;
  position: Vector;
  size: number;
  #width: number;
  #height: number;
  #canvas: Kanvas;
  #corners: Vector[];
  #angle: number;
  #controller;
  #t: number;
  #bounding: {
    top: Line;
    bottom: Line;
    right: Line;
    left: Line;
  };

  constructor({
    canvas,
    controller,
  }: {
    canvas: Kanvas;
    controller: Controller<Paddle>;
  }) {
    this.#canvas = canvas;
    this.#controller = controller;
    this.#controller.userData = this;
    this.position = new Vector(0, 0);
    this.size = 0;
    this.#width = 0;
    this.#height = 0;
    this.#corners = [];
    this.#angle = 0;
    this.#t = 0.5;
    this.#bounding = {
      top: new Line(new Vector(0, 0), new Vector(0, 0)),
      bottom: new Line(new Vector(0, 0), new Vector(0, 0)),
      right: new Line(new Vector(0, 0), new Vector(0, 0)),
      left: new Line(new Vector(0, 0), new Vector(0, 0)),
    };

    this.t = 0.5;
    this.track = new Line(new Vector(0, 0), new Vector(0, 0));
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

    const [topLeft, topRight, bottomLeft, bottomRight] = this.#corners;
    this.#bounding = {
      top: new Line(topLeft, topRight),
      bottom: new Line(bottomRight, topLeft),
      right: new Line(topRight, bottomRight),
      left: new Line(bottomLeft, topLeft),
    };
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

  draw(debug = false) {
    this.canvas
      .line(this.track.start, this.track.end)
      .stroke({ color: "#f00" });

    // draw the paddle
    this.canvas.beginPath().moveTo(this.#corners[0]);
    for (let i = 1; i < this.#corners.length; i++)
      this.canvas.lineTo(this.#corners[i]);
    this.canvas.closePath().fill();

    // draw the bounce vector
    if (debug) {
      const directionCount = 7;
      const directions = Array.from(
        { length: directionCount },
        (_, i) => i / (directionCount - 1)
      );
      for (const direction of directions) {
        const source = this.#bounding.top.lerp(direction);
        const vBounce = this.getBounceVector(direction)
          .multiply(50)
          .add(source);
        this.canvas.line(source, vBounce).stroke({ color: "#ff0" });
        this.canvas.circle(source, 3).fill("red");
      }
    }
  }

  resize(trackStart: Vector, trackEnd: Vector) {
    this.track.start = trackStart;
    this.track.end = trackEnd;
    this.#angle = Vector.angle(this.track.start, this.track.end);

    this.size = this.track.length * 0.25;
    this.#width = this.size;
    this.#height = this.size * 0.1;

    this.#calculatePosition();
  }

  getBounceVector(offset: number) {
    const slope = 0.0625;
    const startAngle = 0 + slope;
    const endAngle = 1 - slope;
    const lerpAngle = startAngle + (endAngle - startAngle) * offset;
    return Vector.fromPolar(1, this.#angle + Math.PI * lerpAngle - Math.PI);
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

  get top() {
    return this.#bounding.top;
  }
  get bottom() {
    return this.#bounding.bottom;
  }
  get left() {
    return this.#bounding.left;
  }
  get right() {
    return this.#bounding.right;
  }
}
