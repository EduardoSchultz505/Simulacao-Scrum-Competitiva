import renderAlunos from '../components/Alunos';
import renderEscalacao from '../components/Escalacao';
import renderSM from '../components/ScrumMaster';
import { renderSetup } from '../components/Configuracao';
import { renderOwner } from '../components/Owner';
import { renderResult } from '../components/Resultado';
import { renderPO } from '../components/ProductOwner';
import { renderCorrupSab } from '../components/Corrupcao';
import { renderDev } from '../components/Developer';
import { renderBuyerProduct } from '../components/CompradoresProduto';
import { renderBuyerProf } from '../components/CompradoresPapel';
import { esc } from './domHelpers';
import { attachRosterSearchHandler, attachImportHandler } from './eventDelegated';

export function TABS(STATE) {
  return [
    { key: "setup", label: "Configuração", fn: () => renderSetup(STATE) },
    { key: "alunos", label: "Alunos", fn: () => renderAlunos(STATE) },
    { key: "escalacao", label: "Escalação", fn: () => renderEscalacao(STATE, esc) },
    { key: "sm", label: "Scrum Master", fn: () => renderSM(STATE) },
    { key: "owner", label: "Owner", fn: () => renderOwner(STATE) },
    { key: "po", label: "Product Owner", fn: () => renderPO(STATE) },
    { key: "dev", label: "Developers", fn: () => renderDev(STATE) },
    { key: "buyerProf", label: "Compradores (Papel)", fn: () => renderBuyerProf(STATE) },
    { key: "buyerProduct", label: "Compradores (Produto)", fn: () => renderBuyerProduct(STATE) },
    { key: "corrupsab", label: "Corrupção & Sabotagem", fn: () => renderCorrupSab(STATE) },
    { key: "result", label: "Resultado Final", fn: () => renderResult(STATE) },
  ];
}

export function renderTabs(STATE, TAB) {
  const tabs = TABS(STATE);
  const tabsEl = document.getElementById("tabsBar");
  tabsEl.innerHTML = tabs.map(t => `<div class="tab ${TAB === t.key ? "active" : ""}" data-tab="${t.key}">${t.label}</div>`).join("");
}

export function renderPanel(STATE, TAB) {
  const tabs = TABS(STATE);
  const wrap = document.getElementById("panelWrap");
  const tabDef = tabs.find(t => t.key === TAB);
  wrap.innerHTML = tabDef.fn();
  attachRosterSearchHandler();
  attachImportHandler(STATE, TAB);
}

export function fullRender(STATE, TAB, FILE_NAME) {
  renderTabs(STATE, TAB);
  renderPanel(STATE, TAB);
  document.getElementById("fileNameLbl").textContent = FILE_NAME;
}
