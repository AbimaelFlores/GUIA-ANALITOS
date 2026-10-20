/* Guía de tubos · HGR No. 36
   Este archivo NO necesita modificarse para agregar tubos, recipientes o analitos:
   crea el archivo en datos/tubos o datos/analitos y añádelo en datos/indice.js */
(() => {
"use strict";

const TUBOS = {}, ANALITOS = {};
window.registrarTubo = t => { TUBOS[t.id] = t; };
window.registrarAnalito = a => { ANALITOS[a.id] = a; };

/* ---------- utilidades ---------- */
const $ = s => document.querySelector(s);
const norm = s => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
const fmt = n => (Math.round(n * 100) / 100).toString().replace(".", ",") + " mL";
const colorOk = c => /^#[0-9a-f]{3,8}$/i.test(c) ? c : "#94a3b8";

function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}
function btn(cls, text, fn) {
  const b = el("button", cls, text); b.type = "button";
  if (fn) b.addEventListener("click", fn);
  return b;
}
function fila(k, v) {
  const f = el("div", "fila"); f.append(el("span", "", k), el("span", "", v)); return f;
}
function dotColor(color) {
  const d = el("span", "dot"); d.style.setProperty("--c", colorOk(color)); return d;
}
/* botones de opción única (Todos / Urgencias / Ordinarios, tipo de solicitud…) */
function segmentado(cont, opciones, get, set) {
  const pintar = () => cont.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === get())));
  cont.replaceChildren(...opciones.map(([v, t]) => {
    const b = btn("seg-b", t, () => { set(v); pintar(); }); b.dataset.v = v; return b;
  }));
  pintar();
}

/* ---------- tubos y recipientes ---------- */
const esRec = t => t.tipo === "recipiente";
const nomT = t => esRec(t) ? t.nombre : "Tubo " + t.nombre;      // "Tubo Rojo" / "Frasco estéril"
const etiT = t => esRec(t) ? "Recipiente" : "Tubo";
const areaDe = a => a.area || "Sin área";
const porNombre = (x, y) => x.nombre.localeCompare(y.nombre, "es");
const CATS_FILTRO = [["todos", "Todos"], ["urgencias", "Estudios de urgencias"], ["ordinario", "Estudios ordinarios"]];

/* ---------- imágenes (con respaldo ilustrado) ---------- */
function icoTubo(color) {
  const c = colorOk(color), w = el("div", "ico");
  w.innerHTML = `<svg viewBox="0 0 40 100" aria-hidden="true"><rect x="11" y="4" width="18" height="12" rx="3" fill="${c}"/>` +
    `<path d="M13 16h14v66a7 7 0 0 1-14 0z" fill="#fff" stroke="#94a3b8" stroke-width="2"/>` +
    `<path d="M14 50h12v32a6 6 0 0 1-12 0z" fill="${c}" opacity=".85"/></svg>`;
  return w;
}
function icoRecipiente(color) {
  const c = colorOk(color), w = el("div", "ico");
  w.innerHTML = `<svg viewBox="0 0 60 80" aria-hidden="true"><rect x="12" y="6" width="36" height="14" rx="4" fill="${c}"/>` +
    `<path d="M10 20h40v46a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8z" fill="#fff" stroke="#94a3b8" stroke-width="2.5"/>` +
    `<path d="M12 46h36v20a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z" fill="${c}" opacity=".8"/></svg>`;
  return w;
}
function icoGota(color) {
  const c = colorOk(color), w = el("div", "ico");
  w.innerHTML = `<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3C14 13 8 19 8 26a12 12 0 0 0 24 0c0-7-6-13-12-23z" fill="${c}"/>` +
    `<path d="M14 26a6 6 0 0 0 6 6" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/></svg>`;
  return w;
}
/* src: ruta de la imagen; si falta o no carga, se muestra la ilustración de respaldo */
function media(src, respaldo, extra) {
  const d = el("div", "media" + (extra ? " " + extra : ""));
  const fb = () => d.replaceChildren(respaldo());
  if (!src) { fb(); return d; }
  const img = new Image();
  img.alt = ""; img.onerror = fb; img.src = src;
  d.append(img);
  return d;
}
const imgTubo = (t, extra) => media(t.imagen || `img/tubos/${t.id}.png`, () => esRec(t) ? icoRecipiente(t.color) : icoTubo(t.color), extra);
const imgAnalito = (a, extra) => media(a.imagen || `img/analitos/${a.id}.png`, () => icoGota(TUBOS[a.tubo].color), extra);

