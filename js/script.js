import Kanvas from "./Kanvas.js";
import Pong from "./Pong.js";

const pong = new Pong({
  canvas: new Kanvas({
    id: "canvas",
    width: 600 * 0.66,
    height: 600,
  }),
  paddleSize: 100,
  puckSize: 10,
});

pong.draw();

window.addEventListener("click", () => {
  pong.play();
});
