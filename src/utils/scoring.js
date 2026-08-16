import { avg } from "../data/datamodel";

export function computeEmpresaScore(data, empresa) {
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

export function computeCorrupcaoPontos(c) {
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

export function computeSabotagemPontos(s) {
  let sabotador = 0, area = 0, demitido = false;
  if (s.descoberto) {
    sabotador -= 1;
    area += s.areaSoubeECalou ? -1 : 1;
    if (s.tipoAcao === "vazar" && s.denunciasConsecutivas >= 1) demitido = true;
    if (s.tipoAcao === "atrapalhar" && s.denunciasConsecutivas >= 2) demitido = true;
  }
  return { sabotador, area, demitido };
}