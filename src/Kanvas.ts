import Vector from "./Vector.js";

/**
 * Kanvas
 * @param {string} id - Id of HTML Canvas Element
 * @param {number} width
 * @param {number} height
 */

export default class Kanvas {
  id: string;
  ctx: CanvasRenderingContext2D;
  center: Vector;
  top: number = 0;
  bottom: number = 0;
  left: number = 0;
  right: number = 0;
  #fillStyle!: string | CanvasGradient | CanvasPattern;
  #strokeStyle!: string | CanvasGradient | CanvasPattern;
  #lineWidth!: number;
  #lineDash!: Iterable<number>;
  #lineDashOffset!: number;
  #textAlign!: CanvasTextAlign;
  #textBaseline!: CanvasTextBaseline;
  #font!: string;
  #globalAlpha!: number;
  #element: HTMLCanvasElement;

  constructor({
    id,
    width,
    height,
  }: {
    id: string;
    width: number;
    height: number;
  }) {
    this.id = id;
    this.#element = document.getElementById(id) as HTMLCanvasElement;
    this.ctx = this.element.getContext("2d") as CanvasRenderingContext2D;
    this.fillStyle = "#fff";
    this.strokeStyle = "#fff";
    this.lineWidth = 1;
    this.lineDash = [];
    this.lineDashOffset = 0;

    this.center = new Vector(0, 0);
    this.resize(width, height);
  }

  /**
   * Resizes the canvas element.
   * @param {number} width
   * @param {number} height
   *
   * @return {Kanvas} this Kanvas object
   */
  resize(width: number, height: number): Kanvas {
    this.width = width;
    this.height = height;

    this.top = height * -0.5;
    this.bottom = height * 0.5;
    this.left = width * -0.5;
    this.right = width * 0.5;

    this.onResize();
    return this;
  }

  drawImage(
    image: CanvasImageSource,
    point: Vector | { x: number; y: number },
    width: number,
    height: number
  ) {
    this.ctx.drawImage(
      image,
      point.x + this.right,
      point.y + this.bottom,
      width,
      height
    );

    return this;
  }

  // angle in radian
  rotateAndDrawImage(
    image: CanvasImageSource,
    point: Vector,
    width: number,
    height: number,
    angle: number
  ) {
    this.save()
      .translate(point)
      .rotate(-angle)
      .drawImage(
        image,
        {
          x: -width / 2,
          y: -height / 2,
        },
        width,
        height
      )
      .restore();

    return this;
  }

  circle(point: Vector, radius: number) {
    this.beginPath();
    this.ctx.arc(
      point.x + this.right,
      point.y + this.bottom,
      radius,
      0,
      2 * Math.PI
    );
    this.closePath();

    return this;
  }

  rect(point: Vector, width: number, height: number) {
    this.ctx.rect(
      point.x + this.right - width * 0.5,
      point.y + this.bottom - height * 0.5,
      width,
      height
    );
    this.closePath();

    return this;
  }

  polygon(point: Vector, sidesCount: number, radius: number) {
    const angle = (Math.PI * 2) / sidesCount;
    this.beginPath().moveTo(Vector.fromPolar(radius, 0).add(point));
    for (let i = angle; i < Math.PI * 2; i += angle)
      this.lineTo(Vector.fromPolar(radius, i).add(point));
    this.closePath();

    return this;
  }

  line(point1: Vector, point2: Vector) {
    this.beginPath();
    this.ctx.moveTo(point1.x + this.right, point1.y + this.bottom);
    this.ctx.lineTo(point2.x + this.right, point2.y + this.bottom);
    this.closePath();

    return this;
  }

  moveTo(point: Vector) {
    this.ctx.moveTo(point.x + this.right, point.y + this.bottom);

    return this;
  }

  lineTo(point: Vector) {
    this.ctx.lineTo(point.x + this.right, point.y + this.bottom);

    return this;
  }

