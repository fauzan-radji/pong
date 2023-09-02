import Kanvas from "./Kanvas.js";
import Pong from "./Pong.js";

const pong = new Pong({
  canvas: new Kanvas({
    id: "canvas",
    width: innerWidth,
    height: innerHeight,
  }),
  ballSize: 10,
  playerCount: 2,
});

pong.debug = true;
pong.draw();

window.addEventListener("click", () => {
  if (pong.isPlaying) pong.pause();
  else pong.play();
});

window.addEventListener("resize", () => {
  pong.resize(innerWidth, innerHeight);
  pong.draw();
});
