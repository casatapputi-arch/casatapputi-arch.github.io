// Botón flotante de WhatsApp de Fundación E.B.A.C. (55 2251 3285, número oficial).
// Al tocarlo muestra tres opciones; cada una abre WhatsApp con un mensaje ya escrito.
(function () {
  var NUMERO = '525522513285';
  var OPCIONES = [
    { titulo: 'Microempresa', detalle: 'Acompañamiento técnico y formativo',
      texto: 'Hola, tengo una microempresa y me interesa el acompañamiento de la Fundación E.B.A.C.' },
    { titulo: 'Escuela o fundación', detalle: 'Convenios y vinculación institucional',
      texto: 'Hola, escribo en representación de una escuela o fundación y nos interesa vincularnos con la Fundación E.B.A.C.' },
    { titulo: 'Estudiante o voluntariado', detalle: 'Servicio social, prácticas, estadías o voluntariado',
      texto: 'Hola, soy estudiante o quiero hacer voluntariado y me interesa participar en el Programa de la Fundación E.B.A.C.' }
  ];
  var ICONO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>';

  var css = '' +
    '.wa-caja{position:fixed;right:24px;bottom:24px;z-index:9999;font-family:inherit}' +
    '.wa-boton{width:60px;height:60px;border:0;border-radius:50%;background:#25D366;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 16px rgba(37,211,102,.4);transition:transform .2s ease,box-shadow .2s ease}' +
    '.wa-boton:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(37,211,102,.55)}' +
    '.wa-boton:active{transform:scale(.96)}' +
    '.wa-boton:focus-visible{outline:3px solid #1E2A22;outline-offset:3px}' +
    '.wa-boton svg{width:32px;height:32px;fill:#fff}' +
    '.wa-menu{position:absolute;right:0;bottom:74px;width:min(320px,calc(100vw - 32px));background:#fff;color:#1E2A22;border-radius:14px;box-shadow:0 12px 40px rgba(20,30,24,.25);overflow:hidden;transform-origin:bottom right}' +
    '.wa-menu[hidden]{display:none}' +
    '@keyframes wa-entra{from{transform:scale(.96) translateY(6px)}}' +
    '@media (prefers-reduced-motion:no-preference){.wa-menu:not([hidden]){animation:wa-entra .2s cubic-bezier(.16,1,.3,1)}}' +
    '.wa-cab{background:#1F6E43;color:#fff;padding:16px 18px}' +
    '.wa-cab strong{display:block;font-size:1.02rem}' +
    '.wa-cab span{font-size:.88rem;opacity:.9}' +
    '.wa-menu a{display:block;padding:14px 18px;text-decoration:none;color:inherit;border-top:1px solid #ECE7DE;transition:background-color .15s ease}' +
    '.wa-menu a:first-of-type{border-top:0}' +
    '.wa-menu a:hover,.wa-menu a:focus-visible{background:#F2EEE6;outline:none}' +
    '.wa-menu a strong{display:block;font-size:1rem}' +
    '.wa-menu a span{display:block;font-size:.86rem;color:#55605A;margin-top:2px}' +
    '@keyframes wa-pulso{0%{box-shadow:0 0 0 0 rgba(37,211,102,.5)}70%{box-shadow:0 0 0 14px rgba(37,211,102,0)}100%{box-shadow:0 0 0 0 rgba(37,211,102,0)}}' +
    '@media (prefers-reduced-motion:no-preference){.wa-boton{animation:wa-pulso 2s 3}}' +
    '@media (max-width:600px){.wa-caja{right:16px;bottom:16px}.wa-boton{width:56px;height:56px}}' +
    '@media (prefers-reduced-motion:reduce){.wa-boton{transition:none}}';

  function iniciar() {
    var estilo = document.createElement('style');
    estilo.textContent = css;
    document.head.appendChild(estilo);

    var caja = document.createElement('div');
    caja.className = 'wa-caja';
    var enlaces = OPCIONES.map(function (o) {
      return '<a href="https://wa.me/' + NUMERO + '?text=' + encodeURIComponent(o.texto) + '" target="_blank" rel="noopener">' +
        '<strong>' + o.titulo + '</strong><span>' + o.detalle + '</span></a>';
    }).join('');
    caja.innerHTML =
      '<div class="wa-menu" id="wa-menu" hidden role="menu" aria-label="Elegir motivo de contacto">' +
        '<div class="wa-cab"><strong>Escribir por WhatsApp</strong><span>¿Quién escribe?</span></div>' + enlaces +
      '</div>' +
      '<button class="wa-boton" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="wa-menu" aria-label="Escribir por WhatsApp a la Fundación">' + ICONO + '</button>';
    document.body.appendChild(caja);

    var boton = caja.querySelector('.wa-boton');
    var menu = caja.querySelector('.wa-menu');
    function abrir(si) {
      menu.hidden = !si;
      boton.setAttribute('aria-expanded', si);
      if (si) menu.querySelector('a').focus();
    }
    boton.addEventListener('click', function () { abrir(menu.hidden); });
    document.addEventListener('click', function (e) { if (!caja.contains(e.target)) abrir(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { abrir(false); boton.focus(); } });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) abrir(false); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