  text({
    text,
    at,
    fillStyle = this.#fillStyle,
    strokeStyle = this.#strokeStyle,
    size = 16,
  }: {
    text: string;
    at: Vector;
    fillStyle?: string | CanvasGradient | CanvasPattern;
    strokeStyle?: string | CanvasGradient | CanvasPattern;
    size?: number;
  }) {
    this.beginPath();
    this.textAlign = "center";
    this.textBaseline = "middle";
    this.fillStyle = fillStyle;
    this.strokeStyle = strokeStyle;
    this.font = `${size}px Arial`;
    this.ctx.fillText(text, at.x + this.right, at.y + this.bottom);
    this.ctx.strokeText(text, at.x + this.right, at.y + this.bottom);
  }

  beginPath() {
    this.ctx.beginPath();

    return this;
  }

  closePath() {
    this.ctx.closePath();

    return this;
  }

  stroke({
    color = this.#strokeStyle,
    width = this.#lineWidth,
    dash = this.#lineDash,
  } = {}) {
    this.strokeStyle = color;
    this.lineWidth = width;
    this.lineDash = dash;
    this.ctx.stroke();

    return this;
  }

  fill(color = "#fff") {
    this.fillStyle = color;
    this.ctx.fill();

    return this;
  }

  clear() {
    this.element.height = this.height;

    return this;
  }

  /**
   * Translate the canvas context to point
   * @param {Vector | {x,y}} point - a Vector instance or an Object that contains x and y properties
   *
   * @return {Kanvas} this Kanvas object
   */
  translate(point: Vector | { x: number; y: number }): Kanvas {
    this.ctx.translate(point.x + this.right, point.y + this.bottom);

    return this;
  }

  /**
   * Rotate the canvas context
   * @param {number} angle - angle in radian
   *
   * @return {Kanvas} this Kanvas object
   */
  rotate(angle: number): Kanvas {
    this.ctx.rotate(angle);

    return this;
  }

  save() {
    this.ctx.save();

    return this;
  }

  restore() {
    this.ctx.restore();

    return this;
  }

  set fillStyle(color) {
    this.#fillStyle = color;
    this.ctx.fillStyle = color;
  }

  set strokeStyle(color) {
    this.#strokeStyle = color;
    this.ctx.strokeStyle = color;
  }

  set lineWidth(width) {
    this.#lineWidth = width;
    this.ctx.lineWidth = width;
  }

  set lineDash(dash) {
    this.#lineDash = dash;
    this.ctx.setLineDash(dash);
  }

  set lineDashOffset(offset) {
    this.#lineDashOffset = offset;
    this.ctx.lineDashOffset = offset;
  }

  set width(width) {
    this.element.width = width;
  }

  set height(height) {
    this.element.height = height;
  }

  set textAlign(align) {
    this.#textAlign = align;
    this.ctx.textAlign = align;
  }

  set textBaseline(align) {
    this.#textBaseline = align;
    this.ctx.textBaseline = align;
  }

  set font(font) {
    this.#font = font;
    this.ctx.font = font;
  }

  set globalAlpha(alpha) {
    this.#globalAlpha = alpha;
    this.ctx.globalAlpha = alpha;
  }

  get element() {
    return this.#element;
  }

  get width() {
    return this.element.width;
  }

  get height() {
    return this.element.height;
  }

  get fillStyle() {
    return this.#fillStyle;
  }

  get strokeStyle() {
    return this.#strokeStyle;
  }

  get lineWidth() {
    return this.#lineWidth;
  }

  get lineDash() {
    return this.#lineDash;
  }

  get lineDashOffset() {
    return this.#lineDashOffset;
  }

  get textAlign() {
    return this.#textAlign;
  }

  get textBaseline() {
    return this.#textBaseline;
  }

  get font() {
    return this.#font;
  }

  get globalAlpha() {
    return this.#globalAlpha;
  }

  // event handler
  onResize() {}
}
