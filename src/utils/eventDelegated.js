import { setByPath } from "./domHelpers";
import { renderPanel } from "./tabs";
import { saveToLocalStorage } from "../storage/persistence";
import * as XLSX from 'xlsx';


export function handleFieldChange(target, STATE, tabRef) {
  const path = target.getAttribute("data-path");
  const kind = target.getAttribute("data-kind");
  if (!path) return;
  let value = target.value;
  if (kind === "number" || kind === "number-rerender") value = parseFloat(value) || 0;
  if (kind === "check-rerender") value = target.checked;
  setByPath(path, value, STATE);
  if (kind === "check-rerender" || kind === "papel-rerender" || kind === "text-rerender" || kind === "number-rerender") {
    renderPanel(STATE, tabRef.current);
  }
}

export function attachDelegatedEvents(STATE_ref, tabRef) {
  const wrap = document.getElementById("panelWrap");
  wrap.addEventListener("change", (e) => {
    if (e.target.id === "nomeA" || e.target.id === "nomeB") { renameEmpresa(e.target.id, e.target.value, STATE_ref.current, tabRef); return; }
    if (e.target.matches("select, input[type=checkbox], input[type=number]")) handleFieldChange(e.target, STATE_ref.current, tabRef);
  });
  wrap.addEventListener("input", (e) => {
    if (e.target.matches("input[type=text]") && e.target.getAttribute("data-kind") === "text") {
      setByPath(e.target.getAttribute("data-path"), e.target.value, STATE_ref.current);
    }
  });
}

export function renameEmpresa(which, novoNome, STATE, tabRef) {
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
  if (which === "nomeA") STATE.meta.empresaA = novoNome; else STATE.meta.empresaB = novoNome;
  saveToLocalStorage(STATE);
  renderPanel(STATE, tabRef.current);
}

export function attachRosterSearchHandler() {
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

export function attachImportHandler(STATE, TAB) {
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
              if (isNomeAluno(cell)) {
                names.push(cell.trim());
              }
            });
          });
        });
        const unique = Array.from(new Set(names));
        if (unique.length === 0) { alert("Não encontrei nomes reconhecíveis nesse arquivo."); return; }
        if (!confirm(`Encontrei ${unique.length} nomes. Isso substitui a lista atual de alunos (as atribuições feitas serão perdidas). Continuar?`)) return;
        STATE.alunos = unique.map((nome, i) => ({ id: i + 1, nome, empresa: "", time: "", papel: "" }));
        saveToLocalStorage(STATE);
        renderPanel(STATE, TAB);
      } catch (err) {
        console.error(err);
        alert("Não foi possível ler este arquivo Excel.");
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

function isNomeAluno(cell) {
  if (typeof cell !== "string") return false;
  const texto = cell.trim();
  const soMaiusculas = /^[A-ZÀ-ÖØ-Þ\s]+$/.test(texto);
  return soMaiusculas && texto.split(" ").filter(Boolean).length >= 2 && texto.length > 5;
}