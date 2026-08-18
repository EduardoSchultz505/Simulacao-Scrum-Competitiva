import { saveToLocalStorage } from "../storage/persistence";

export function esc(s) { return (s == null ? "" : String(s)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

export function snSelectHtml(value, path) {
  return `<select data-path="${path}" data-kind="sn">
    <option value="" ${value === "" ? "selected" : ""}>—</option>
    <option value="S" ${value === "S" ? "selected" : ""}>Sim</option>
    <option value="N" ${value === "N" ? "selected" : ""}>Não</option>
  </select>`;
}
export function scoreSelectHtml(value, path) {
  let opts = `<option value="" ${value === "" ? "selected" : ""}>—</option>`;
  for (let n = 1; n <= 5; n++) opts += `<option value="${n}" ${String(value) === String(n) ? "selected" : ""}>${n}</option>`;
  return `<select data-path="${path}" data-kind="score">${opts}</select>`;
}
export function decisaoSelectHtml(value, path) {
  const opts = [["", "—"], ["A", "Aceitou"], ["I", "Ignorou"], ["D", "Denunciou"]];
  return `<select data-path="${path}" data-kind="decisao">` +
    opts.map(([v, l]) => `<option value="${v}" ${value === v ? "selected" : ""}>${l}</option>`).join("") + `</select>`;
}
export function obsInputHtml(value, path, placeholder) {
  return `<input class="obs-input" type="text" data-path="${path}" data-kind="text" value="${esc(value)}" placeholder="${esc(placeholder || "")}" />`;
}
export function sprintCellLabel(rows, i, key) {
  if (i === 0) return "Sprint " + rows[i].sprint;
  return rows[i][key] !== rows[i - 1][key] ? "Sprint " + rows[i].sprint : "";
}


export function setByPath(path, value, STATE) {
  const parts = path.split(".");
  let obj = STATE;
  for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
  obj[parts[parts.length - 1]] = value;
  saveToLocalStorage(STATE);
}