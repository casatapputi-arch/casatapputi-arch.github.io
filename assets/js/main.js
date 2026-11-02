// Menú móvil
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const button = document.querySelector('.hamburger');
  if (!menu || !button) return;

  const isOpen = menu.classList.toggle('is-open');
  button.setAttribute('aria-expanded', String(isOpen));
  button.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
}

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const menu = document.getElementById('mobileMenu');
  const button = document.querySelector('.hamburger');
  if (menu && menu.classList.contains('is-open')) {
    menu.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menú de navegación');
    button.focus();
  }
});

// Tabs for participa page
function showTab(tabName) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  event.target.classList.add('active');
}

// Smooth reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(
  '.entity-card, .modalidad-card, .timeline-item, .flow-actor, .relacion-card, .vleg-item, .circulo, .seccion-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
