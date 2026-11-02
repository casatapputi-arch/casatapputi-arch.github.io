// Fundación E.B.A.C. — menú de celular y pestañas (2026-11-02)
(function () {
  // Menú de celular
  var abrir = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu-movil');
  if (abrir && menu) {
    var cerrar = menu.querySelector('.menu-cerrar');
    var mostrar = function (si) {
      menu.hidden = !si;
      abrir.setAttribute('aria-expanded', si);
      document.body.style.overflow = si ? 'hidden' : '';
      (si ? cerrar : abrir).focus();
    };
    abrir.addEventListener('click', function () { mostrar(true); });
    cerrar.addEventListener('click', function () { mostrar(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) mostrar(false); });
  }

  // Pestañas accesibles (clic y flechas del teclado)
  document.querySelectorAll('[role=tablist]').forEach(function (lista) {
    var tabs = [].slice.call(lista.querySelectorAll('[role=tab]'));
    function activa(t) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on);
        x.tabIndex = on ? 0 : -1;
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { activa(t); });
      t.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var n = tabs[(i + d + tabs.length) % tabs.length];
        activa(n); n.focus();
      });
    });
    // Abrir una pestaña desde el enlace (#universidades, #estudiantes, #microempresas)
    var h = location.hash.slice(1);
    tabs.forEach(function (t) { if (t.dataset.ancla === h) activa(t); });
  });
})();
