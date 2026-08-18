import { SEED_NAMES } from "../data/constants";
import { applyFontScale } from "../utils/fonte";
import { fullRender } from "../utils/tabs";
import { buildInitialData } from "../data/datamodel";
import { saveToLocalStorage, clearLocalStorage } from "./Persistence";

export function handleSave(STATE) {
  saveToLocalStorage(STATE);
  const blob = new Blob([JSON.stringify(STATE, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeTurma = (STATE.meta.turma || "simulacao").replace(/[^a-z0-9A-Z_-]+/g, "_");
  a.href = url; a.download = `scrum_simulacao_${safeTurma}.json`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
export function handleLoadFile(file, STATE_ref, FILE_NAME_ref, tabRef) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const parsed = JSON.parse(ev.target.result);
      STATE_ref.current = parsed;
      if (!STATE_ref.current.meta.fontScale) STATE_ref.current.meta.fontScale = 16;
      if (!STATE_ref.current.alunos) STATE_ref.current.alunos = SEED_NAMES.map((nome, i) => ({ id: i + 1, nome, empresa: "", time: "", papel: "" }));
      if (!STATE_ref.current.teamNames) {
        STATE_ref.current.teamNames = {
          A: { Caça: "Esquadrão Falcon", Transporte: "Falcon Carggo" },
          B: { Caça: "SkyForge Combat", Transporte: "SkyForge Transport" },
        };
      }
      FILE_NAME_ref.current = file.name;
      applyFontScale(STATE_ref.current);
      document.getElementById("fontLbl").textContent = STATE_ref.current.meta.fontScale + "px";
      saveToLocalStorage(STATE_ref.current);   
      fullRender(STATE_ref.current, tabRef.current, FILE_NAME_ref.current);
    } catch (err) {
      console.error(err);
      alert("Não foi possível ler este arquivo. Verifique se é um .json válido gerado por este painel.");
    }
  };
  reader.readAsText(file);
}

export function handleReset(STATE_ref, FILE_NAME_ref, tabRef) {
  if (confirm("Isso apaga todos os dados lançados nesta sessão (não afeta arquivos já salvos). Continuar?")) {
    clearLocalStorage();
    STATE_ref.current = buildInitialData("Maverick Aviation", "SkyForge Ind. Aeronáutica");
    FILE_NAME_ref.current = "(nenhum arquivo carregado)";
    applyFontScale(STATE_ref.current);
    document.getElementById("fontLbl").textContent = STATE_ref.current.meta.fontScale + "px";
    fullRender(STATE_ref.current, tabRef.current, FILE_NAME_ref.current);
  }
}