/* ---------- búsqueda ---------- */
const abrevs = a => [a.abrev, a.abrevUrg].filter(Boolean);
const tieneCat = (a, cat) => cat === "todos" || a.categorias.includes(cat);
const pajar = a => norm([a.nombre, ...abrevs(a), ...(a.sinonimos || []), areaDe(a)].join(" | "));
function buscar(q, cat = "todos") {
  const n = norm(q), lista = Object.values(ANALITOS).filter(a => tieneCat(a, cat));
  if (!n) return lista.sort(porNombre);
  const out = [];
  lista.forEach(a => {
    const nom = norm(a.nombre), ab = abrevs(a).map(norm);
    let s = 9;
    if (ab.includes(n)) s = 0;                                  // la abreviatura exacta va primero
    else if (nom.startsWith(n)) s = 1;
    else if (ab.some(x => x.startsWith(n))) s = 2;
    else if (nom.includes(n)) s = 3;
    else if (pajar(a).includes(n) || norm(nomT(TUBOS[a.tubo])).includes(n)) s = 4;
    if (s < 9) out.push([s, a]);
  });
  return out.sort((x, y) => x[0] - y[0] || porNombre(x[1], y[1])).map(x => x[1]);
}
/* analitos que pueden entregarse en el tubo `id`: [{a, alterno}] */
const analitosDe = id => Object.values(ANALITOS).filter(a => a.tubo === id || a.tuboAlterno === id)
  .sort(porNombre).map(a => ({ a, alterno: a.tubo !== id }));

/* ---------- listado por categoría ---------- */
let catL = "";
function renderListado() {
  segmentado($("#catL"), CATS_FILTRO.slice(1), () => catL, v => { catL = (catL === v ? "" : v); renderListado(); });
  const out = $("#listaL");
  if (!catL) { out.replaceChildren(el("p", "vacio-card", "Selecciona “Estudios de urgencias” o “Estudios ordinarios”.")); return; }
  const lista = Object.values(ANALITOS).filter(a => a.categorias.includes(catL)).sort(porNombre);
  const caja = el("div", "card lista-l");
  caja.append(el("h3", "", (catL === "urgencias" ? "Estudios de urgencias" : "Estudios ordinarios") + " (" + lista.length + ")"));
  const ul = el("ul", "lista-ul");
  lista.forEach(a => {
    const t = TUBOS[a.tubo], li = el("li"), b = btn("fan", "", () => abrirAnalito(a.id));
    const izq = el("span", "");
    izq.append(el("strong", "", a.nombre + ((catL === "urgencias" ? a.abrevUrg : a.abrev) ? " · " + (catL === "urgencias" ? a.abrevUrg : a.abrev) : "")),
      el("span", "a", areaDe(a) + (a.tuboAlterno ? " · también en " + nomT(TUBOS[a.tuboAlterno]) : "")));
    const der = el("span", "fan-tags");
    const tb = el("span", ""); tb.append(dotColor(t.color), nomT(t));
    der.append(tb); { const pf = perfilPersonal(a); if (pf) der.append(el("span", "tag pers " + pf.nivel, pf.nivel === "medico" ? "Solo médico" : pf.nivel === "paciente" ? "Autotoma" : pf.nivel === "amplio" ? "Lab · Enf · Méd" : "Personal capacitado")); } if (a.envio) der.append(el("span", "tag env", "Envío"));
    b.append(izq, der); li.append(b); ul.append(li);
  });
  caja.append(ul); out.replaceChildren(caja);
}

