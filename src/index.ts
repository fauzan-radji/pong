import Kanvas from "./Kanvas";
import Pong from "./Pong";

const pong = new Pong({
  canvas: new Kanvas({
    id: "canvas",
    width: innerWidth,
    height: innerHeight,
  }),
  ballSize: 10,
  playerCount: 2,
});

pong.debug = false;
pong.draw();

window.addEventListener("click", () => {
  if (pong.isPlaying) pong.pause();
  else pong.play();
});

window.addEventListener("resize", () => {
  pong.resize(innerWidth, innerHeight);
  pong.draw();
});
