/* Dibuja la pestaña SOLICITUD Y RECEPCIÓN a partir de datos/solicitud.js
   Menú de criterios a la izquierda (botones agrupados); al elegir uno se muestra su información a la derecha.
   En celular se ve primero el menú y, al elegir un criterio, su información con un botón para volver. */
(() => {
"use strict";
const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const btn = (cls, text, fn) => { const b = el("button", cls, text); b.type = "button"; if (fn) b.addEventListener("click", fn); return b; };
let hecho = false, lb = null;

function lightbox() {
  if (lb) return lb;
  lb = el("dialog", "lb");
  const img = el("img"), cap = el("p", "lb-cap"), x = btn("lb-x", "Cerrar", () => lb.close());
  lb.addEventListener("click", e => { if (e.target === lb) lb.close(); });
  lb.append(x, img, cap); document.body.append(lb);
  lb.mostrar = (src, pie) => { img.src = src; img.alt = pie; cap.textContent = pie; lb.showModal(); };
  return lb;
}

function ejemplo(e) {
  const f = el("figure", "ej");
  const b = btn("ej-img"); b.setAttribute("aria-label", "Ampliar imagen: " + e.pie);
  const im = new Image(); im.src = e.src; im.alt = e.pie; im.loading = "lazy";
  b.append(im); b.addEventListener("click", () => lightbox().mostrar(e.src, e.pie));
  const c = el("figcaption");
  c.append(el("span", "tag " + (e.real ? "real" : "ilus"), e.real ? "Documento real · datos ocultos" : "Ilustración"), " " + e.pie);
  f.append(b, c);
  return f;
}

window.renderSolicitud = function () {
  if (hecho) return;
  const S = window.SOLICITUD, root = document.getElementById("solRoot");
  if (!S) { root.append(el("p", "vacio-card", "No se encontró datos/solicitud.js.")); return; }

  /* lista plana de criterios (para anterior / siguiente) */
  const todos = [];
  S.secciones.forEach(s => s.grupos.forEach(g => g.items.forEach(it => todos.push({ s, g, it, n: todos.length }))));
  const botones = new Map(), grupos = new Map();   // n -> botón del menú ; id sección -> {cab, cuerpo}
  let actual = -2;                                  // -1 = fuentes

  const app = el("div", "sol-app");
  const menu = el("nav", "sol-menu"); menu.setAttribute("aria-label", "Criterios");
  const det = el("section", "sol-det"); det.setAttribute("aria-live", "polite");
  const volver = btn("sol-back", "← Criterios", () => { app.classList.remove("abierto"); menu.scrollIntoView({ block: "start" }); });
  const cont = el("div", "sol-cont");
  det.append(volver, cont);

  /* ----- menú ----- */
  const abrirGrupo = (id, abrir) => {
    const g = grupos.get(id); if (!g) return;
    g.cab.setAttribute("aria-expanded", String(abrir)); g.cuerpo.hidden = !abrir;
  };
  S.secciones.forEach((s, si) => {
    const sec = el("div", "sol-grp " + s.tipo);
    const cab = btn("sol-grp-cab"); cab.setAttribute("aria-expanded", "false");
    const cuenta = s.grupos.reduce((n, g) => n + g.items.length, 0);
    cab.append(el("span", "sol-dot"), el("span", "sol-grp-t", s.titulo), el("span", "sol-cuenta", String(cuenta)));
    const cuerpo = el("div", "sol-grp-body"); cuerpo.hidden = true;
    cab.addEventListener("click", () => abrirGrupo(s.id, cuerpo.hidden));
    s.grupos.forEach(g => {
      if (g.titulo) cuerpo.append(el("p", "sol-sub", g.titulo));
      g.items.forEach(it => {
        const n = todos.findIndex(x => x.it === it);
        const b = btn("sol-it", it.t, () => ver(n)); b.dataset.n = n;
        botones.set(n, b); cuerpo.append(b);
      });
    });
    grupos.set(s.id, { cab, cuerpo });
    sec.append(cab, cuerpo); menu.append(sec);
  });
  const bf = btn("sol-fuentes-b", "Fuentes de consulta", () => verFuentes());
  menu.append(bf);

  /* ----- detalle ----- */
  function marcar() {
    botones.forEach((b, n) => b.setAttribute("aria-current", String(n === actual)));
    bf.setAttribute("aria-current", String(actual === -1));
  }
  function nav(n) {
    const w = el("div", "sol-pn");
    const ant = btn("btn sec", "← Anterior", () => ver(n - 1)), sig = btn("btn sec", "Siguiente →", () => ver(n + 1));
    ant.disabled = n <= 0; sig.disabled = n >= todos.length - 1;
    w.append(ant, el("span", "sol-pos", `${n + 1} de ${todos.length}`), sig);
    return w;
  }
  function ver(n) {
    const { s, g, it } = todos[n]; actual = n;
    abrirGrupo(s.id, true); marcar();
    const c = el("article", "crit " + s.tipo);
    const cab = el("p", "crit-sec");
    cab.append(el("span", "tag " + (s.tipo === "ok" ? "ok" : "no"), s.tipo === "ok" ? "Se acepta" : "Se rechaza"), " " + s.titulo + (g.titulo ? " · " + g.titulo : ""));
    c.append(cab, el("h3", "", it.t));
    if (it.d) c.append(el("p", "crit-d", it.d));
    if (it.l) { const ul = el("ul"); it.l.forEach(x => ul.append(el("li", "", x))); c.append(ul); }
    if (it.enlace) c.append(btn("btn sec", "Ir a GUÍA DE TUBOS", () => document.querySelector('.pill[data-tab="' + it.enlace + '"]').click()));
    if (it.ej && it.ej.length) { const gr = el("div", "ej-grid"); it.ej.forEach(e => gr.append(ejemplo(e))); c.append(gr); }
    if (it.f) c.append(el("p", "fuente", "Fuente: " + it.f));
    c.append(nav(n));
    cont.replaceChildren(c);
    mostrarDet();
  }
  function verFuentes() {
    actual = -1; marcar();
    const c = el("article", "crit fuentes");
    c.append(el("h3", "", "Fuentes de consulta"));
    const ol = el("ol", "fuentes-l");
    S.fuentes.forEach(f => { const li = el("li"); li.append(el("strong", "", f.t), el("p", "", f.d)); ol.append(li); });
    c.append(ol);
    cont.replaceChildren(c);
    mostrarDet();
  }
  function mostrarDet() {
    app.classList.add("abierto");
    if (matchMedia("(max-width: 860px)").matches) det.scrollIntoView({ block: "start" });
    cont.scrollTop = 0;
  }

  app.append(menu, det);
  root.append(app);
  hecho = true;
  /* escritorio: se muestra el primer criterio; celular: primero el menú */
  abrirGrupo(S.secciones[0].id, true);
  if (!matchMedia("(max-width: 860px)").matches) {
    ver(0); app.classList.add("abierto");
  } else {
    cont.append(el("p", "vacio-card", "Elige un criterio del menú."));
  }
};
})();