/* ---------- navegación ---------- */
const vistas = ["inicio", "analito", "guia", "simulador", "listado", "solicitud"];
function mostrar(tab) {
  vistas.forEach(v => { $("#" + v).hidden = v !== tab; });
  document.querySelectorAll(".pill").forEach(p => p.setAttribute("aria-selected", p.dataset.tab === tab));
  document.body.classList.toggle("en-inicio", tab === "inicio");
  if (tab === "analito") renderAnalito();
  if (tab === "guia") renderGuia();
  if (tab === "simulador") renderSim();
  if (tab === "listado") renderListado();
  if (tab === "solicitud" && window.renderSolicitud) window.renderSolicitud();
  window.scrollTo(0, 0);
}
function abrirAnalito(id) { selA = id; catA = "todos"; $("#qA").value = ANALITOS[id].nombre; mostrar("analito"); }
function abrirGuia(id) { selG = id; fG.q = ""; mostrar("guia"); }

/* ---------- etiquetas y tarjetas ---------- */
function etiquetasCat(a, completo) {
  const out = [];
  a.categorias.forEach(k => out.push(el("span", "tag " + (k === "urgencias" ? "urg" : "ord"),
    k === "urgencias" ? (completo ? "Estudio de urgencias" : "Urgencias") : (completo ? "Estudio ordinario" : "Ordinario"))));
  if (a.envio) out.push(el("span", "tag env", "Envío"));
  return out;
}
/* personal que puede tomar la muestra (datos/personal.js) */
function perfilPersonal(a) {
  const P = window.PERSONAL; if (!P) return null;
  return P.perfiles[a.personal] || P.perfiles[P.porTubo[a.tubo]] || null;
}
function bloquePersonal(a) {
  const pf = perfilPersonal(a); if (!pf) return null;
  const b = el("div", "personal " + pf.nivel);
  b.append(el("p", "personal-t", "Personal que puede tomar la muestra"));
  const l = el("div", "personal-l");
  pf.quien.forEach(q => l.append(el("span", "tag pers " + pf.nivel, q)));
  b.append(l);
  if (pf.nota) b.append(el("p", "nota", pf.nota));
  b.append(el("p", "nota peq", window.PERSONAL.aviso));
  return b;
}
function tarjetaAnalito(a) {
  const t = TUBOS[a.tubo], alt = a.tuboAlterno ? TUBOS[a.tuboAlterno] : null;
  const c = el("article", "card");
  c.append(el("span", "kicker", "Analito"), imgAnalito(a), el("h3", "", a.nombre));
  const tags = el("div", "cab");
  tags.append(...etiquetasCat(a, true), el("span", "tag", areaDe(a)));
  c.append(tags);
  if (a.envio) c.append(el("p", "aviso-envio", `Estudio de envío: se toma en un ${esRec(t) ? "recipiente" : "tubo"} aparte, sin compartirlo con otros estudios.`));
  const filaTubo = (rot, tb) => {
    const f = el("div", "fila"), v = el("span", "");
    v.append(dotColor(tb.color), nomT(tb));
    f.append(el("span", "", rot), v); return f;
  };
  c.append(filaTubo(alt ? etiT(t) + " principal" : etiT(t), t));
  if (alt) c.append(filaTubo(etiT(alt) + " alterno", alt));
  if (t.aforo) c.append(fila("Volumen mínimo", t.aforo));
  else if (a.volumen) c.append(fila("Volumen mínimo", fmt(a.volumen)));
  c.append(fila("Muestra", t.muestra));
  if (a.abrev && a.abrevUrg && norm(a.abrev) !== norm(a.abrevUrg)) {
    c.append(fila("Abreviatura (ordinarios)", a.abrev), fila("Abreviatura (urgencias)", a.abrevUrg));
  } else if (a.abrev || a.abrevUrg) {
    c.append(fila("Abreviatura", a.abrev || a.abrevUrg));
  }
  if (alt) c.append(el("p", "nota", `Puede entregarse en cualquiera de los dos: ${nomT(t)} o ${nomT(alt)}.`));
  { const bp = bloquePersonal(a); if (bp) c.append(bp); }
  if (a.nota) c.append(el("p", "nota", a.nota));
  if ((a.sinonimos || []).length) c.append(el("p", "nota", "También se busca como: " + a.sinonimos.join(", ")));
  return c;
}
function tarjetaTubo(t, opts = {}) {
  const c = el("article", "card");
  c.style.setProperty("--c", colorOk(t.color));
  const cab = el("div", "cab");
  cab.append(el("span", "bar"), el("h3", "", nomT(t)));
  c.append(el("span", "kicker", opts.kicker || etiT(t)), imgTubo(t), cab);
  if (t.aditivo) c.append(fila("Aditivo", t.aditivo));
  c.append(fila("Muestra", t.muestra));
  if (t.aforo) c.append(fila("Volumen mínimo", t.aforo));
  if (t.nota) c.append(el("p", "nota", t.nota));
  if (opts.boton) c.append(btn("btn", (n => `Ver ${n === 1 ? "el analito" : "los " + n + " analitos"} de este ${esRec(t) ? "recipiente" : "tubo"}`)(analitosDe(t.id).length), () => abrirGuia(t.id)));
  return c;
}

