export default class Vector {
  constructor(x, y, z = 0, w = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  /**
   * copying this vector
   * @returns {Vector} new Vector that has the same value as this vector
   */
  copy() {
    return new Vector(this.x, this.y, this.z, this.w);
  }

  /**
   * Projecting 3D matrix to 2D matrix
   * @param {number} distance
   * @returns
   */
  project(scene) {
    // by default, the z axis is pointing towards the camera, so we need to reverse it
    const z = -this.z;
    const { x, y } = this;
    const w = 1;

    const projected = new Vector(x, y, z, w).transform(scene.projectionMatrix);

    if (z !== 0) {
      projected.x /= z;
      projected.y /= z;
      projected.z /= z;
    }

    // scale the projected vector to the screen size
    projected.x *= scene.canvas.width;
    projected.y *= scene.canvas.height;

    // translate the projected vector to the center of the canvas
    projected.x += scene.canvas.center.x;
    projected.y += scene.canvas.center.y;

    return projected;
  }

  /**
   * Rotate 3d matrix around X axis
   * @param {number} angle in degrees
   */
  rotateX(angle) {
    this.transform(Matrix.rotateX(angle));

    return this;
  }

  /**
   * Rotate 3d matrix around Y axis
   * @param {number} angle in degrees
   */
  rotateY(angle) {
    this.transform(Matrix.rotateY(angle));

    return this;
  }

  rotateZ(angle) {
    // this.transform(Matrix.rotateZ(angle));
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const { x, y } = this;
    this.x = cos * x - sin * y;
    this.y = sin * x + cos * y;

    return this;
  }

  translateX(distance) {
    this.x += distance;
    return this;
  }

  translateY(distance) {
    this.y += distance;
    return this;
  }

  translateZ(distance) {
    this.z += distance;
    return this;
  }

  /**
   * Transform vector by matrix
   * @param {Matrix} m a 4x4 transform matrix
   * @returns {Vector}
   */
  transform(m) {
    const { x, y, z, w } = this;

    const newX =
      x * m.matrix[0][0] +
      y * m.matrix[0][1] +
      z * m.matrix[0][2] +
      w * m.matrix[0][3];

    const newY =
      x * m.matrix[1][0] +
      y * m.matrix[1][1] +
      z * m.matrix[1][2] +
      w * m.matrix[1][3];

    const newZ =
      x * m.matrix[2][0] +
      y * m.matrix[2][1] +
      z * m.matrix[2][2] +
      w * m.matrix[2][3];

    const newW =
      x * m.matrix[3][0] +
      y * m.matrix[3][1] +
      z * m.matrix[3][2] +
      w * m.matrix[3][3];

    this.x = newX;
    this.y = newY;
    this.z = newZ;
    this.w = newW;

    return this;
  }

  /**
   * Cross product of this Vector and v Vector
   * @param {Vector} v another vector
   * @returns {Vector}
   */
  cross(v) {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  }

  /**
   * Dot product of this Vector and v Vector
   * @param {Vector} v antoher Vector
   * @returns {Vector}
   */
  dot(v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  /**
   * Subtracting this Vector and v Vector
   * @param {Vector} v antoher Vector
   * @returns {Vector}
   */
  subtract(v) {
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
  add(v) {
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
  multiply(k) {
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
  divide(k) {
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
   * Return signed shortest distance from point to plane, plane normal must be normalised
   * @param {Vector} plane_p a Point in a Plane
   * @param {Vector} plane_n a Normal in a Plane
   * @returns {number}
   */
  distance(plane_p, plane_n) {
    return this.dot(plane_n) - plane_n.dot(plane_p);
  }

  /**
   * Linear interpolation between two vector with given t value
   * @param {Vector} start
   * @param {Vector} end
   * @param {number} t
   */
  lerp(start, end, t) {
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
   * Convert Vector to Matrix
   * @return {Matrix}
   */
  toMatrix() {
    const m = [];
    m.push([this.x]);
    m.push([this.y]);

    if (typeof this.z === "number") m.push([this.z]);

    if (typeof this.w === "number") m.push([this.w]);

    return new Matrix(m);
  }

  /**
   * Convert matrix to vector
   * @param {Matrix} m
   * @returns {Vector}
   */
  static fromMatrix(m) {
    return new Vector(...m.matrix.flat());
  }

  /**
   * Convert a polar vector to cartesian vector
   * @param {number} r - length of the vector
   * @param {number} theta - angle in radian
   *
   * @returns {Vector}
   */
  static fromPolar(r, theta) {
    return new Vector(r * Math.cos(theta), r * Math.sin(theta));
  }

  /**
   * Convert a cartesian vector to polar vector
   * @param {Vector} v - vector to calculate the polar coordinate
   *
   * @returns {{ r: number, theta: number }}
   */
  static toPolar(v) {
    const r = Math.sqrt(v.x ** 2 + v.y ** 2);
    const theta = Math.atan2(v.y, v.x);
    return { r, theta };
  }

  /**
   * Get angle between two vector (start, end)
   * @param {Vector} start
   * @param {Vector} end
   * @returns {number} Angle in radians
   */
  static angle(start, end) {
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
  static intersectPlane(plane_p, plane_n, lineStart, lineEnd) {
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
  static add(a, b) {
    return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  /**
   * Subtract two vectors (a - b) and return the result vector
   * @param {Vector} a
   * @param {Vector} b
   * @returns {Vector}
   */
  static subtract(a, b) {
    return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
  }

  /**
   * Multiply v Vector by k
   * @param {Vector} v - a vector to multiply
   * @param {number} k - scaling factor
   * @returns {Vector}
   */
  static multiply(v, k) {
    return new Vector(v.x * k, v.y * k, v.z * k);
  }

  /**
   * Divide v Vector by k
   * @param {Vector} v - a vector to divide
   * @param {number} k - scaling factor
   * @returns {Vector}
   */
  static divide(v, k) {
    return new Vector(v.x / k, v.y / k, v.z / k);
  }

  static normalize(v) {
    const length = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);

    return Vector.divide(v, length);
  }

  /**
   * Linear interpolation between two vector with given t value
   * @param {Vector} start
   * @param {Vector} end
   * @param {number} t
   */
  static lerp(start, end, t) {
    return Vector.add(Vector.multiply(Vector.subtract(end, start), t), start);
  }

  static distance(v1, v2) {
    const v = Vector.subtract(v2, v1);

    return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
  }

  /**
   * Transform vector by matrix
   * @param {Vector} v a Vector to transform
   * @param {Matrix} m a 4x4 transform matrix
   * @returns {Vector}
   */
  static transform(v, m) {
    const { x, y, z, w } = v;

    const newX =
      x * m.matrix[0][0] +
      y * m.matrix[0][1] +
      z * m.matrix[0][2] +
      w * m.matrix[0][3];

    const newY =
      x * m.matrix[1][0] +
      y * m.matrix[1][1] +
      z * m.matrix[1][2] +
      w * m.matrix[1][3];

    const newZ =
      x * m.matrix[2][0] +
      y * m.matrix[2][1] +
      z * m.matrix[2][2] +
      w * m.matrix[2][3];

    const newW =
      x * m.matrix[3][0] +
      y * m.matrix[3][1] +
      z * m.matrix[3][2] +
      w * m.matrix[3][3];

    v.x = newX;
    v.y = newY;
    v.z = newZ;
    v.w = newW;

    return v;
  }
}
