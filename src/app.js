// =====================================================================
// CONSTANTS
// =====================================================================
const SPRINTS = [1, 2, 3];
const TIMES = ["Caça", "Transporte"];
const BUYERS = ["Governo", "Militar", "Setor Privado"];
const PAPEIS = ["", "Scrum Master", "Product Owner", "Owner/Stakeholder", "Developer",
  "Comprador - Governo", "Comprador - Militar", "Comprador - Setor Privado"];

const SEED_NAMES = ["ALAN FERREIRA DE OLIVEIRA", "ANDRÉ LUIZ VICENZI RIGO", "ARTHUR HENRIQUE LORENZETT", "BRUNO DE DAVID REIS", "CARLOS EDUARDO ALMEIDA DA CONCEICAO", "CARLOS JHONATAS DE SOUZA AMORIM", "CAUAN BRUNO ALTHAUS RIFFEL", "FILIPE GABRIEL HOLLMANN", "FILIPE JOSÉ DA COSTA NUNES", "GABRIEL CRISTIAN VIVIAN SOMARIVA", "GABRIEL DE CARVALHO BARRETO", "GIOVANI RICARDO POTT", "GUSTAVO SCHWITZKI PERETTI", "ISAEL SOARES DOS SANTOS", "JADSON BUTZK", "JÉSSICA FERNANDA RUBAS", "JOÃO VITOR RAIMUNDI", "KAUAN LUCAS TOLDO", "LEONARDO SCHIMIDT LOPES", "LORENZO PIVA MAY", "MARIA EDUARDA EMELAU JOBIM", "MATTEO DALLA COSTA THOMÉ", "NATAN ELIAS PATZLAFF", "NICOLAS LISBOA FIGUEIREDO MULLER", "NICOLE BONASSI BET", "RAFAEL WILLIAM HAUPT FLORES", "SAMIRA GREGORIO VIEIRA", "VICENTE DAGOSTIN PILONETTO", "VINICIUS TEBALDI BORSATTI", "WILLIAM KUNZLER", "YASMIN MARIA ZERBIELLI"];

const TEAM_IMAGES = {
  "Maverick Aviation": { logo: "images/maverick_caca.jpg", Caça: "images/maverick_caca.jpg", Transporte: "images/maverick_cargo.jpg" },
  "SkyForge Ind. Aeronáutica": { logo: "images/skyforge_caca.jpg", Caça: "images/skyforge_caca.jpg", Transporte: "images/skyforge_cargo.jpg" },
};
const BUYER_IMAGES = {
  "Governo": "images/governo_caca.jpg",
  "Militar": "images/militar.jpg",
  "Setor Privado": "images/empresa_privada.jpg",
};
const ROLE_COLORS = {
  "Scrum Master": "#455F51", "Product Owner": "#029676", "Owner/Stakeholder": "#0989B1",
  "Developer": "#549E39", "Comprador - Governo": "#E8871E", "Comprador - Militar": "#B33A3A",
  "Comprador - Setor Privado": "#E8871E",
};