/* ---------- buscador con sugerencias (compartido) ---------- */
function buscadorSug(input, ul, { cat = () => "todos", filtro = () => true, max = 8, alElegir, alEscribir }) {
  const cerrar = () => { ul.hidden = true; };
  const abrir = () => {
    if (!input.value.trim()) { cerrar(); return; }
    const res = buscar(input.value, cat()).filter(filtro);
    ul.replaceChildren();
    if (!res.length) ul.append(el("li", "vacio", "No se encontró ningún analito con ese nombre."));
    res.slice(0, max).forEach(a => {
      const li = el("li"), b = btn("", "", () => { cerrar(); alElegir(a); });
      const tb = TUBOS[a.tubo], alt = a.tuboAlterno && TUBOS[a.tuboAlterno];
      b.append(dotColor(tb.color), a.nombre, el("small", "", nomT(tb) + (alt ? " o " + alt.nombre : "")));
      li.append(b); ul.append(li);
    });
    if (res.length > max) ul.append(el("li", "vacio", `${res.length - max} resultados más: escribe más letras para afinar.`));
    ul.hidden = false;
  };
  input.addEventListener("input", () => { abrir(); if (alEscribir) alEscribir(); });
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") { const r = buscar(input.value, cat()).filter(filtro); if (input.value.trim() && r.length) { cerrar(); alElegir(r[0]); } }
    if (e.key === "Escape") cerrar();
  });
  document.addEventListener("click", e => { if (!e.target.closest(".buscador")) cerrar(); });
  return { abrir, cerrar };
}

/* ---------- pestaña ANALITO/PRUEBA ---------- */
let selA = null, catA = "todos";
const qA = $("#qA");
function renderAnalito() {
  segmentado($("#catA"), CATS_FILTRO, () => catA, v => { catA = v; selA = null; qA.value = ""; renderAnalito(); qA.focus(); });
  const par = $("#parA"), a = ANALITOS[selA];
  if (!a) {
    par.replaceChildren(el("p", "vacio-card", qA.value.trim() && !buscar(qA.value, catA).length
      ? "No se encontró ningún analito con ese nombre."
      : "Escribe el nombre o la abreviatura de un analito para ver su tarjeta y la del tubo."));
    return;
  }
  const t = TUBOS[a.tubo], alt = a.tuboAlterno ? TUBOS[a.tuboAlterno] : null;
  const der = el("div", "res-col");
  der.append(tarjetaTubo(t, { boton: true, kicker: alt ? etiT(t) + " principal" : etiT(t) }));
  if (alt) der.append(tarjetaTubo(alt, { boton: true, kicker: etiT(alt) + " alterno" }));
  par.replaceChildren(tarjetaAnalito(a), der);
}
const sugA = buscadorSug(qA, $("#sugA"), {
  max: 10, cat: () => catA,
  alElegir: a => { selA = a.id; qA.value = a.nombre; renderAnalito(); },
  alEscribir: () => { const r = buscar(qA.value, catA); selA = qA.value.trim() && r.length ? r[0].id : null; renderAnalito(); }
});

