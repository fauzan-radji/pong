import Vector from "./Vector.js";

/**
 * Kanvas
 * @param {string} id - Id of HTML Canvas Element
 * @param {number} width
 * @param {number} height
 */

export default class Kanvas {
  #fillStyle;
  #strokeStyle;
  #lineWidth;
  #lineDash;
  #lineDashOffset;
  #textAlign;
  #baseLine;
  #font;
  #globalAlpha;
  #element;

  constructor({ id, width, height }) {
    this.id = id;
    this.#element = document.getElementById(id);
    this.ctx = this.element.getContext("2d");
    this.fillStyle = "#fff";
    this.strokeStyle = "#fff";
    this.lineWidth = 1;
    this.lineDash = [];
    this.lineDashOffset = 0;

    this.resize(width, height);
  }

  /**
   * Resizes the canvas element.
   * @param {number} width
   * @param {number} height
   *
   * @return {Kanvas} this Kanvas object
   */
  resize(width, height) {
    this.width = width;
    this.height = height;

    this.top = height * -0.5;
    this.bottom = height * 0.5;
    this.left = width * -0.5;
    this.right = width * 0.5;

    this.onResize();
    return this;
  }

  drawImage(image, point, width, height) {
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
  rotateAndDrawImage(image, point, width, height, angle) {
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

  circle(point, radius) {
    this.ctx.arc(
      point.x + this.right,
      point.y + this.bottom,
      radius,
      0,
      2 * Math.PI
    );

    return this;
  }

  rect(point, width, height) {
    this.ctx.rect(
      point.x + this.right - width * 0.5,
      point.y + this.bottom - height * 0.5,
      width,
      height
    );

    return this;
  }

  line(point1, point2) {
    this.ctx.moveTo(point1.x + this.right, point1.y + this.bottom);
    this.ctx.lineTo(point2.x + this.right, point2.y + this.bottom);

    return this;
  }

  moveTo(point) {
    this.ctx.moveTo(point.x + this.right, point.y + this.bottom);

    return this;
  }

  lineTo(point) {
    this.ctx.lineTo(point.x + this.right, point.y + this.bottom);

    return this;
  }

  text({
    text,
    at,
    fillStyle = this.#fillStyle,
    strokeStyle = this.#strokeStyle,
    size = 16,
  }) {
    this.beginPath();
    this.textAlign = "center";
    this.baseLine = "center";
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
  translate(point) {
    this.ctx.translate(point.x + this.right, point.y);

    return this;
  }

  /**
   * Rotate the canvas context
   * @param {number} angle - angle in radian
   *
   * @return {Kanvas} this Kanvas object
   */
  rotate(angle) {
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

  set element(element) {}

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

  set baseLine(align) {
    this.#baseLine = align;
    this.ctx.baseLine = align;
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

  get baseLine() {
    return this.#baseLine;
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
