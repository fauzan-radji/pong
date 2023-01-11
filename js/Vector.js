export default class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static random() {
    const x = Math.random();
    const y = Math.random();
    return new Vector(x, y);
  }
}