/* ---------- pestaña GUÍA DE TUBOS ---------- */
let selG = null;
const fG = { q: "", cat: "todos" };
function renderGuia() {
  const ids = Object.keys(TUBOS);
  if (!selG || !TUBOS[selG]) selG = ids[0];
  const lista = $("#listaG"), partes = [];
  [["Tubos de sangre", ids.filter(i => !esRec(TUBOS[i]))], ["Recipientes y medios", ids.filter(i => esRec(TUBOS[i]))]].forEach(([tit, grupo]) => {
    if (!grupo.length) return;
    partes.push(el("h4", "lista-t", tit));
    grupo.forEach(id => {
      const t = TUBOS[id];
      const b = btn("item", "", () => { selG = id; fG.q = ""; renderGuia(); if (matchMedia("(max-width: 860px)").matches) $("#detG").scrollIntoView({ behavior: "smooth", block: "start" }); });
      b.style.setProperty("--c", colorOk(t.color));
      b.setAttribute("aria-current", String(id === selG));
      const txt = el("span"); txt.append(el("b", "", nomT(t)), el("small", "", (n => n + (n === 1 ? " analito" : " analitos"))(analitosDe(id).length)));
      b.append(imgTubo(t, "mini"), txt);
      partes.push(b);
    });
  });
  lista.replaceChildren(...partes);

  const t = TUBOS[selG];
  const info = tarjetaTubo(t);
  info.querySelector(".kicker").remove();
  const an = el("section", "card");
  const tit = el("h3", ""); an.append(tit);
  const ctr = el("div", "filtro-g");
  const inp = el("input"); inp.type = "search"; inp.id = "qG"; inp.placeholder = "Filtrar analitos de este " + (esRec(t) ? "recipiente" : "tubo") + "…";
  inp.setAttribute("aria-label", "Filtrar analitos"); inp.autocomplete = "off"; inp.value = fG.q;
  const seg = el("div", "seg"); seg.setAttribute("role", "group"); seg.setAttribute("aria-label", "Categoría");
  ctr.append(inp, seg);
  const filas = el("div", "filas-an");
  an.append(ctr, filas);
  const pintar = () => {
    const n = norm(fG.q), todos = analitosDe(selG);
    const lista = todos.filter(({ a }) => tieneCat(a, fG.cat) && (!n || pajar(a).includes(n)));
    tit.textContent = `Analitos asociados (${lista.length}${lista.length !== todos.length ? " de " + todos.length : ""})`;
    if (!lista.length) { filas.replaceChildren(el("p", "nota", todos.length ? "Ningún analito coincide con el filtro." : "Este tubo aún no tiene analitos registrados.")); return; }
    filas.replaceChildren(...lista.map(({ a, alterno }) => {
      const r = btn("fan", "", () => abrirAnalito(a.id));
      const nom = el("span", "n", a.nombre);
      let sub = areaDe(a);
      if (abrevs(a).length) sub += " · " + [...new Set(abrevs(a))].join(" / ");
      if (alterno) sub += ` · alterno (principal: ${nomT(TUBOS[a.tubo])})`;
      else if (a.tuboAlterno) sub += ` · también en ${nomT(TUBOS[a.tuboAlterno])}`;
      const s = el("span", "a", sub); nom.append(s);
      const tg = el("span", "fan-tags"); tg.append(...etiquetasCat(a, false));
      r.append(nom, tg);
      return r;
    }));
  };
  inp.addEventListener("input", () => { fG.q = inp.value; pintar(); });
  segmentado(seg, CATS_FILTRO, () => fG.cat, v => { fG.cat = v; pintar(); });
  pintar();
  const det = el("div", "det"); det.append(info, an);
  $("#detG").replaceChildren(det);
}

/* ---------- pestaña SIMULADOR ---------- */
let tipoS = "urgencias";                         // "urgencias" | "ordinario"
const pedidos = { urgencias: [], ordinario: [] }; // cada tipo de solicitud tiene su propia lista: [{ id, tubo }]
const pedido = () => pedidos[tipoS];
const qS = $("#qS");
const TIPOS = [["urgencias", "URGENCIAS"], ["ordinario", "ORDINARIA"]];
function agregar(a) {
  if (!pedido().some(p => p.id === a.id)) pedido().push({ id: a.id, tubo: a.tubo });
  qS.value = ""; renderSim(); qS.focus();
}
buscadorSug(qS, $("#sugS"), { cat: () => tipoS, filtro: a => !pedido().some(p => p.id === a.id), alElegir: agregar });

