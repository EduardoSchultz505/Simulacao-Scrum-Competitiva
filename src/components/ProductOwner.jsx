import {
  esc,
  sprintCellLabel,
  snSelectHtml,
  scoreSelectHtml,
  obsInputHtml,
} from "../utils/domHelpers";

export function renderPO(STATE) {
  const rows = STATE.po;
  return `<div class="panel">
    <h2>Product Owner</h2>
    <div class="desc">Um Product Owner por time (2 times por empresa).</div>
    <table><thead><tr>
      <th>Sprint</th><th>Empresa</th><th>Time</th><th>Requisitos<br>claros ao time?</th>
      <th>Acompanhou os<br>testes de perto?</th><th>Reunião de<br>priorização ocorreu?</th>
      <th>Nota (1-5)</th><th>Observações</th></tr></thead><tbody>
      ${rows
        .map(
          (r, i) => `<tr>
        <td class="sprint-label">${esc(sprintCellLabel(rows, i, "sprint"))}</td>
        <td>${esc(r.empresa)}</td><td>${esc(r.time)}</td>
        <td>${snSelectHtml(r.requisitos, `po.${i}.requisitos`)}</td>
        <td>${snSelectHtml(r.testes, `po.${i}.testes`)}</td>
        <td>${snSelectHtml(r.reuniao, `po.${i}.reuniao`)}</td>
        <td>${scoreSelectHtml(r.nota, `po.${i}.nota`)}</td>
        <td>${obsInputHtml(r.obs, `po.${i}.obs`)}</td>
      </tr>`,
        )
        .join("")}
    </tbody></table>
    <div class="note note-teal">Critério-guia: o PO é avaliado pela clareza dos requisitos e pelo acompanhamento ativo da produção — não pela qualidade técnica do avião em si.</div>
  </div>`;
}
