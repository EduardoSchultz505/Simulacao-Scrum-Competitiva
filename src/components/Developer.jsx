import {
  esc,
  sprintCellLabel,
  scoreSelectHtml,
  snSelectHtml,
  obsInputHtml,
} from "../utils/domHelpers";

export function renderDev(STATE) {
  const rows = STATE.dev;
  return `<div class="panel">
    <h2>Developers</h2>
    <div class="desc">Avaliação por time — com muitos alunos em produção, a qualidade do produto é o principal indicador de entendimento do processo pelo grupo.</div>
    <table><thead><tr>
      <th>Sprint</th><th>Empresa</th><th>Time</th><th>Qualidade do<br>produto (1-5)</th>
      <th>Seguiu o<br>processo?</th><th>Colaboração<br>do time (1-5)</th>
      <th>Nota Time (1-5)</th><th>Destaque individual (opcional)</th></tr></thead><tbody>
      ${rows
        .map(
          (r, i) => `<tr>
        <td class="sprint-label">${esc(sprintCellLabel(rows, i, "sprint"))}</td>
        <td>${esc(r.empresa)}</td><td>${esc(r.time)}</td>
        <td>${scoreSelectHtml(r.qualidade, `dev.${i}.qualidade`)}</td>
        <td>${snSelectHtml(r.processo, `dev.${i}.processo`)}</td>
        <td>${scoreSelectHtml(r.colaboracao, `dev.${i}.colaboracao`)}</td>
        <td>${scoreSelectHtml(r.notaTime, `dev.${i}.notaTime`)}</td>
        <td>${obsInputHtml(r.destaque, `dev.${i}.destaque`, "nome (se houver)")}</td>
      </tr>`,
        )
        .join("")}
    </tbody></table>
    <div class="note note-green">Reserve a coluna de destaque individual apenas para casos que realmente chamem atenção, positiva ou negativamente.</div>
  </div>`;
}