// =====================================================================
// DATA MODEL
// =====================================================================
function buildInitialData(empresaA, empresaB) {
  const empresas = [empresaA, empresaB];
  const sm = [], owner = [];
  SPRINTS.forEach(sp => empresas.forEach(emp => {
    sm.push({ sprint: sp, empresa: emp, conduziu: "", removeu: "", ajudou: "", nota: "", obs: "" });
    owner.push({ sprint: sp, empresa: emp, comunicacao: "", negociacao: "", alinhamento: "", notaGeral: "", obs: "" });
  }));

  const po = [], dev = [];
  SPRINTS.forEach(sp => empresas.forEach(emp => TIMES.forEach(t => {
    po.push({ sprint: sp, empresa: emp, time: t, requisitos: "", testes: "", reuniao: "", nota: "", obs: "" });
    dev.push({ sprint: sp, empresa: emp, time: t, qualidade: "", processo: "", colaboracao: "", notaTime: "", destaque: "" });
  })));

  const buyerProf = [];
  SPRINTS.forEach(sp => BUYERS.forEach(b => {
    buyerProf.push({ sprint: sp, comprador: b, checklist: "", decisoes: "", feedback: "", nota: "", obs: "" });
  }));

  const buyerProduct = [];
  SPRINTS.forEach(sp => {
    empresas.forEach(emp => {
      buyerProduct.push({ sprint: sp, comprador: "Governo", empresa: emp, produto: "Caça", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      buyerProduct.push({ sprint: sp, comprador: "Governo", empresa: emp, produto: "Transporte", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      buyerProduct.push({ sprint: sp, comprador: "Militar", empresa: emp, produto: "Caça", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
      buyerProduct.push({ sprint: sp, comprador: "Setor Privado", empresa: emp, produto: "Transporte", pt: "", pv: "", prazo: "", comOwner: "", sinal: "", decisao: "", nota: "" });
    });
  });

  const corrupcao = { empresaCorruptora: empresaA, primeiraDescoberta: false, primeiroComprador: "", segundaDescoberta: false, segundoComprador: "" };
  const sabotagem = { empresaSabotador: empresaA, timeSabotador: "Caça", tipoAcao: "atrapalhar", denunciasConsecutivas: 0, descoberto: false, areaSoubeECalou: false };
  const weights = { sm: 1, owner: 1, po: 1, dev: 2, buyer: 2 };
  const teamNames = {
    [empresaA]: { Caça: "Esquadrão Falcon", Transporte: "Falcon Carggo" },
    [empresaB]: { Caça: "SkyForge Combat", Transporte: "SkyForge Transport" },
  };
  const alunos = SEED_NAMES.map((nome, i) => ({ id: i + 1, nome, empresa: "", time: "", papel: "" }));

  return {
    meta: { turma: "", data: "", empresaA, empresaB, fontScale: 16 },
    sm, owner, po, dev, buyerProf, buyerProduct, corrupcao, sabotagem, weights, teamNames, alunos,
  };
}

let STATE = buildInitialData("Maverick Aviation", "SkyForge Ind. Aeronáutica");
let TAB = "setup";
let FILE_NAME = "(nenhum arquivo carregado)";

function avg(arr) {
  const nums = arr.map(v => parseFloat(v)).filter(v => !isNaN(v));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

// =====================================================================
// SCORING (pure functions)
// =====================================================================
function computeCorrupcaoPontos(c) {
  let corruptor = 0;
  const compradores = {};
  if (c.primeiraDescoberta) {
    corruptor -= 1;
    if (c.primeiroComprador) compradores[c.primeiroComprador] = (compradores[c.primeiroComprador] || 0) - 1;
  }
  if (c.segundaDescoberta) {
    corruptor -= 1;
    if (c.segundoComprador) compradores[c.segundoComprador] = (compradores[c.segundoComprador] || 0) - 1;
  }
  return { corruptor, compradores };
}

function computeSabotagemPontos(s) {
  let sabotador = 0, area = 0, demitido = false;
  if (s.descoberto) {
    sabotador -= 1;
    area += s.areaSoubeECalou ? -1 : 1;
    if (s.tipoAcao === "vazar" && s.denunciasConsecutivas >= 1) demitido = true;
    if (s.tipoAcao === "atrapalhar" && s.denunciasConsecutivas >= 2) demitido = true;
  }
  return { sabotador, area, demitido };
}

function computeEmpresaScore(data, empresa) {
  const w = data.weights;
  const smAvg = avg(data.sm.filter(r => r.empresa === empresa).map(r => r.nota));
  const ownerAvg = avg(data.owner.filter(r => r.empresa === empresa).map(r => r.notaGeral));
  const poAvg = avg(data.po.filter(r => r.empresa === empresa).map(r => r.nota));
  const devAvg = avg(data.dev.filter(r => r.empresa === empresa).map(r => r.notaTime));
  const buyerAvg = avg(data.buyerProduct.filter(r => r.empresa === empresa).map(r => r.nota));
  const parts = [
    { key: "Scrum Master", val: smAvg, w: w.sm },
    { key: "Owner", val: ownerAvg, w: w.owner },
    { key: "Product Owner", val: poAvg, w: w.po },
    { key: "Developers", val: devAvg, w: w.dev },
    { key: "Avaliação dos Compradores", val: buyerAvg, w: w.buyer },
  ];
  let sumW = 0, sumV = 0;
  parts.forEach(p => { if (p.val !== null) { sumW += p.w; sumV += p.val * p.w; } });
  const base = sumW > 0 ? sumV / sumW : null;
  let ajuste = 0;
  const cPts = computeCorrupcaoPontos(data.corrupcao);
  const sPts = computeSabotagemPontos(data.sabotagem);
  if (data.corrupcao.empresaCorruptora === empresa) ajuste += cPts.corruptor;
  if (data.sabotagem.empresaSabotador === empresa) ajuste += sPts.sabotador + sPts.area;
  return { base, ajuste, final: base !== null ? base + ajuste : null, parts };
}

// =====================================================================
// DOM HELPERS
// =====================================================================
function esc(s) { return (s == null ? "" : String(s)).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }

function snSelectHtml(value, path) {
  return `<select data-path="${path}" data-kind="sn">
    <option value="" ${value === "" ? "selected" : ""}>—</option>
    <option value="S" ${value === "S" ? "selected" : ""}>Sim</option>
    <option value="N" ${value === "N" ? "selected" : ""}>Não</option>
  </select>`;
}
function scoreSelectHtml(value, path) {
  let opts = `<option value="" ${value === "" ? "selected" : ""}>—</option>`;
  for (let n = 1; n <= 5; n++) opts += `<option value="${n}" ${String(value) === String(n) ? "selected" : ""}>${n}</option>`;
  return `<select data-path="${path}" data-kind="score">${opts}</select>`;
}
function decisaoSelectHtml(value, path) {
  const opts = [["", "—"], ["A", "Aceitou"], ["I", "Ignorou"], ["D", "Denunciou"]];
  return `<select data-path="${path}" data-kind="decisao">` +
    opts.map(([v, l]) => `<option value="${v}" ${value === v ? "selected" : ""}>${l}</option>`).join("") + `</select>`;
}
function obsInputHtml(value, path, placeholder) {
  return `<input class="obs-input" type="text" data-path="${path}" data-kind="text" value="${esc(value)}" placeholder="${esc(placeholder || "")}" />`;
}
function sprintCellLabel(rows, i, key) {
  if (i === 0) return "Sprint " + rows[i].sprint;
  return rows[i][key] !== rows[i - 1][key] ? "Sprint " + rows[i].sprint : "";
}

// generic setter used by delegated change/input handler: path like "sm.3.nota"
function setByPath(path, value) {
  const parts = path.split(".");
  let obj = STATE;
  for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
  obj[parts[parts.length - 1]] = value;
}

// =====================================================================
// TAB RENDERERS
// =====================================================================
function renderSetup() {
  const m = STATE.meta;
  const weightLabels = { sm: "Scrum Master", owner: "Owner", po: "Product Owner", dev: "Developers", buyer: "Avaliação dos Compradores" };
  return `
  <div class="panel">
    <h2>Configuração</h2>
    <div class="desc">Identificação da turma e nomes das empresas/times. Alterar os nomes atualiza todas as abas automaticamente.</div>
    <div class="fields-row">
      <div class="field"><label>Turma</label><input type="text" data-path="meta.turma" data-kind="text" value="${esc(m.turma)}" /></div>
      <div class="field"><label>Data</label><input type="text" data-path="meta.data" data-kind="text" value="${esc(m.data)}" /></div>
    </div>
    <div class="fields-row">
      <div class="field"><label>Nome — Empresa A</label><input type="text" id="nomeA" data-kind="renameA" value="${esc(m.empresaA)}" /></div>
      <div class="field"><label>Time Caça — Empresa A</label><input type="text" data-path="teamNames.${esc(m.empresaA)}.Caça" data-kind="text" value="${esc(STATE.teamNames[m.empresaA].Caça)}" /></div>
      <div class="field"><label>Time Transporte — Empresa A</label><input type="text" data-path="teamNames.${esc(m.empresaA)}.Transporte" data-kind="text" value="${esc(STATE.teamNames[m.empresaA].Transporte)}" /></div>
    </div>
    <div class="fields-row">
      <div class="field"><label>Nome — Empresa B</label><input type="text" id="nomeB" data-kind="renameB" value="${esc(m.empresaB)}" /></div>
      <div class="field"><label>Time Caça — Empresa B</label><input type="text" data-path="teamNames.${esc(m.empresaB)}.Caça" data-kind="text" value="${esc(STATE.teamNames[m.empresaB].Caça)}" /></div>
      <div class="field"><label>Time Transporte — Empresa B</label><input type="text" data-path="teamNames.${esc(m.empresaB)}.Transporte" data-kind="text" value="${esc(STATE.teamNames[m.empresaB].Transporte)}" /></div>
    </div>
    <div class="note note-dark">Dica: os nomes de empresa já vêm pré-preenchidos a partir das imagens que você enviou (Maverick Aviation e SkyForge Ind. Aeronáutica). Pode alterar se quiser.</div>

    <h2 style="margin-top:1.6rem">Pesos da Nota Final</h2>
    <div class="desc">Ajuste o peso de cada papel no cálculo da nota final da empresa (aba "Resultado Final").</div>
    <div class="weights-panel">
      ${Object.keys(STATE.weights).map(k => `
        <div class="weight-field">
          <label>${weightLabels[k]}</label>
          <input type="number" min="0" step="0.5" data-path="weights.${k}" data-kind="number" value="${STATE.weights[k]}" />
        </div>`).join("")}
    </div>
  </div>`;
}

function renderSM() {
  const rows = STATE.sm;
  return `<div class="panel">
    <h2>Scrum Master</h2>
    <div class="desc">Avaliação de processo — um Scrum Master por empresa, atendendo os dois times.</div>
    <table><thead><tr>
      <th>Sprint</th><th>Empresa</th><th>Conduziu os eventos<br>corretamente?</th>
      <th>Removeu<br>impedimentos?</th><th>Ajudou o time a<br>melhorar entre Sprints?</th>
      <th>Nota (1-5)</th><th>Observações</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr>
        <td class="sprint-label">${esc(sprintCellLabel(rows, i, "sprint"))}</td>
        <td>${esc(r.empresa)}</td>
        <td>${snSelectHtml(r.conduziu, `sm.${i}.conduziu`)}</td>
        <td>${snSelectHtml(r.removeu, `sm.${i}.removeu`)}</td>
        <td>${snSelectHtml(r.ajudou, `sm.${i}.ajudou`)}</td>
        <td>${scoreSelectHtml(r.nota, `sm.${i}.nota`)}</td>
        <td>${obsInputHtml(r.obs, `sm.${i}.obs`)}</td>
      </tr>`).join("")}
    </tbody></table>
    <div class="note note-dark">Critério-guia: o SM não é avaliado por produzir, mas por garantir que o Scrum aconteça de verdade e por ajudar o time a evoluir de uma Sprint para a outra.</div>
  </div>`;
}

function renderOwner() {
  const rows = STATE.owner;
  return `<div class="panel">
    <h2>Stakeholder / Owner</h2>
    <div class="desc">Avaliação de comunicação e negociação — independente dos pontos de corrupção, registrados na aba "Corrupção &amp; Sabotagem".</div>
    <table><thead><tr>
      <th>Sprint</th><th>Empresa</th><th>Comunicação com<br>a equipe (1-5)</th>
      <th>Negociação com<br>compradores (1-5)</th><th>Alinhamento com<br>SM/PO sobre qualidade (1-5)</th>
      <th>Nota Geral (1-5)</th><th>Observações</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr>
        <td class="sprint-label">${esc(sprintCellLabel(rows, i, "sprint"))}</td>
        <td>${esc(r.empresa)}</td>
        <td>${scoreSelectHtml(r.comunicacao, `owner.${i}.comunicacao`)}</td>
        <td>${scoreSelectHtml(r.negociacao, `owner.${i}.negociacao`)}</td>
        <td>${scoreSelectHtml(r.alinhamento, `owner.${i}.alinhamento`)}</td>
        <td>${scoreSelectHtml(r.notaGeral, `owner.${i}.notaGeral`)}</td>
        <td>${obsInputHtml(r.obs, `owner.${i}.obs`)}</td>
      </tr>`).join("")}
    </tbody></table>
    <div class="note note-blue">Esta nota avalia o desempenho no papel — não confunda com os pontos ganhos/perdidos no mecanismo de corrupção, calculados automaticamente na aba própria.</div>
  </div>`;
}

function renderPO() {
  const rows = STATE.po;
  return `<div class="panel">
    <h2>Product Owner</h2>
    <div class="desc">Um Product Owner por time (2 times por empresa).</div>
    <table><thead><tr>
      <th>Sprint</th><th>Empresa</th><th>Time</th><th>Requisitos<br>claros ao time?</th>
      <th>Acompanhou os<br>testes de perto?</th><th>Reunião de<br>priorização ocorreu?</th>
      <th>Nota (1-5)</th><th>Observações</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr>
        <td class="sprint-label">${esc(sprintCellLabel(rows, i, "sprint"))}</td>
        <td>${esc(r.empresa)}</td><td>${esc(r.time)}</td>
        <td>${snSelectHtml(r.requisitos, `po.${i}.requisitos`)}</td>
        <td>${snSelectHtml(r.testes, `po.${i}.testes`)}</td>
        <td>${snSelectHtml(r.reuniao, `po.${i}.reuniao`)}</td>
        <td>${scoreSelectHtml(r.nota, `po.${i}.nota`)}</td>
        <td>${obsInputHtml(r.obs, `po.${i}.obs`)}</td>
      </tr>`).join("")}
    </tbody></table>
    <div class="note note-teal">Critério-guia: o PO é avaliado pela clareza dos requisitos e pelo acompanhamento ativo da produção — não pela qualidade técnica do avião em si.</div>
  </div>`;
}

function renderDev() {
  const rows = STATE.dev;
  return `<div class="panel">
    <h2>Developers</h2>
    <div class="desc">Avaliação por time — com muitos alunos em produção, a qualidade do produto é o principal indicador de entendimento do processo pelo grupo.</div>
    <table><thead><tr>
      <th>Sprint</th><th>Empresa</th><th>Time</th><th>Qualidade do<br>produto (1-5)</th>
      <th>Seguiu o<br>processo?</th><th>Colaboração<br>do time (1-5)</th>
      <th>Nota Time (1-5)</th><th>Destaque individual (opcional)</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr>
        <td class="sprint-label">${esc(sprintCellLabel(rows, i, "sprint"))}</td>
        <td>${esc(r.empresa)}</td><td>${esc(r.time)}</td>
        <td>${scoreSelectHtml(r.qualidade, `dev.${i}.qualidade`)}</td>
        <td>${snSelectHtml(r.processo, `dev.${i}.processo`)}</td>
        <td>${scoreSelectHtml(r.colaboracao, `dev.${i}.colaboracao`)}</td>
        <td>${scoreSelectHtml(r.notaTime, `dev.${i}.notaTime`)}</td>
        <td>${obsInputHtml(r.destaque, `dev.${i}.destaque`, "nome (se houver)")}</td>
      </tr>`).join("")}
    </tbody></table>
    <div class="note note-green">Reserve a coluna de destaque individual apenas para casos que realmente chamem atenção, positiva ou negativamente.</div>
  </div>`;
}

function renderBuyerProf() {
  const rows = STATE.buyerProf;
  return `<div class="panel">
    <h2>Compradores — Desempenho no Papel</h2>
    <div class="desc">Avaliação do professor sobre como cada comprador exerceu seu papel.</div>
    <table><thead><tr>
      <th>Sprint</th><th>Comprador</th><th>Aplicou o checklist<br>de verificação?</th>
      <th>Decisões coerentes<br>com o papel?</th><th>Feedback construtivo<br>nas Reviews?</th>
      <th>Nota (1-5)</th><th>Observações</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr>
        <td class="sprint-label">${esc(sprintCellLabel(rows, i, "sprint"))}</td>
        <td>${esc(r.comprador)}</td>
        <td>${snSelectHtml(r.checklist, `buyerProf.${i}.checklist`)}</td>
        <td>${snSelectHtml(r.decisoes, `buyerProf.${i}.decisoes`)}</td>
        <td>${snSelectHtml(r.feedback, `buyerProf.${i}.feedback`)}</td>
        <td>${scoreSelectHtml(r.nota, `buyerProf.${i}.nota`)}</td>
        <td>${obsInputHtml(r.obs, `buyerProf.${i}.obs`)}</td>
      </tr>`).join("")}
    </tbody></table>
    <div class="note note-orange">Critério-guia: avalie se o comprador aplicou o checklist a cada Sprint, se as decisões foram coerentes com o papel, e se o feedback nas Reviews foi útil.</div>
  </div>`;
}

function renderBuyerProduct() {
  const rows = STATE.buyerProduct;
  return `<div class="panel">
    <h2>Ficha do Comprador — Avaliação do Produto</h2>
    <div class="desc">Transcreva aqui os dados que cada comprador preencheu na ficha em papel, ao final de cada Sprint.</div>
    <table><thead><tr>
      <th>Sprint</th><th>Comprador</th><th>Empresa</th><th>Produto</th>
      <th>Padrão<br>Técnico</th><th>Padrão<br>Visual</th><th>Prazo</th>
      <th>Com.<br>Owner (1-5)</th><th>Sinal</th><th>Decisão</th><th>Nota (1-5)</th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr>
        <td class="sprint-label">${esc(sprintCellLabel(rows, i, "sprint"))}</td>
        <td>${esc(r.comprador)}</td><td>${esc(r.empresa)}</td><td>${esc(r.produto)}</td>
        <td>${snSelectHtml(r.pt, `buyerProduct.${i}.pt`)}</td>
        <td>${snSelectHtml(r.pv, `buyerProduct.${i}.pv`)}</td>
        <td>${snSelectHtml(r.prazo, `buyerProduct.${i}.prazo`)}</td>
        <td>${scoreSelectHtml(r.comOwner, `buyerProduct.${i}.comOwner`)}</td>
        <td>${snSelectHtml(r.sinal, `buyerProduct.${i}.sinal`)}</td>
        <td>${decisaoSelectHtml(r.decisao, `buyerProduct.${i}.decisao`)}</td>
        <td>${scoreSelectHtml(r.nota, `buyerProduct.${i}.nota`)}</td>
      </tr>`).join("")}
    </tbody></table>
    <div class="note note-orange">Militar só avalia Caça; Setor Privado só avalia Transporte; Governo avalia os dois. Linhas fora do papel do comprador podem ficar em branco.</div>
  </div>`;
}

function renderCorrupSab() {
  const c = STATE.corrupcao, s = STATE.sabotagem;
  const cPts = computeCorrupcaoPontos(c);
  const sPts = computeSabotagemPontos(s);
  const empresaOpts = (sel) => [STATE.meta.empresaA, STATE.meta.empresaB].map(e => `<option value="${esc(e)}" ${sel === e ? "selected" : ""}>${esc(e)}</option>`).join("");
  const compradorOpts = (sel) => BUYERS.filter(b => b !== "Militar").map(b => `<option value="${esc(b)}" ${sel === b ? "selected" : ""}>${esc(b)}</option>`).join("");
  return `<div class="panel">
    <h2>Corrupção &amp; Sabotagem</h2>
    <div class="desc">Estes dois mecanismos são baseados em regras fixas — os pontos abaixo são calculados automaticamente.</div>
    <div class="grid2">
      <div class="mini-card">
        <h3>🔒 Corruptor (Owner)</h3>
        <div class="mini-row"><label>Empresa do corruptor</label>
          <select data-path="corrupcao.empresaCorruptora" data-kind="text-rerender">${empresaOpts(c.empresaCorruptora)}</select></div>
        <div class="checkbox-row" style="margin-bottom:0.6rem">
          <input type="checkbox" id="cd1" data-path="corrupcao.primeiraDescoberta" data-kind="check-rerender" ${c.primeiraDescoberta ? "checked" : ""} />
          <label for="cd1">1ª descoberta ocorreu</label></div>
        ${c.primeiraDescoberta ? `<div class="mini-row"><label>Comprador que aceitou (1ª vez)</label>
          <select data-path="corrupcao.primeiroComprador" data-kind="text-rerender"><option value="">—</option>${compradorOpts(c.primeiroComprador)}</select></div>` : ""}
        <div class="checkbox-row" style="margin-bottom:0.6rem">
          <input type="checkbox" id="cd2" data-path="corrupcao.segundaDescoberta" data-kind="check-rerender" ${c.segundaDescoberta ? "checked" : ""} ${!c.primeiraDescoberta ? "disabled" : ""} />
          <label for="cd2">2ª descoberta ocorreu (mesmo assim)</label></div>
        ${c.segundaDescoberta ? `<div class="mini-row"><label>Comprador que aceitou (2ª vez)</label>
          <select data-path="corrupcao.segundoComprador" data-kind="text-rerender"><option value="">—</option>${compradorOpts(c.segundoComprador)}</select></div>` : ""}
        <div class="mini-row" style="border-top:1px solid var(--line);padding-top:0.6rem;margin-top:0.4rem">
          <label><strong>Pontos do corruptor</strong></label><span class="pts ${cPts.corruptor < 0 ? "neg" : ""}">${cPts.corruptor.toFixed(1)}</span></div>
        ${Object.keys(cPts.compradores).map(b => `<div class="mini-row"><label>Pontos — ${esc(b)}</label><span class="pts ${cPts.compradores[b] < 0 ? "neg" : ""}">${cPts.compradores[b].toFixed(1)}</span></div>`).join("")}
        <div class="note note-red" style="margin-top:0.8rem">O corruptor nunca troca de papel e continua negociando normalmente, mesmo após ser descoberto.</div>
      </div>
      <div class="mini-card">
        <h3>🔒 Sabotador (Developer)</h3>
        <div class="mini-row"><label>Empresa do sabotador</label>
          <select data-path="sabotagem.empresaSabotador" data-kind="text-rerender">${empresaOpts(s.empresaSabotador)}</select></div>
        <div class="mini-row"><label>Time do sabotador</label>
          <select data-path="sabotagem.timeSabotador" data-kind="text-rerender">${TIMES.map(t => `<option value="${t}" ${s.timeSabotador === t ? "selected" : ""}>${t}</option>`).join("")}</select></div>
        <div class="mini-row"><label>Tipo de ação</label>
          <select data-path="sabotagem.tipoAcao" data-kind="text-rerender">
            <option value="vazar" ${s.tipoAcao === "vazar" ? "selected" : ""}>Vazar informação</option>
            <option value="atrapalhar" ${s.tipoAcao === "atrapalhar" ? "selected" : ""}>Atrapalhar decisões/produção</option>
          </select></div>
        <div class="checkbox-row" style="margin-bottom:0.6rem">
          <input type="checkbox" id="sd1" data-path="sabotagem.descoberto" data-kind="check-rerender" ${s.descoberto ? "checked" : ""} />
          <label for="sd1">Sabotador foi descoberto</label></div>
        ${s.descoberto ? `
        <div class="mini-row"><label>Denúncias consecutivas recebidas</label>
          <select data-path="sabotagem.denunciasConsecutivas" data-kind="number-rerender">
            <option value="0" ${s.denunciasConsecutivas === 0 ? "selected" : ""}>0</option>
            <option value="1" ${s.denunciasConsecutivas === 1 ? "selected" : ""}>1</option>
            <option value="2" ${s.denunciasConsecutivas === 2 ? "selected" : ""}>2</option>
          </select></div>
        <div class="checkbox-row" style="margin-bottom:0.6rem">
          <input type="checkbox" id="sd2" data-path="sabotagem.areaSoubeECalou" data-kind="check-rerender" ${s.areaSoubeECalou ? "checked" : ""} />
          <label for="sd2">PO/colegas da área sabiam e ficaram calados</label></div>` : ""}
        <div class="mini-row" style="border-top:1px solid var(--line);padding-top:0.6rem;margin-top:0.4rem">
          <label><strong>Pontos do sabotador</strong></label><span class="pts ${sPts.sabotador < 0 ? "neg" : ""}">${sPts.sabotador.toFixed(1)}</span></div>
        <div class="mini-row"><label><strong>Pontos da área/time</strong></label><span class="pts ${sPts.area < 0 ? "neg" : sPts.area > 0 ? "pos" : ""}">${sPts.area > 0 ? "+" : ""}${sPts.area.toFixed(1)}</span></div>
        <div class="mini-row"><label><strong>Demitido?</strong></label><span class="pts">${sPts.demitido ? "SIM — vai para o time RIVAL" : "Não"}</span></div>
      </div>
    </div>
  </div>`;
}

function renderResult() {
  const empresas = [STATE.meta.empresaA, STATE.meta.empresaB];
  const colors = ["linear-gradient(135deg, #455F51, #324339)", "linear-gradient(135deg, #0989B1, #065E77)"];
  const scores = empresas.map(e => Object.assign({ empresa: e }, computeEmpresaScore(STATE, e)));
  return `<div class="panel">
    <h2>Resultado Final</h2>
    <div class="desc">Cálculo automático a partir das médias lançadas em cada aba, ajustado pelos pontos de corrupção/sabotagem. Use como referência — a decisão final da nota é sempre sua.</div>
    <div class="grid2">
      ${scores.map((s, i) => `
      <div class="dash-card" style="background:${colors[i]}">
        <h3>${esc(s.empresa)}</h3>
        <div class="big">${s.final !== null ? s.final.toFixed(2) : "—"}</div>
        <div class="breakdown">
          ${s.parts.map(p => `<div><span>${esc(p.key)}</span><span>${p.val !== null ? p.val.toFixed(2) : "—"}</span></div>`).join("")}
          <div style="margin-top:0.4rem;border-top:1px solid rgba(255,255,255,.3);padding-top:0.4rem">
            <span>Ajuste (corrupção/sabotagem)</span><span>${s.ajuste >= 0 ? "+" : ""}${s.ajuste.toFixed(1)}</span>
          </div>
        </div>
      </div>`).join("")}
    </div>
    <div class="note note-orange" style="margin-top:1.1rem">A nota final é uma média ponderada das notas médias por papel (pesos configuráveis em "Configuração"), somada aos pontos fixos de corrupção/sabotagem. Ela não substitui seu julgamento.</div>
  </div>`;
}

// ---- Alunos tab ----
function papelBadgeColor(papel) { return ROLE_COLORS[papel] || "#6E6E6E"; }

function renderAlunos() {
  const empresas = [STATE.meta.empresaA, STATE.meta.empresaB];
  const counts = {};
  empresas.forEach(e => { counts[e] = { "Scrum Master": 0, "Owner/Stakeholder": 0, "Product Owner-Caça": 0, "Product Owner-Transporte": 0, "Developer-Caça": 0, "Developer-Transporte": 0 }; });
  const buyerCounts = { "Comprador - Governo": 0, "Comprador - Militar": 0, "Comprador - Setor Privado": 0 };
  STATE.alunos.forEach(a => {
    if (a.papel === "Comprador - Governo" || a.papel === "Comprador - Militar" || a.papel === "Comprador - Setor Privado") {
      buyerCounts[a.papel]++;
    } else if (a.papel === "Scrum Master" || a.papel === "Owner/Stakeholder") {
      if (counts[a.empresa]) counts[a.empresa][a.papel]++;
    } else if (a.papel === "Product Owner" || a.papel === "Developer") {
      if (counts[a.empresa] && a.time) counts[a.empresa][a.papel + "-" + a.time]++;
    }
  });
  const naoAtribuidos = STATE.alunos.filter(a => !a.papel).length;

  return `<div class="panel">
    <h2>Alunos</h2>
    <div class="desc">Atribua cada aluno a um papel e equipe. A turma não escolhe o lado — a atribuição é feita aqui pelo professor.</div>
    <div class="roster-search"><input type="text" id="alunoSearch" placeholder="Buscar aluno por nome..." /></div>
    <table class="roster-table"><thead><tr>
      <th style="width:2.5rem">#</th><th style="width:16rem">Nome</th><th>Papel</th><th>Empresa</th><th>Time</th></tr></thead>
      <tbody id="alunosBody">
      ${STATE.alunos.map((a, i) => renderAlunoRow(a, i)).join("")}
      </tbody></table>
    <div class="note ${naoAtribuidos > 0 ? "note-orange" : "note-green"}" style="margin-top:1rem">
      ${naoAtribuidos} de ${STATE.alunos.length} alunos ainda sem papel atribuído.
    </div>

    <h2 style="margin-top:1.6rem">Resumo de Vagas Preenchidas</h2>
    <div class="grid2">
      ${empresas.map(e => `
        <div class="mini-card">
          <h3>${esc(e)}</h3>
          <div class="mini-row"><label>Scrum Master</label><span class="pts">${counts[e]["Scrum Master"]} / 1</span></div>
          <div class="mini-row"><label>Owner/Stakeholder</label><span class="pts">${counts[e]["Owner/Stakeholder"]} / 1</span></div>
          <div class="mini-row"><label>PO — ${esc(STATE.teamNames[e].Caça)}</label><span class="pts">${counts[e]["Product Owner-Caça"]} / 1</span></div>
          <div class="mini-row"><label>PO — ${esc(STATE.teamNames[e].Transporte)}</label><span class="pts">${counts[e]["Product Owner-Transporte"]} / 1</span></div>
          <div class="mini-row"><label>Devs — ${esc(STATE.teamNames[e].Caça)}</label><span class="pts">${counts[e]["Developer-Caça"]} / 4</span></div>
          <div class="mini-row"><label>Devs — ${esc(STATE.teamNames[e].Transporte)}</label><span class="pts">${counts[e]["Developer-Transporte"]} / 5</span></div>
        </div>`).join("")}
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

function renderAlunoRow(a, i) {
  const empresas = [STATE.meta.empresaA, STATE.meta.empresaB];
  const needsEmpresa = a.papel === "Scrum Master" || a.papel === "Owner/Stakeholder" || a.papel === "Product Owner" || a.papel === "Developer";
  const needsTime = a.papel === "Product Owner" || a.papel === "Developer";
  return `<tr data-aluno-row="${i}">
    <td>${a.id}</td>
    <td style="text-align:left">${esc(a.nome)}</td>
    <td><select data-path="alunos.${i}.papel" data-kind="papel-rerender">
        ${PAPEIS.map(p => `<option value="${esc(p)}" ${a.papel === p ? "selected" : ""}>${p === "" ? "— não atribuído —" : esc(p)}</option>`).join("")}
      </select></td>
    <td>${needsEmpresa ? `<select data-path="alunos.${i}.empresa" data-kind="text-rerender">
        <option value="">—</option>${empresas.map(e => `<option value="${esc(e)}" ${a.empresa === e ? "selected" : ""}>${esc(e)}</option>`).join("")}
      </select>` : ""}</td>
    <td>${needsTime ? `<select data-path="alunos.${i}.time" data-kind="text-rerender">
        <option value="">—</option>${TIMES.map(t => `<option value="${t}" ${a.time === t ? "selected" : ""}>${t}</option>`).join("")}
      </select>` : ""}</td>
  </tr>`;
}

// ---- Escalação tab ----
function renderEscalacao() {
  const empresas = [STATE.meta.empresaA, STATE.meta.empresaB];
  return `<div class="panel">
    <h2>Escalação</h2>
    <div class="desc">Visão de equipe, com a identidade visual de cada empresa — útil para projetar em sala.</div>
    ${empresas.map(e => renderCompanyBlock(e)).join("")}

    <h2 style="margin-top:0.4rem">Compradores</h2>
    <div class="buyers-strip">
      ${BUYERS.map(b => {
        const aluno = STATE.alunos.find(a => a.papel === "Comprador - " + b);
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

function renderCompanyBlock(empresa) {
  const imgs = TEAM_IMAGES[empresa] || {};
  const sm = STATE.alunos.find(a => a.papel === "Scrum Master" && a.empresa === empresa);
  const owner = STATE.alunos.find(a => a.papel === "Owner/Stakeholder" && a.empresa === empresa);
  const teamRoster = (time) => STATE.alunos.filter(a => a.empresa === empresa && a.time === time && (a.papel === "Product Owner" || a.papel === "Developer"));
  return `<div class="company-block">
    <div class="company-header">
      <img src="${imgs.logo || ""}" alt="${esc(empresa)}" />
      <div><h2>${esc(empresa)}</h2>
        <div style="font-size:0.85rem;color:var(--muted)">
          Scrum Master: ${sm ? esc(sm.nome) : '<span class="tag-unassigned">não atribuído</span>'} ·
          Owner: ${owner ? esc(owner.nome) : '<span class="tag-unassigned">não atribuído</span>'}
        </div>
      </div>
    </div>
    <div class="teams-grid">
      ${TIMES.map(t => `
        <div class="team-card">
          <img class="team-img" src="${imgs[t] || ""}" alt="${esc(STATE.teamNames[empresa][t])}" />
          <div class="team-body">
            <h3>${esc(STATE.teamNames[empresa][t])}</h3>
            <ul class="role-list">
              ${teamRoster(t).length === 0 ? '<li><span class="tag-unassigned">ninguém atribuído ainda</span></li>' :
                teamRoster(t).sort((a, b) => a.papel === "Product Owner" ? -1 : 1).map(a => `
                <li><span>${esc(a.nome)}</span><span class="role-badge" style="background:${papelBadgeColor(a.papel)}">${a.papel === "Product Owner" ? "PO" : "Dev"}</span></li>
              `).join("")}
            </ul>
          </div>
        </div>`).join("")}
    </div>
  </div>`;
}

// =====================================================================
// MAIN RENDER / TABS
// =====================================================================
const TABS = [
  { key: "setup", label: "Configuração", fn: renderSetup },
  { key: "alunos", label: "Alunos", fn: renderAlunos },
  { key: "escalacao", label: "Escalação", fn: renderEscalacao },
  { key: "sm", label: "Scrum Master", fn: renderSM },
  { key: "owner", label: "Owner", fn: renderOwner },
  { key: "po", label: "Product Owner", fn: renderPO },
  { key: "dev", label: "Developers", fn: renderDev },
  { key: "buyerProf", label: "Compradores (Papel)", fn: renderBuyerProf },
  { key: "buyerProduct", label: "Compradores (Produto)", fn: renderBuyerProduct },
  { key: "corrupsab", label: "Corrupção & Sabotagem", fn: renderCorrupSab },
  { key: "result", label: "Resultado Final", fn: renderResult },
];

function renderTabs() {
  const tabsEl = document.getElementById("tabsBar");
  tabsEl.innerHTML = TABS.map(t => `<div class="tab ${TAB === t.key ? "active" : ""}" data-tab="${t.key}">${t.label}</div>`).join("");
}

function renderPanel() {
  const wrap = document.getElementById("panelWrap");
  const tabDef = TABS.find(t => t.key === TAB);
  wrap.innerHTML = tabDef.fn();
  attachRosterSearchHandler();
  attachImportHandler();
}

function fullRender() {
  renderTabs();
  renderPanel();
  document.getElementById("fileNameLbl").textContent = FILE_NAME;
}

// =====================================================================
// EVENT DELEGATION
// =====================================================================
function handleFieldChange(target) {
  const path = target.getAttribute("data-path");
  const kind = target.getAttribute("data-kind");
  if (!path) return;
  let value = target.value;
  if (kind === "number" || kind === "number-rerender") value = parseFloat(value) || 0;
  if (kind === "check-rerender") value = target.checked;
  setByPath(path, value);
  if (kind === "check-rerender" || kind === "papel-rerender" || kind === "text-rerender" || kind === "number-rerender") {
    renderPanel();
  }
}

function attachDelegatedEvents() {
  const wrap = document.getElementById("panelWrap");
  wrap.addEventListener("change", (e) => {
    if (e.target.id === "nomeA" || e.target.id === "nomeB") { renameEmpresa(e.target.id, e.target.value); return; }
    if (e.target.matches("select, input[type=checkbox]")) handleFieldChange(e.target);
  });
  wrap.addEventListener("input", (e) => {
    if (e.target.matches("input[type=text]") && e.target.getAttribute("data-kind") === "text") {
      setByPath(e.target.getAttribute("data-path"), e.target.value);
    }
  });
}

function renameEmpresa(which, novoNome) {
  const oldA = STATE.meta.empresaA, oldB = STATE.meta.empresaB;
  const oldVal = which === "nomeA" ? oldA : oldB;
  if (!novoNome || novoNome === oldVal) return;
  const rename = (v) => (v === oldVal ? novoNome : v);
  STATE.sm.forEach(r => r.empresa = rename(r.empresa));
  STATE.owner.forEach(r => r.empresa = rename(r.empresa));
  STATE.po.forEach(r => r.empresa = rename(r.empresa));
  STATE.dev.forEach(r => r.empresa = rename(r.empresa));
  STATE.buyerProduct.forEach(r => r.empresa = rename(r.empresa));
  STATE.alunos.forEach(a => a.empresa = rename(a.empresa));
  STATE.corrupcao.empresaCorruptora = rename(STATE.corrupcao.empresaCorruptora);
  STATE.sabotagem.empresaSabotador = rename(STATE.sabotagem.empresaSabotador);
  if (STATE.teamNames[oldVal]) { STATE.teamNames[novoNome] = STATE.teamNames[oldVal]; delete STATE.teamNames[oldVal]; }
  if (TEAM_IMAGES[oldVal]) { TEAM_IMAGES[novoNome] = TEAM_IMAGES[oldVal]; }
  if (which === "nomeA") STATE.meta.empresaA = novoNome; else STATE.meta.empresaB = novoNome;
  renderPanel();
}

function attachRosterSearchHandler() {
  const input = document.getElementById("alunoSearch");
  if (!input) return;
  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    document.querySelectorAll("#alunosBody tr").forEach(tr => {
      const name = tr.children[1].textContent.toLowerCase();
      tr.style.display = name.includes(q) ? "" : "none";
    });
  });
}

function attachImportHandler() {
  const input = document.getElementById("importAlunosFile");
  if (!input) return;
  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = XLSX.read(ev.target.result, { type: "array" });
        const names = [];
        wb.SheetNames.forEach(sn => {
          const ws = wb.Sheets[sn];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
          rows.forEach(row => {
            row.forEach(cell => {
              if (typeof cell === "string" && cell.trim().split(" ").length >= 2 && cell.trim().length > 5 && !/\d/.test(cell)) {
                names.push(cell.trim());
              }
            });
          });
        });
        const unique = Array.from(new Set(names));
        if (unique.length === 0) { alert("Não encontrei nomes reconhecíveis nesse arquivo."); return; }
        if (!confirm(`Encontrei ${unique.length} nomes. Isso substitui a lista atual de alunos (as atribuições feitas serão perdidas). Continuar?`)) return;
        STATE.alunos = unique.map((nome, i) => ({ id: i + 1, nome, empresa: "", time: "", papel: "" }));
        renderPanel();
      } catch (err) {
        alert("Não foi possível ler este arquivo Excel.");
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

// =====================================================================
// FONT SIZE CONTROL
// =====================================================================
function applyFontScale() {
  document.documentElement.style.fontSize = STATE.meta.fontScale + "px";
}
function changeFontScale(delta) {
  STATE.meta.fontScale = Math.max(12, Math.min(24, STATE.meta.fontScale + delta));
  applyFontScale();
  document.getElementById("fontLbl").textContent = STATE.meta.fontScale + "px";
}

// =====================================================================
// SAVE / LOAD
// =====================================================================
function handleSave() {
  const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeTurma = (STATE.meta.turma || "simulacao").replace(/[^a-z0-9A-Z_-]+/g, "_");
  a.href = url; a.download = `scrum_simulacao_${safeTurma}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
function handleLoadFile(file) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      STATE = parsed;
      if (!STATE.meta.fontScale) STATE.meta.fontScale = 16;
      if (!STATE.alunos) STATE.alunos = SEED_NAMES.map((nome, i) => ({ id: i + 1, nome, empresa: "", time: "", papel: "" }));
      if (!STATE.teamNames) {
        STATE.teamNames = {
          [STATE.meta.empresaA]: { Caça: "Esquadrão Falcon", Transporte: "Falcon Carggo" },
          [STATE.meta.empresaB]: { Caça: "SkyForge Combat", Transporte: "SkyForge Transport" },
        };
      }
      FILE_NAME = file.name;
      applyFontScale();
      document.getElementById("fontLbl").textContent = STATE.meta.fontScale + "px";
      fullRender();
    } catch (err) {
      alert("Não foi possível ler este arquivo. Verifique se é um .json válido gerado por este painel.");
    }
  };
  reader.readAsText(file);
}
function handleReset() {
  if (confirm("Isso apaga todos os dados lançados nesta sessão (não afeta arquivos já salvos). Continuar?")) {
    STATE = buildInitialData("Maverick Aviation", "SkyForge Ind. Aeronáutica");
    FILE_NAME = "(nenhum arquivo carregado)";
    applyFontScale();
    document.getElementById("fontLbl").textContent = STATE.meta.fontScale + "px";
    fullRender();
  }
}

// =====================================================================
// INIT
// =====================================================================
function init() {
  document.getElementById("tabsBar").addEventListener("click", (e) => {
    const t = e.target.closest(".tab");
    if (!t) return;
    TAB = t.getAttribute("data-tab");
    fullRender();
  });
  document.getElementById("btnSave").addEventListener("click", handleSave);
  document.getElementById("btnLoad").addEventListener("click", () => document.getElementById("fileInput").click());
  document.getElementById("fileInput").addEventListener("change", (e) => {
    if (e.target.files[0]) handleLoadFile(e.target.files[0]);
    e.target.value = "";
  });
  document.getElementById("btnReset").addEventListener("click", handleReset);
  document.getElementById("fontMinus").addEventListener("click", () => changeFontScale(-1));
  document.getElementById("fontPlus").addEventListener("click", () => changeFontScale(1));
  document.getElementById("fontReset").addEventListener("click", () => { STATE.meta.fontScale = 16; applyFontScale(); document.getElementById("fontLbl").textContent = "16px"; });

  attachDelegatedEvents();
  applyFontScale();
  fullRender();
}

document.addEventListener("DOMContentLoaded", init);
