import TWEEN from "@tweenjs/tween.js";

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);
}
requestAnimationFrame(animate);