/* Reglas del conteo:
   - Estudio de envío: SIEMPRE un tubo (o recipiente) aparte, uno por estudio.
   - Tubos de sangre: un tubo por cada combinación tubo + área (otra área = tubo extra).
   - Recipientes: uno por muestra (cada estudio), salvo los que comparten `muestraGrupo` (ej. orina de 24 h). */
function calcularTubos(lista) {
  const grupos = new Map();
  lista.forEach(({ id, tubo }) => {
    const a = ANALITOS[id], t = TUBOS[tubo], area = areaDe(a);
    const k = a.envio ? "envio|" + a.id : esRec(t) ? `rec|${t.id}|${area}|${a.muestraGrupo || a.id}` : `${t.id}|${area}`;
    if (!grupos.has(k)) grupos.set(k, { t, area, envio: a.envio, extra: false, items: [] });
    grupos.get(k).items.push(a);
  });
  const orden = Object.keys(TUBOS), vistos = new Set();
  const arr = [...grupos.values()];
  arr.forEach(g => {                                   // 2.º tubo del mismo color en otra área = tubo extra
    if (g.envio || esRec(g.t)) return;
    if (vistos.has(g.t.id)) g.extra = true; else vistos.add(g.t.id);
  });
  return arr.sort((x, y) => (x.envio - y.envio) || orden.indexOf(x.t.id) - orden.indexOf(y.t.id) || (x.extra - y.extra));
}

function renderSim() {
  segmentado($("#tipoS"), TIPOS, () => tipoS, v => { tipoS = v; qS.value = ""; $("#sugS").hidden = true; renderSim(); });
  const urg = tipoS === "urgencias", lista = pedido();
  qS.placeholder = urg ? "Agregar estudio de URGENCIAS (ej: BH, glucosa, troponina)…" : "Agregar estudio ORDINARIO (ej: TSH, perfil de lípidos, cultivo)…";
  $("#hintS").textContent = urg ? "Solo se pueden agregar los estudios de la lista de urgencias." : "Se pueden agregar todos los estudios ordinarios.";
  const par = $("#parS");
  const izq = el("section", "card");
  izq.append(el("h3", "", `Solicitud ${urg ? "de URGENCIAS" : "ORDINARIA"} (${lista.length})`));
  if (!lista.length) {
    izq.append(el("p", "nota", "Aún no hay analitos. Búscalos arriba y selecciónalos para agregarlos."));
  } else {
    const ul = el("ul", "ped");
    lista.forEach(p => {
      const a = ANALITOS[p.id], t = TUBOS[p.tubo], li = el("li");
      const nom = el("span", "n", a.nombre); nom.append(el("span", "a", `${nomT(t)} · ${areaDe(a)}`));
      if (a.envio) { const e = el("span", "tag env", "Envío · aparte"); e.style.marginTop = "4px"; e.style.display = "inline-block"; nom.append(e); }
      const x = btn("x", "×", () => { pedidos[tipoS] = pedidos[tipoS].filter(i => i.id !== p.id); renderSim(); });
      x.setAttribute("aria-label", "Quitar " + a.nombre);
      li.append(dotColor(t.color), nom, x);
      if (a.tuboAlterno && TUBOS[a.tuboAlterno]) {
        const op = el("div", "opc"); op.setAttribute("role", "group"); op.setAttribute("aria-label", "Dónde entregar " + a.nombre);
        op.append(el("span", "", "Entregar en:"));
        [a.tubo, a.tuboAlterno].forEach(tid => {
          const tb = TUBOS[tid], o = btn("opt", "", () => { p.tubo = tid; renderSim(); });
          o.setAttribute("aria-pressed", String(p.tubo === tid)); o.append(dotColor(tb.color), tb.nombre);
          op.append(o);
        });
        li.append(op);
      }
      ul.append(li);
    });
    izq.append(ul, btn("btn sec", "Limpiar lista", () => { pedidos[tipoS] = []; renderSim(); }));
  }

  const der = el("div", "res-col");
  if (!lista.length) {
    der.append(el("p", "vacio-card", "Aquí aparecerán los tubos necesarios para los analitos que agregues."));
  } else {
    const grupos = calcularTubos(lista), total = grupos.length;
    const hayRec = grupos.some(g => esRec(g.t));
    const res = el("div", "resumen");
    const n = el("span");
    n.append(el("div", "num", String(total)), el("small", "kicker", hayRec ? (total === 1 ? "tubo o recipiente en total" : "tubos y recipientes en total") : (total === 1 ? "tubo en total" : "tubos en total")));
    const dots = el("div", "dots");
    grupos.forEach(g => { const d = dotColor(g.t.color); d.title = nomT(g.t); dots.append(d); });
    res.append(n, dots);
    der.append(res);
    grupos.forEach(g => {
      const c = el("article", "card"); c.style.setProperty("--c", colorOk(g.t.color));
      const top = el("div", "grupo-top");
      const tit = el("div"); tit.append(el("h3", "", nomT(g.t)), el("span", "kicker", g.area));
      top.append(imgTubo(g.t, "mini"), tit);
      c.append(top);
      const tags = el("div", "cab");
      if (g.envio) tags.append(el("span", "tag env", `Envío · ${esRec(g.t) ? "recipiente" : "tubo"} aparte`));
      if (g.extra) tags.append(el("span", "tag extra", "Tubo extra: área distinta"));
      if (tags.children.length) c.append(tags);
      const ul = el("ul", "mini-lista");
      g.items.forEach(a => { const li = el("li"); li.append(el("span", "", a.nombre), el("span", "", abrevs(a).length ? abrevs(a)[urg ? abrevs(a).length - 1 : 0] : "")); ul.append(li); });
      c.append(ul);
      if (g.t.aforo) c.append(el("p", "nota", "Volumen mínimo: " + g.t.aforo + "."));
      if (g.t.nota && !g.t.aforo) c.append(el("p", "nota", g.t.nota));
      der.append(c);
    });
  }
  par.replaceChildren(izq, der);
}

