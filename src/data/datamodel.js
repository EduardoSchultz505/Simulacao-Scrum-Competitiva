import { SEED_NAMES, SPRINTS, BUYERS, TIMES } from "./constants";

export function buildInitialData(empresaA, empresaB) {
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
    A: { Caça: "Esquadrão Falcon", Transporte: "Falcon Carggo" },
    B: { Caça: "SkyForge Combat", Transporte: "SkyForge Transport" },
  };
  const alunos = SEED_NAMES.map((nome, i) => ({ id: i + 1, nome, empresa: "", time: "", papel: "" }));

  return {
    meta: { turma: "", data: "", empresaA, empresaB, fontScale: 16 },
    sm, owner, po, dev, buyerProf, buyerProduct, corrupcao, sabotagem, weights, teamNames, alunos,
  };
}

export function avg(arr) {
  const nums = arr.map(v => parseFloat(v)).filter(v => !isNaN(v));
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}