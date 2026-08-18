import {
  esc,
  sprintCellLabel,
  snSelectHtml,
  scoreSelectHtml,
  obsInputHtml,
} from "../utils/domHelpers";

export default function renderSM(STATE) {
  const rows = STATE.sm;
  return `<div class="panel">
    <h2>Scrum Master</h2>
    <div class="desc">Avaliação de processo — um Scrum Master por empresa, atendendo os dois times.</div>
    <table><thead><tr>
      <th>Sprint</th><th>Empresa</th><th>Conduziu os eventos<br>corretamente?</th>
      <th>Removeu<br>impedimentos?</th><th>Ajudou o time a<br>melhorar entre Sprints?</th>
      <th>Nota (1-5)</th><th>Observações</th></tr></thead><tbody>
      ${rows
        .map(
          (r, i) => `<tr>
        <td class="sprint-label">${esc(sprintCellLabel(rows, i, "sprint"))}</td>
        <td>${esc(r.empresa)}</td>
        <td>${snSelectHtml(r.conduziu, `sm.${i}.conduziu`)}</td>
        <td>${snSelectHtml(r.removeu, `sm.${i}.removeu`)}</td>
        <td>${snSelectHtml(r.ajudou, `sm.${i}.ajudou`)}</td>
        <td>${scoreSelectHtml(r.nota, `sm.${i}.nota`)}</td>
        <td>${obsInputHtml(r.obs, `sm.${i}.obs`)}</td>
      </tr>`,
        )
        .join("")}
    </tbody></table>
    <div class="note note-dark">Critério-guia: o SM não é avaliado por produzir, mas por garantir que o Scrum aconteça de verdade e por ajudar o time a evoluir de uma Sprint para a outra.</div>
  </div>`;
}
