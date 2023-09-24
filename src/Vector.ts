export default class Vector {
  constructor(
    public x: number,
    public y: number,
    public z: number = 0,
    public w: number = 0
  ) {}

  /**
   * copying this vector
   * @returns {Vector} new Vector that has the same value as this vector
   */
  copy(): Vector {
    return new Vector(this.x, this.y, this.z, this.w);
  }

  rotateZ(angle: number): Vector {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const { x, y } = this;
    this.x = cos * x - sin * y;
    this.y = sin * x + cos * y;

    return this;
  }

  translateX(distance: number): Vector {
    this.x += distance;
    return this;
  }

  translateY(distance: number): Vector {
    this.y += distance;
    return this;
  }

  translateZ(distance: number): Vector {
    this.z += distance;
    return this;
  }

  /**
   * Dot product of this Vector and v Vector
   * @param {Vector} v antoher Vector
   * @returns {number}
   */
  dot(v: Vector): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Subtracting this Vector and v Vector
   * @param {Vector} v antoher Vector
   * @returns {Vector}
   */
  subtract(v: Vector): Vector {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;

    return this;
  }

  /**
   * Adding this Vector and v Vector
   * @param {Vector} v antoher Vector
   * @returns {Vector}
   */
  add(v: Vector): Vector {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;

    return this;
  }

  /**
   * Multiply this Vector by k
   * @param {number} k scaling factor
   * @returns {Vector}
   */
  multiply(k: number): Vector {
    this.x *= k;
    this.y *= k;
    this.z *= k;

    return this;
  }

  /**
   * Divide this Vector by k
   * @param {number} k scaling factor
   * @returns {Vector}
   */
  divide(k: number): Vector {
    this.x /= k;
    this.y /= k;
    this.z /= k;

    return this;
  }

  normalize() {
    const length = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);

    return this.divide(length);
  }

  /**
   * Linear interpolation between two vector with given t value
   * @param {Vector} start
   * @param {Vector} end
   * @param {number} t
   */
  lerp(start: Vector, end: Vector, t: number) {
    const v = Vector.add(
      Vector.multiply(Vector.subtract(end, start), t),
      start
    );
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;

    return this;
  }

  /**
   * Convert a polar vector to cartesian vector
   * @param {number} r - length of the vector
   * @param {number} theta - angle in radian
   *
   * @returns {Vector}
   */
  static fromPolar(r: number, theta: number): Vector {
    return new Vector(r * Math.cos(theta), r * Math.sin(theta));
  }

  /**
   * Convert a cartesian vector to polar vector
   * @param {Vector} v - vector to calculate the polar coordinate
   *
   * @returns {{ r: number, theta: number }}
   */
  static toPolar(v: Vector): { r: number; theta: number } {
    const r = Math.sqrt(v.x ** 2 + v.y ** 2);
    const theta = Math.atan2(v.y, v.x);
    return { r, theta };
  }

  /**
   * Get angle between formed by two vectors (start, end)
   * @param {Vector} start
   * @param {Vector} end
   * @returns {number} Angle in radians
   */
  static angle(start: Vector, end: Vector): number {
    const v = Vector.subtract(end, start);
    return Math.atan2(v.y, v.x);
  }

  /**
   * Test and returning a Point where a Line intersects with a Plane
   * @param {Vector} plane_p a Point in a Plane
   * @param {Vector} plane_n Normal vector to the Plane
   * @param {Vector} lineStart Line Start
   * @param {Vector} lineEnd Line End
   * @return {Vector}
   */
  static intersectPlane(
    plane_p: Vector,
    plane_n: Vector,
    lineStart: Vector,
    lineEnd: Vector
  ): Vector {
    plane_n = plane_n.normalize();
    const plane_d = -plane_n.dot(plane_p);
    const ad = lineStart.dot(plane_n);
    const bd = lineEnd.dot(plane_n);
    const t = (-plane_d - ad) / (bd - ad);
    const lineStartToEnd = lineEnd.subtract(lineStart);
    const lineToIntersect = lineStartToEnd.multiply(t);
    return lineStart.add(lineToIntersect);
  }

  /**
   * Adding tow vectors (a + b) and return the result vector
   * @param {Vector} a antoher Vector
   * @param {Vector} b antoher Vector
   * @returns {Vector}
   */
  static add(a: Vector, b: Vector): Vector {
    return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  /**
   * Subtract two vectors (a - b) and return the result vector
   * @param {Vector} a
   * @param {Vector} b
   * @returns {Vector}
   */
  static subtract(a: Vector, b: Vector): Vector {
    return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  /**
   * Multiply v Vector by k
   * @param {Vector} v - a vector to multiply
   * @param {number} k - scaling factor
   * @returns {Vector}
   */
  static multiply(v: Vector, k: number): Vector {
    return new Vector(v.x * k, v.y * k, v.z * k);
  }

  /**
   * Divide v Vector by k
   * @param {Vector} v - a vector to divide
   * @param {number} k - scaling factor
   * @returns {Vector}
   */
  static divide(v: Vector, k: number): Vector {
    return new Vector(v.x / k, v.y / k, v.z / k);
  }

  static normalize(v: Vector) {
    const length = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);

    return Vector.divide(v, length);
  }

  /**
   * Linear interpolation between two vector with given t value
   * @param {Vector} start
   * @param {Vector} end
   * @param {number} t
   */
  static lerp(start: Vector, end: Vector, t: number) {
    return Vector.add(Vector.multiply(Vector.subtract(end, start), t), start);
  }

  static distance(v1: Vector, v2: Vector) {
    const v = Vector.subtract(v2, v1);

    return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  }
}
