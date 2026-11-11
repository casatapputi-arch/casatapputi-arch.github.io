// Pruebas de las páginas de verificación con un registro simulado (datos FICTICIOS).
// Uso: (desde la raíz del repo) python3 -m http.server 8800 & node verificacion/pruebas/probar-web.mjs
// Variables: SITIO (default http://127.0.0.1:8800), CHROME (ruta a Chrome si Playwright no trae uno), CAPTURAS (carpeta).
import { chromium } from "playwright";

const SITIO = process.env.SITIO || "http://127.0.0.1:8800";
const SB = "https://prueba-ficticia.supabase.co";
const T = (c) => c.repeat(64);
const areas = ["I", "II", "III", "IV", "V"].map((n, i) => ({ numeral: n, titulo: `Área ${i + 1}`, descripcion: `Descripción ${i + 1}.` }));
const base = {
  encontrado: true, folio: "EBAC-PRUE-2025-01-007", tipo: "reconocimiento", titular: "Persona Ficticia",
  horas: 120, fecha_expedicion: "2025-03-05", numero_participante: 7,
  edicion: { numero: 1, nombre: "Primera", anio: 2025, participantes_total: 20 },
  programa: { clave: "PRUE", nombre: "Programa de Prueba", presentacion: "Presentación.", objetivo_general: "Objetivo.",
              nota_editorial: "Nota editorial.", areas },
  firmante: { nombre: "Firmante Ficticio", cargo: "Cargo Ficticio" }, tiene_copia_digital: false, version: 1,
};
const REG = {
  [T("a")]: { encontrado: true, estado: "pendiente", folio: "EBAC-PRUE-2025-01-001" },
  [T("b")]: { ...base, estado: "vigente" },
  [T("c")]: { ...base, estado: "corregido", nota_estado: "Error de captura", estado_cambiado_en: "2026-01-10T10:00:00Z", version: 3 },
  [T("d")]: { encontrado: true, estado: "revocado", folio: "EBAC-PRUE-2025-01-009", nota_estado: "Emitido por error",
              estado_cambiado_en: "2026-02-01T10:00:00Z", programa: { nombre: "Programa de Prueba" } },
  [T("e")]: { ...base, estado: "vigente", titular: '<img src=x onerror="window.__xss=1">' },
  [T("f")]: { ...base, estado: "vigente", tiene_copia_digital: true },
};

let fallas = 0;
const ok = (c, m) => { if (c) console.log("✅ " + m); else { console.log("❌ " + m); fallas++; } };

const navegador = await chromium.launch(process.env.CHROME ? { executablePath: process.env.CHROME } : {});

async function pagina(ancho, configurado = true) {
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: 900 } });
  const p = await ctx.newPage();
  await p.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await p.route("**/verificacion/recursos/config.js*", (r) => r.fulfill({ contentType: "application/javascript",
    body: configurado ? `window.VERIFICACION_CONFIG={supabaseUrl:"${SB}",anonKey:"llave-publica-ficticia"};`
                      : `window.VERIFICACION_CONFIG={supabaseUrl:"",anonKey:""};` }));
  await p.route(SB + "/functions/v1/verificacion", async (r) => {
    const e = r.request().postDataJSON();
    let res = { encontrado: false };
    if (e.accion === "consultar") res = REG[e.token] || { encontrado: false };
    if (e.accion === "buscar") res = e.folio === "EBAC-PRUE-2025-01-007" && e.codigo === "ABCD2345" ? { encontrado: true, token: T("b") } : { encontrado: false };
    if (e.accion === "copia") res = { disponible: true, url: SB + "/storage/v1/object/sign/verificacion-diplomas/x.pdf?token=y" };
    r.fulfill({ contentType: "application/json", body: JSON.stringify(res) });
  });
  await p.route(SB + "/storage/v1/object/sign/**", (r) => r.fulfill({ contentType: "text/plain", body: "copia" }));
  return p;
}
const ficha = (t) => `${SITIO}/verificacion/documento/#${t}`;
const texto = (p, s) => p.locator(s).textContent();
const ir = async (p, t) => { await p.goto("about:blank"); await p.goto(ficha(t)); };
const desborda = (p) => p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);

