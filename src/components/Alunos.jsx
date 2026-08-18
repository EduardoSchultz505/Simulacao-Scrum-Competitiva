import { PAPEIS, TIMES } from "../data/constants.js";
import { esc } from "../utils/domHelpers.js";

export default function renderAlunos(STATE) {
  const empresas = [
    { nome: STATE.meta.empresaA, key: "A" },
    { nome: STATE.meta.empresaB, key: "B" },
  ];
  const counts = {};
  empresas.forEach((e) => {
    counts[e.nome] = {
      "Scrum Master": 0,
      "Owner/Stakeholder": 0,
      "Product Owner-Caça": 0,
      "Product Owner-Transporte": 0,
      "Developer-Caça": 0,
      "Developer-Transporte": 0,
    };
  });
  const buyerCounts = {
    "Comprador - Governo": 0,
    "Comprador - Militar": 0,
    "Comprador - Setor Privado": 0,
  };
  STATE.alunos.forEach((a) => {
    if (
      a.papel === "Comprador - Governo" ||
      a.papel === "Comprador - Militar" ||
      a.papel === "Comprador - Setor Privado"
    ) {
      buyerCounts[a.papel]++;
    } else if (a.papel === "Scrum Master" || a.papel === "Owner/Stakeholder") {
      if (counts[a.empresa]) counts[a.empresa][a.papel]++;
    } else if (a.papel === "Product Owner" || a.papel === "Developer") {
      if (counts[a.empresa] && a.time)
        counts[a.empresa][a.papel + "-" + a.time]++;
    }
  });
  const naoAtribuidos = STATE.alunos.filter((a) => !a.papel).length;

  function renderAlunoRow(a, i, STATE, esc, PAPEIS, TIMES) {
    const nomesEmpresas = [STATE.meta.empresaA, STATE.meta.empresaB];
    const needsEmpresa =
      a.papel === "Scrum Master" ||
      a.papel === "Owner/Stakeholder" ||
      a.papel === "Product Owner" ||
      a.papel === "Developer";
    const needsTime = a.papel === "Product Owner" || a.papel === "Developer";
    return `<tr data-aluno-row="${i}">
      <td>${a.id}</td>
      <td style="text-align:left">${esc(a.nome)}</td>
      <td><select data-path="alunos.${i}.papel" data-kind="papel-rerender">
          ${PAPEIS.map((p) => `<option value="${esc(p)}" ${a.papel === p ? "selected" : ""}>${p === "" ? "— não atribuído —" : esc(p)}</option>`).join("")}
        </select></td>
      <td>${
        needsEmpresa
          ? `<select data-path="alunos.${i}.empresa" data-kind="text-rerender">
          <option value="">—</option>${nomesEmpresas.map((nome) => `<option value="${esc(nome)}" ${a.empresa === nome ? "selected" : ""}>${esc(nome)}</option>`).join("")}
        </select>`
          : ""
      }</td>
      <td>${
        needsTime
          ? `<select data-path="alunos.${i}.time" data-kind="text-rerender">
          <option value="">—</option>${TIMES.map((t) => `<option value="${t}" ${a.time === t ? "selected" : ""}>${t}</option>`).join("")}
        </select>`
          : ""
      }</td>
    </tr>`;
  }

  return `<div class="panel">
    <h2>Alunos</h2>
    <div class="desc">Atribua cada aluno a um papel e equipe. A turma não escolhe o lado — a atribuição é feita aqui pelo professor.</div>
    <div class="roster-search"><input type="text" id="alunoSearch" placeholder="Buscar aluno por nome..." /></div>
    <table class="roster-table"><thead><tr>
      <th style="width:2.5rem">#</th><th style="width:16rem">Nome</th><th>Papel</th><th>Empresa</th><th>Time</th></tr></thead>
      <tbody id="alunosBody">
      ${STATE.alunos.map((a, i) => renderAlunoRow(a, i, STATE, esc, PAPEIS, TIMES)).join("")}
      </tbody></table>
    <div class="note ${naoAtribuidos > 0 ? "note-orange" : "note-green"}" style="margin-top:1rem">
      ${naoAtribuidos} de ${STATE.alunos.length} alunos ainda sem papel atribuído.
    </div>

    <h2 style="margin-top:1.6rem">Resumo de Vagas Preenchidas</h2>
    <div class="grid2">
      ${empresas
        .map(
          (e) => `
        <div class="mini-card">
          <h3>${esc(e.nome)}</h3>
          <div class="mini-row"><label>Scrum Master</label><span class="pts">${counts[e.nome]["Scrum Master"]} / 1</span></div>
          <div class="mini-row"><label>Owner/Stakeholder</label><span class="pts">${counts[e.nome]["Owner/Stakeholder"]} / 1</span></div>
          <div class="mini-row"><label>PO — ${esc(STATE.teamNames[e.key].Caça)}</label><span class="pts">${counts[e.nome]["Product Owner-Caça"]} / 1</span></div>
          <div class="mini-row"><label>PO — ${esc(STATE.teamNames[e.key].Transporte)}</label><span class="pts">${counts[e.nome]["Product Owner-Transporte"]} / 1</span></div>
          <div class="mini-row"><label>Devs — ${esc(STATE.teamNames[e.key].Caça)}</label><span class="pts">${counts[e.nome]["Developer-Caça"]} / 4</span></div>
          <div class="mini-row"><label>Devs — ${esc(STATE.teamNames[e.key].Transporte)}</label><span class="pts">${counts[e.nome]["Developer-Transporte"]} / 5</span></div>
        </div>`,
        )
        .join("")}
    </div>
    <div class="mini-card" style="margin-top:1rem">
      <h3>Compradores</h3>
      <div class="mini-row"><label>Governo</label><span class="pts">${buyerCounts["Comprador - Governo"]} / 1</span></div>
      <div class="mini-row"><label>Militar</label><span class="pts">${buyerCounts["Comprador - Militar"]} / 1</span></div>
      <div class="mini-row"><label>Setor Privado</label><span class="pts">${buyerCounts["Comprador - Setor Privado"]} / 1</span></div>
    </div>

    <h2 style="margin-top:1.6rem">Importar Lista de Alunos</h2>
    <div class="desc">Substitui a lista atual por uma nova, a partir de um arquivo Excel (.xlsx). Use apenas se for reaproveitar este painel para outra turma.</div>
    <input type="file" id="importAlunosFile" accept=".xlsx,.xls" />
  </div>`;
}
