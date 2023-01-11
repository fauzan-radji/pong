import Kanvas from "./Kanvas.js";
import Pong from "./Pong.js";

const pong = new Pong({
  canvas: new Kanvas({
    id: "canvas",
    width: 800,
    height: 800 * 0.66,
  }),
  paddleSize: 100,
  puckSize: 10,
});

pong.draw();
