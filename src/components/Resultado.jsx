import { esc } from "../utils/domHelpers";
import { computeEmpresaScore } from "../utils/scoring";

export function renderResult(STATE) {
  const empresas = [STATE.meta.empresaA, STATE.meta.empresaB];
  const colors = [
    "linear-gradient(135deg, #455F51, #324339)",
    "linear-gradient(135deg, #0989B1, #065E77)",
  ];
  const scores = empresas.map((e) =>
    Object.assign({ empresa: e }, computeEmpresaScore(STATE, e)),
  );
  return `<div class="panel">
    <h2>Resultado Final</h2>
    <div class="desc">Cálculo automático a partir das médias lançadas em cada aba, ajustado pelos pontos de corrupção/sabotagem. Use como referência — a decisão final da nota é sempre sua.</div>
    <div class="grid2">
      ${scores
        .map(
          (s, i) => `
      <div class="dash-card" style="background:${colors[i]}">
        <h3>${esc(s.empresa)}</h3>
        <div class="big">${s.final !== null ? s.final.toFixed(2) : "—"}</div>
        <div class="breakdown">
          ${s.parts.map((p) => `<div><span>${esc(p.key)}</span><span>${p.val !== null ? p.val.toFixed(2) : "—"}</span></div>`).join("")}
          <div style="margin-top:0.4rem;border-top:1px solid rgba(255,255,255,.3);padding-top:0.4rem">
            <span>Ajuste (corrupção/sabotagem)</span><span>${s.ajuste >= 0 ? "+" : ""}${s.ajuste.toFixed(1)}</span>
          </div>
        </div>
      </div>`,
        )
        .join("")}
    </div>
    <div class="note note-orange" style="margin-top:1.1rem">A nota final é uma média ponderada das notas médias por papel (pesos configuráveis em "Configuração"), somada aos pontos fixos de corrupção/sabotagem. Ela não substitui seu julgamento.</div>
  </div>`;
}
