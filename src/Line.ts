import Vector from "./Vector";

export default class Line {
  constructor(public start: Vector, public end: Vector) {}

  lerp(t: number) {
    return Vector.lerp(this.start, this.end, t);
  }

  intersect(other: Line) {
    return Line.intersect(this, other);
  }

  reflect(v: Vector) {
    // parallel (projection of v to this.normal) (projection is just dot product)
    const parallel = this.normal.multiply(v.dot(this.normal));
    // perpendicular (v subtract parallel)
    const perpendicular = Vector.subtract(v, parallel);

    return parallel.multiply(-1).add(perpendicular);
  }

  get length() {
    return Vector.distance(this.start, this.end);
  }

  get center() {
    return Vector.subtract(this.end, this.start).divide(2).add(this.start);
  }

  get normal() {
    const delta = Vector.subtract(this.end, this.start);
    return new Vector(-delta.y, delta.x).normalize();
  }

  static intersect(line1: Line, line2: Line) {
    const tTop =
      (line2.end.x - line2.start.x) * (line1.start.y - line2.start.y) -
      (line2.end.y - line2.start.y) * (line1.start.x - line2.start.x);
    const uTop =
      (line2.start.y - line1.start.y) * (line1.start.x - line1.end.x) -
      (line2.start.x - line1.start.x) * (line1.start.y - line1.end.y);
    const bottom =
      (line2.end.y - line2.start.y) * (line1.end.x - line1.start.x) -
      (line2.end.x - line2.start.x) * (line1.end.y - line1.start.y);

    if (bottom === 0) return null;

    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        point: line1.lerp(t),
        offset1: t,
        offset2: u,
      };
    }
  }
}
