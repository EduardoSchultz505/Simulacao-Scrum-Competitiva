export function applyFontScale(STATE) {
  document.documentElement.style.fontSize = STATE.meta.fontScale + "px";
}
export function changeFontScale(delta, STATE) {
  STATE.meta.fontScale = Math.max(12, Math.min(24, STATE.meta.fontScale + delta));
  applyFontScale(STATE);
  document.getElementById("fontLbl").textContent = STATE.meta.fontScale + "px";
}