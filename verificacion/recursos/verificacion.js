// Sistema Institucional de Verificación Académica — Fundación E.B.A.C.
// Todo dato que viene del registro se pinta con textContent (nunca como HTML).
(function () {
  "use strict";
  var CFG = window.VERIFICACION_CONFIG || {};
  var configurado = !!(CFG.supabaseUrl && CFG.anonKey);
  var MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto",
               "septiembre", "octubre", "noviembre", "diciembre"];
  var TIPOS = { reconocimiento: "Reconocimiento", constancia: "Constancia", diploma: "Diploma" };

  function $(s, r) { return (r || document).querySelector(s); }
  function el(tag, attrs, hijos) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === "texto") n.textContent = attrs[k];
      else if (k === "clase") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (hijos || []).forEach(function (h) { if (h) n.appendChild(typeof h === "string" ? document.createTextNode(h) : h); });
    return n;
  }
  function fecha(iso) {
    if (!iso) return "";
    var p = String(iso).slice(0, 10).split("-");
    return parseInt(p[2], 10) + " de " + MESES[parseInt(p[1], 10) - 1] + " de " + p[0];
  }
  function rpc(nombre, cuerpo) {
    return fetch(CFG.supabaseUrl.replace(/\/$/, "") + "/rest/v1/rpc/" + nombre, {
      method: "POST",
      headers: { "content-type": "application/json", apikey: CFG.anonKey, authorization: "Bearer " + CFG.anonKey },
      body: JSON.stringify(cuerpo),
      referrerPolicy: "no-referrer",
      cache: "no-store"
    }).then(function (r) { if (!r.ok) throw new Error("HTTP " + r.status); return r.json(); });
  }

  // ───────── Bloque de estado ─────────
  var ESTADOS = {
    cargando:     { i: "", t: "Consultando el registro…", d: "" },
    preparacion:  { i: "i", t: "Servicio en preparación",
                    d: "El sistema de verificación aún no está habilitado. Para confirmar un documento, escriba a contacto@fundacionebac.org indicando el folio." },
    noencontrado: { i: "!", t: "No se encontró el documento",
                    d: "El enlace no corresponde a ningún registro de Fundación E.B.A.C. Revise que el código QR o la dirección estén completos. Si la duda persiste, escriba a contacto@fundacionebac.org indicando el folio." },
    nofolio:      { i: "!", t: "No se encontró un documento con esos datos", c: "noencontrado",
                    d: "Revise el folio y el código de consulta tal como aparecen impresos. Si la duda persiste, escriba a contacto@fundacionebac.org." },
    error:        { i: "!", t: "No fue posible consultar el registro",
                    d: "Hubo un problema de conexión. Intente de nuevo en unos minutos.", c: "noencontrado" },
    pendiente:    { i: "…", t: "Registro en proceso de autorización",
                    d: "Este folio existe en los registros de Fundación E.B.A.C., pero todavía no ha sido autorizado. Por ello no se muestran datos del documento." },
    vigente:      { i: "✓", t: "Documento vigente",
                    d: "Este documento fue emitido por Fundación E.B.A.C. y se encuentra vigente en sus registros." },
    corregido:    { i: "✓", t: "Documento vigente, con corrección registrada",
                    d: "Este documento fue emitido por Fundación E.B.A.C. y se encuentra vigente. Sus datos fueron corregidos después de la emisión." },
    revocado:     { i: "×", t: "Documento revocado",
                    d: "Este documento fue revocado por Fundación E.B.A.C. y ya no surte efectos." }
  };
  function pintarEstado(clave, extra) {
    var e = ESTADOS[clave], caja = $("#estado");
    caja.className = "estado " + (e.c || clave);
    caja.replaceChildren(
      el("span", { clase: "icono", "aria-hidden": "true", texto: e.i }),
      el("div", null, [el("strong", { texto: e.t }), e.d ? el("p", { texto: e.d }) : null].concat(extra || []))
    );
  }

  // ───────── Ficha ─────────
  function dato(etq, valor, clase) {
    return el("div", clase ? { clase: clase } : null, [el("dt", { texto: etq }), el("dd", { texto: valor })]);
  }
  function pintarFicha(d) {
    var ed = d.edicion || {}, pr = d.programa || {};
    $("#titulo").textContent = (TIPOS[d.tipo] || "Documento") + " académico";

    $("#identificacion").replaceChildren(
      dato("Titular", d.titular, "ancha titular"),
      dato("Folio", d.folio, "folio"),
      dato("Tipo de documento", TIPOS[d.tipo] || d.tipo),
      dato("Capacitación", pr.nombre, "ancha"),
      dato("Edición", (ed.nombre ? ed.nombre + " edición" : "Edición " + ed.numero) + (ed.anio ? " · " + ed.anio : "")),
      dato("Horas acreditadas", d.horas + " horas"),
      dato("Fecha de expedición", fecha(d.fecha_expedicion)),
      ed.participantes_total ? dato("Participante", "Número " + d.numero_participante + " de " + ed.participantes_total)
                             : dato("Participante", "Número " + d.numero_participante)
    );

    var acad = $("#academica");
    var areas = el("ol", { clase: "areas" }, (pr.areas || []).map(function (a) {
      return el("li", null, [el("span", { clase: "num", texto: a.numeral }),
        el("div", null, [el("h3", { texto: a.titulo }), el("p", { texto: a.descripcion })])]);
    }));
    acad.replaceChildren(
      el("h2", { texto: "Información académica" }),
      el("div", { clase: "texto" }, [
        el("h3", { texto: "Presentación" }), pr.presentacion ? el("p", { texto: pr.presentacion }) : null,
        el("h3", { texto: "Objetivo general" }), pr.objetivo_general ? el("p", { texto: pr.objetivo_general }) : null
      ]),
      el("h3", { texto: "Áreas de formación y competencias desarrolladas" }),
      areas,
      pr.nota_editorial ? el("p", { clase: "nota", texto: pr.nota_editorial }) : null
    );

    var f = d.firmante || {};
    $("#autoridad").replaceChildren(
      el("h2", { texto: "Autoridad emisora" }),
      el("div", { clase: "firma" }, [el("p", { clase: "nombre", texto: f.nombre }), el("p", { clase: "cargo", texto: f.cargo })])
    );

    pintarReproduccion(d);
    ["#bloque-identificacion", "#academica", "#bloque-reproduccion", "#autoridad"].forEach(function (s) { $(s).hidden = false; });
  }

  function pintarReproduccion(d) {
    var caja = $("#reproduccion");
    if (!d.tiene_copia_digital) {
      caja.replaceChildren(el("p", { texto: "La reproducción digital autorizada del documento se integrará en este espacio." }));
      return;
    }
    var boton = el("button", { clase: "btn", type: "button", texto: "Ver copia digital autorizada" });
    var msg = el("p", { "aria-live": "polite" });
    boton.addEventListener("click", function () {
      boton.disabled = true; msg.textContent = "";
      fetch(CFG.supabaseUrl.replace(/\/$/, "") + "/functions/v1/verificacion-diploma", {
        method: "POST",
        headers: { "content-type": "application/json", apikey: CFG.anonKey, authorization: "Bearer " + CFG.anonKey },
        body: JSON.stringify({ token: TOKEN }), referrerPolicy: "no-referrer", cache: "no-store"
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (j && j.disponible && /^https:\/\//.test(j.url)) window.location.assign(j.url);
        else msg.textContent = "La copia digital no está disponible en este momento.";
      }).catch(function () { msg.textContent = "No fue posible abrir la copia digital. Intente de nuevo."; })
        .then(function () { boton.disabled = false; });
    });
    caja.replaceChildren(el("div", null, [boton, msg]));
  }

  function mostrar(d) {
    if (!d || !d.encontrado) { pintarEstado("noencontrado"); return; }
    if (d.estado === "pendiente") {
      pintarEstado("pendiente", [el("p", { texto: "Folio: " + d.folio })]);
      return;
    }
    if (d.estado === "revocado") {
      var extra = [el("p", { texto: "Folio: " + d.folio + (d.programa && d.programa.nombre ? " · " + d.programa.nombre : "") })];
      if (d.estado_cambiado_en) extra.push(el("p", { texto: "Fecha de revocación: " + fecha(d.estado_cambiado_en) }));
      if (d.nota_estado) extra.push(el("p", { texto: "Motivo: " + d.nota_estado }));
      pintarEstado("revocado", extra);
      return;
    }
    var ex = [];
    if (d.estado === "corregido") {
      if (d.estado_cambiado_en) ex.push(el("p", { texto: "Corrección registrada el " + fecha(d.estado_cambiado_en) + "." }));
      if (d.nota_estado) ex.push(el("p", { texto: "Motivo: " + d.nota_estado }));
    }
    pintarEstado(d.estado === "corregido" ? "corregido" : "vigente", ex);
    pintarFicha(d);
  }

  // ───────── Página de la ficha ─────────
  var TOKEN = "";
  function iniciarFicha() {
    // Vista previa interna (archivo local generado para revisión; nunca se publica con datos reales).
    if (window.VERIFICACION_VISTA_PREVIA) {
      var vp = window.VERIFICACION_VISTA_PREVIA;
      document.body.insertBefore(el("div", { clase: "aviso-previa", role: "note",
        texto: "VISTA PREVIA INTERNA · Sin validez · El registro está pendiente de autorización" }), document.body.firstChild);
      pintarEstado("pendiente", [el("p", { texto: "Así se verá la ficha una vez autorizada y activada." })]);
      pintarFicha(vp);
      return;
    }
    TOKEN = (location.hash || "").replace(/^#/, "").toLowerCase();
    if (!configurado) { pintarEstado("preparacion"); return; }
    if (!/^[0-9a-f]{64}$/.test(TOKEN)) { pintarEstado("noencontrado"); return; }
    pintarEstado("cargando");
    rpc("verificacion_consultar", { p_token: TOKEN }).then(mostrar).catch(function () { pintarEstado("error"); });
  }

  // ───────── Página de consulta por folio ─────────
  function iniciarConsulta() {
    var form = $("form.consulta");
    if (!configurado) { pintarEstado("preparacion"); form.hidden = true; return; }
    $("#estado").hidden = true;
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var folio = form.folio.value.trim().toUpperCase(), codigo = form.codigo.value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
      if (!folio || codigo.length !== 8) return;
      var b = form.querySelector("button"); b.disabled = true;
      $("#estado").hidden = false; pintarEstado("cargando");
      rpc("verificacion_buscar", { p_folio: folio, p_codigo: codigo }).then(function (r) {
        if (r && r.encontrado && /^[0-9a-f]{64}$/.test(r.token)) location.assign("/verificacion/documento/#" + r.token);
        else pintarEstado("nofolio");
      }).catch(function () { pintarEstado("error"); }).then(function () { b.disabled = false; });
    });
  }

  if (document.body.dataset.pagina === "ficha") {
    iniciarFicha();
    window.addEventListener("hashchange", function () { location.reload(); });
  } else if (document.body.dataset.pagina === "consulta") {
    iniciarConsulta();
  }
})();
