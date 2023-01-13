export default class Controller {
  #pressed;
  #handler;

  constructor(handler) {
    this.#pressed = [];
    this.#handler = handler;

    window.addEventListener("keydown", (e) => {
      // e.preventDefault();
      const keyCode = e.code;
      if (!this.pressed.includes(keyCode)) this.pressed.push(keyCode);
    });

    window.addEventListener("keyup", (e) => {
      // e.preventDefault();
      const keyCode = e.code;
      if (this.pressed.includes(keyCode)) {
        // remove keyCode from this.pressed
        const index = this.pressed.indexOf(keyCode);
        if (index !== -1) this.pressed.splice(index, 1);
      }
    });
  }

  control() {
    for (const keyCode in this.handler) {
      if (this.pressed.includes(keyCode)) this.handler[keyCode](this.userData);
    }
  }

  pressedKey(keyCode) {
    return this.pressed.includes(keyCode);
  }

  get pressed() {
    return this.#pressed;
  }

  get handler() {
    return this.#handler;
  }
}
