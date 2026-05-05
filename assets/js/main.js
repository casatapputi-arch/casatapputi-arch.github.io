// Mobile menu
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Tabs for participa page
function showTab(tabName) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  event.target.classList.add('active');
}

// Form — Formspree
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  btn.textContent = 'Enviando...';
  btn.disabled = true;
  fetch('https://formspree.io/f/meenjlrr', {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
  .then(r => {
    if (r.ok) {
      document.getElementById('form-success').style.display = 'block';
      form.style.display = 'none';
    } else {
      btn.textContent = 'Enviar mensaje';
      btn.disabled = false;
      alert('Error al enviar. Intenta de nuevo o escríbenos directamente.');
    }
  })
  .catch(() => {
    btn.textContent = 'Enviar mensaje';
    btn.disabled = false;
    alert('Error al enviar. Intenta de nuevo o escríbenos directamente.');
  });
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
