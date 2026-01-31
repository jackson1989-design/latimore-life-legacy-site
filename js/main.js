// main.js
// Minimal, accessible mobile menu toggle
(function () {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.nav-links');
  if (!btn || !nav) return;

  function setExpanded(val) {
    btn.setAttribute('aria-expanded', String(val));
    if (val) nav.classList.add('open'); else nav.classList.remove('open');
  }

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    setExpanded(!expanded);
    if (!expanded) nav.querySelector('a, button')?.focus();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setExpanded(false);
      btn.focus();
    }
  });

  // Close when clicking/tapping outside
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('open')) return;
    const target = e.target;
    if (!nav.contains(target) && !btn.contains(target)) {
      setExpanded(false);
    }
  });
})();
