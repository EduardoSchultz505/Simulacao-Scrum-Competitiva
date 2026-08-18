const STORAGE_KEY = "scrum_simulacao_state";

export function saveToLocalStorage(STATE) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE));
  } catch (err) {
    console.error("Erro ao salvar no localStorage:", err);
  }
}

export function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erro ao carregar do localStorage:", err);
    return null;
  }
}

export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}