for (const ancho of [390, 1280]) {
  const disp = ancho < 600 ? "celular" : "computadora";
  let p = await pagina(ancho, false);
  await p.goto(ficha(T("b")));
  ok((await texto(p, "#estado")).includes("Servicio en preparación"), `[${disp}] sin configurar → «servicio en preparación», sin consultar`);
  ok(await p.locator('meta[name=robots][content*=noindex]').count() === 1, `[${disp}] la ficha lleva noindex`);
  await p.context().close();

  p = await pagina(ancho);
  await p.goto(ficha("no-es-un-token"));
  ok((await texto(p, "#estado")).includes("No se encontró"), `[${disp}] token mal formado → no encontrado`);
  await ir(p, T("9")); await p.waitForSelector(".estado.noencontrado");
  ok(true, `[${disp}] token inexistente → no encontrado`);

  await ir(p, T("a")); await p.waitForSelector(".estado.pendiente");
  ok(await p.locator("#bloque-identificacion").isHidden(), `[${disp}] pendiente: no muestra datos`);
  ok(!(await p.content()).match(/válido|verificado/i), `[${disp}] pendiente: no dice «válido» ni «verificado»`);

  await ir(p, T("b")); await p.waitForSelector(".estado.vigente");
  ok((await texto(p, "#identificacion")).includes("Persona Ficticia"), `[${disp}] vigente: muestra titular`);
  ok(await p.locator(".areas li").count() === 5, `[${disp}] vigente: 5 áreas de formación`);
  ok((await texto(p, "#identificacion")).includes("5 de marzo de 2025"), `[${disp}] fecha en español`);
  ok((await texto(p, "#reproduccion")).includes("se integrará"), `[${disp}] espacio reservado para el diploma`);
  ok((await texto(p, ".portada .banda")).includes("Programa de Prueba") && (await texto(p, ".portada .titular")) === "Persona Ficticia",
     `[${disp}] portada como el reconocimiento: nombre y banda del programa`);
  ok((await texto(p, "#autoridad")).includes("Firmante Ficticio"), `[${disp}] autoridad emisora`);
  ok((await texto(p, ".aviso")).includes("no constituye por sí misma reconocimiento de validez oficial"), `[${disp}] aviso institucional`);
  ok(!(await desborda(p)), `[${disp}] sin desbordamiento horizontal`);
  if (process.env.CAPTURAS) await p.screenshot({ path: `${process.env.CAPTURAS}/ficha-vigente-${disp}.png`, fullPage: true });

  await ir(p, T("c")); await p.waitForSelector(".estado.corregido");
  ok((await texto(p, "#estado")).includes("Error de captura"), `[${disp}] corregido: muestra motivo`);

  await ir(p, T("d")); await p.waitForSelector(".estado.revocado");
  ok((await texto(p, "#estado")).includes("Emitido por error") && await p.locator("#bloque-identificacion").isHidden(),
     `[${disp}] revocado: motivo visible, sin datos personales`);

  await ir(p, T("e")); await p.waitForSelector(".estado.vigente");
  ok(await p.evaluate(() => !window.__xss) && (await texto(p, "#identificacion")).includes("<img"), `[${disp}] datos con HTML se muestran como texto (sin inyección)`);

  await ir(p, T("f")); await p.waitForSelector(".estado.vigente");
  await Promise.all([p.waitForURL(/object\/sign/), p.click("#reproduccion button")]);
  ok(true, `[${disp}] botón de copia digital abre el enlace firmado`);

  await p.goto(`${SITIO}/verificacion/`);
  await p.fill("input[name=folio]", "ebac-prue-2025-01-007"); await p.fill("input[name=codigo]", "abcd2345");
  await Promise.all([p.waitForURL(/documento\/#b{64}/), p.click("form button")]);
  ok(true, `[${disp}] consulta por folio + código lleva a la ficha`);
  await p.goto(`${SITIO}/verificacion/`);
  await p.fill("input[name=folio]", "EBAC-PRUE-2025-01-007"); await p.fill("input[name=codigo]", "ZZZZZZZZ");
  await p.click("form button"); await p.waitForSelector(".estado.noencontrado");
  ok(true, `[${disp}] código equivocado → no encontrado`);
  ok(!(await desborda(p)), `[${disp}] consulta sin desbordamiento horizontal`);
  if (process.env.CAPTURAS) await p.screenshot({ path: `${process.env.CAPTURAS}/consulta-${disp}.png`, fullPage: true });
  await p.context().close();
}

await navegador.close();
console.log(fallas ? `❌ ${fallas} prueba(s) fallaron` : "✅ Todas las pruebas de la web pasaron.");
process.exit(fallas ? 1 : 0);
