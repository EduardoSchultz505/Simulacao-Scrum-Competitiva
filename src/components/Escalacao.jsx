import {
  TEAM_IMAGES,
  TIMES,
  BUYERS,
  BUYER_IMAGES,
  ROLE_COLORS,
} from "../data/constants";
import { esc } from "../utils/domHelpers";

export default function renderEscalacao(STATE) {
  function papelBadgeColor(papel) {
    return ROLE_COLORS[papel] || "#6E6E6E";
  }
  const empresas = [
    { nome: STATE.meta.empresaA, key: "A" },
    { nome: STATE.meta.empresaB, key: "B" },
  ];

  function renderCompanyBlock(empresa) {
    const imgs = TEAM_IMAGES[empresa.key] || {};
    const sm = STATE.alunos.find(
      (a) => a.papel === "Scrum Master" && a.empresa === empresa.nome,
    );
    const owner = STATE.alunos.find(
      (a) => a.papel === "Owner/Stakeholder" && a.empresa === empresa.nome,
    );
    const teamRoster = (time) =>
      STATE.alunos.filter(
        (a) =>
          a.empresa === empresa.nome &&
          a.time === time &&
          (a.papel === "Product Owner" || a.papel === "Developer"),
      );
    return `<div class="company-block">
      <div class="company-header">
        <img src="${imgs.logo || ""}" alt="${esc(empresa.nome)}" />
        <div><h2>${esc(empresa.nome)}</h2>
          <div style="font-size:0.85rem;color:var(--muted)">
            Scrum Master: ${sm ? esc(sm.nome) : '<span class="tag-unassigned">não atribuído</span>'} ·
            Owner: ${owner ? esc(owner.nome) : '<span class="tag-unassigned">não atribuído</span>'}
          </div>
        </div>
      </div>
      <div class="teams-grid">
        ${TIMES.map(
          (t) => `
          <div class="team-card">
            <img class="team-img" src="${imgs[t] || ""}" alt="${esc(STATE.teamNames[empresa.key][t])}" />
            <div class="team-body">
              <h3>${esc(STATE.teamNames[empresa.key][t])}</h3>
              <ul class="role-list">
                ${
                  teamRoster(t).length === 0
                    ? '<li><span class="tag-unassigned">ninguém atribuído ainda</span></li>'
                    : teamRoster(t)
                        .sort((a) => (a.papel === "Product Owner" ? -1 : 1))
                        .map(
                          (a) => `
                  <li><span>${esc(a.nome)}</span><span class="role-badge" style="background:${papelBadgeColor(a.papel)}">${a.papel === "Product Owner" ? "PO" : "Dev"}</span></li>
                `,
                        )
                        .join("")
                }
              </ul>
            </div>
          </div>`,
        ).join("")}
      </div>
    </div>`;
  }

  return `<div class="panel">
    <h2>Escalação</h2>
    <div class="desc">Visão de equipe, com a identidade visual de cada empresa — útil para projetar em sala.</div>
    ${empresas.map((e) => renderCompanyBlock(e)).join("")}

    <h2 style="margin-top:0.4rem">Compradores</h2>
    <div class="buyers-strip">
      ${BUYERS.map((b) => {
        const aluno = STATE.alunos.find((a) => a.papel === "Comprador - " + b);
        return `<div class="buyer-card">
          <img src="${BUYER_IMAGES[b]}" alt="${esc(b)}" />
          <div class="buyer-body">
            <h3>${esc(b)}</h3>
            <div>${aluno ? esc(aluno.nome) : '<span class="tag-unassigned">não atribuído</span>'}</div>
          </div>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}
