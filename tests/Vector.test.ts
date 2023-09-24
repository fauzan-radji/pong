import Vector from "../src/Vector";

describe("Vector", () => {
  let vector: Vector;

  beforeEach(() => {
    vector = new Vector(1, 2, 3);
  });

  it("should create a vector with given coordinates", () => {
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
    expect(vector.z).toBe(3);
    expect(vector.w).toBe(0);
  });

  it("should copy the vector", () => {
    const copy = vector.copy();
    expect(copy).toEqual(vector);
    expect(copy).not.toBe(vector);
  });

  it("should rotate the vector around the z-axis", () => {
    vector.rotateZ(Math.PI / 2);
    expect(vector.x).toBeCloseTo(-2);
    expect(vector.y).toBeCloseTo(1);
    expect(vector.z).toBe(3);
  });

  it("should translate the vector along the x-axis", () => {
    vector.translateX(2);
    expect(vector.x).toBe(3);
    expect(vector.y).toBe(2);
    expect(vector.z).toBe(3);
  });

  it("should translate the vector along the y-axis", () => {
    vector.translateY(-1);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(1);
    expect(vector.z).toBe(3);
  });

  it("should translate the vector along the z-axis", () => {
    vector.translateZ(5);
    expect(vector.x).toBe(1);
    expect(vector.y).toBe(2);
    expect(vector.z).toBe(8);
  });

  it("should calculate the dot product of two vectors", () => {
    const v = new Vector(2, 3, 4);
    const dotProduct = vector.dot(v);
    expect(dotProduct).toBe(20);
  });

  it("should subtract another vector from the current vector", () => {
    const v = new Vector(2, 3, 4);
    vector.subtract(v);
    expect(vector.x).toBe(-1);
    expect(vector.y).toBe(-1);
    expect(vector.z).toBe(-1);
  });

  it("should add another vector to the current vector", () => {
    const v = new Vector(2, 3, 4);
    vector.add(v);
    expect(vector.x).toBe(3);
    expect(vector.y).toBe(5);
    expect(vector.z).toBe(7);
  });

  it("should multiply the vector by a scalar", () => {
    const k = 2;
    vector.multiply(k);
    expect(vector.x).toBe(2);
    expect(vector.y).toBe(4);
    expect(vector.z).toBe(6);
  });

  it("should divide the vector by a scalar", () => {
    const k = 2;
    vector.divide(k);
    expect(vector.x).toBe(0.5);
    expect(vector.y).toBe(1);
    expect(vector.z).toBe(1.5);
  });

  it("should normalize the vector", () => {
    vector.normalize();
    expect(vector.x).toBeCloseTo(0.26726);
    expect(vector.y).toBeCloseTo(0.53452);
    expect(vector.z).toBeCloseTo(0.80178);
  });

  it("should convert a polar vector to cartesian vector", () => {
    const r = 2;
    const theta = Math.PI / 4;
    const cartesian = Vector.fromPolar(r, theta);
    expect(cartesian.x).toBeCloseTo(1.41421);
    expect(cartesian.y).toBeCloseTo(1.41421);
    expect(cartesian.z).toBe(0);
  });

  it("should convert a cartesian vector to polar vector", () => {
    const v = new Vector(1, 1);
    const polar = Vector.toPolar(v);
    expect(polar.r).toBeCloseTo(1.41421);
    expect(polar.theta).toBeCloseTo(Math.PI / 4);
  });

  it("should calculate the angle formed by two vectors", () => {
    const start = new Vector(1, 0);
    const end = new Vector(0, 1);
    const angle = Vector.angle(start, end);
    expect(angle).toBeCloseTo(Math.PI * 0.75);
  });

  it("should calculate the intersection point between a line and a plane", () => {
    const plane_p = new Vector(0, 0, 0);
    const plane_n = new Vector(0, 0, 1);
    const lineStart = new Vector(0, 0, -1);
    const lineEnd = new Vector(0, 0, 1);
    const intersection = Vector.intersectPlane(
      plane_p,
      plane_n,
      lineStart,
      lineEnd
    );
    expect(intersection.x).toBe(0);
    expect(intersection.y).toBe(0);
    expect(intersection.z).toBe(0);
  });

  it("should add two vectors and return the result vector", () => {
    const a = new Vector(1, 2, 3);
    const b = new Vector(4, 5, 6);
    const result = Vector.add(a, b);
    expect(result.x).toBe(5);
    expect(result.y).toBe(7);
    expect(result.z).toBe(9);
  });

  it("should subtract two vectors and return the result vector", () => {
    const a = new Vector(4, 5, 6);
    const b = new Vector(1, 2, 3);
    const result = Vector.subtract(a, b);
    expect(result.x).toBe(3);
    expect(result.y).toBe(3);
    expect(result.z).toBe(3);
  });

  it("should multiply a vector by a scalar and return the result vector", () => {
    const v = new Vector(1, 2, 3);
    const k = 2;
    const result = Vector.multiply(v, k);
    expect(result.x).toBe(2);
    expect(result.y).toBe(4);
    expect(result.z).toBe(6);
  });

  it("should divide a vector by a scalar and return the result vector", () => {
    const v = new Vector(2, 4, 6);
    const k = 2;
    const result = Vector.divide(v, k);
    expect(result.x).toBe(1);
    expect(result.y).toBe(2);
    expect(result.z).toBe(3);
  });

  it("should normalize a vector and return the result vector", () => {
    const v = new Vector(3, 4, 5);
    const result = Vector.normalize(v);
    expect(result.x).toBeCloseTo(0.42426);
    expect(result.y).toBeCloseTo(0.56569);
    expect(result.z).toBeCloseTo(0.70711);
  });

  it("should perform linear interpolation between two vectors", () => {
    const start = new Vector(1, 2, 3);
    const end = new Vector(4, 5, 6);
    const t = 0.5;
    const result = Vector.lerp(start, end, t);
    expect(result.x).toBe(2.5);
    expect(result.y).toBe(3.5);
    expect(result.z).toBe(4.5);
  });

  it("should calculate the distance between two vectors", () => {
    const v1 = new Vector(1, 2, 3);
    const v2 = new Vector(4, 5, 6);
    const distance = Vector.distance(v1, v2);
    expect(distance).toBeCloseTo(5.19615);
  });
});