/* ---------- arranque ---------- */
function cargar(src) {
  return new Promise(res => {
    const s = document.createElement("script");
    s.src = src; s.async = true; s.onload = () => res(null); s.onerror = () => res(src);
    document.head.append(s);
  });
}
async function iniciar() {
  const idx = window.GUIA_ARCHIVOS || { tubos: [], analitos: [] };
  /* todos los archivos de datos se piden a la vez (más rápido en red móvil) */
  const faltan = (await Promise.all([...idx.tubos, ...idx.analitos].map(cargar))).filter(Boolean);
  /* los tubos conservan el orden de datos/indice.js aunque lleguen en otro orden */
  const ordenados = {};
  idx.tubos.map(f => f.split("/").pop().replace(/\.js$/, "")).forEach(id => { if (TUBOS[id]) ordenados[id] = TUBOS[id]; });
  Object.keys(TUBOS).forEach(id => { if (!ordenados[id]) ordenados[id] = TUBOS[id]; });
  Object.keys(TUBOS).forEach(id => delete TUBOS[id]);
  Object.assign(TUBOS, ordenados);
  Object.values(ANALITOS).forEach(a => {
    if (!TUBOS[a.tubo]) { faltan.push(`${a.id}: el tubo "${a.tubo}" no existe`); delete ANALITOS[a.id]; return; }
    if (a.tuboAlterno && !TUBOS[a.tuboAlterno]) { faltan.push(`${a.id}: el tubo alterno "${a.tuboAlterno}" no existe`); delete a.tuboAlterno; }
    a.categorias = (a.categorias || []).filter(k => k === "ordinario" || k === "urgencias");
    if (!a.categorias.length) a.categorias = ["ordinario"];
    a.envio = !!a.envio;
  });
  if (faltan.length) { const av = $("#aviso"); av.hidden = false; av.textContent = "Revisa estos archivos de datos: " + faltan.join(" · "); }
  document.querySelectorAll(".pill").forEach(p => p.addEventListener("click", () => mostrar(p.dataset.tab)));
  $("#inicioBtn").addEventListener("click", () => mostrar("inicio"));
  mostrar("inicio");
  /* uso sin conexión (solo cuando la guía se aloja en un servidor http/https) */
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(() => {});
}
iniciar();
})();
