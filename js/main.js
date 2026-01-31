// main.js
// Minimal, accessible mobile menu toggle (improved)
(function () {
  const btn = document.querySelector('.mobile-menu-btn');
  // support either #navLinks (id) or .nav-links (class)
  const nav = document.getElementById('navLinks') || document.querySelector('.nav-links');
  if (!btn || !nav) return;

  // Make sure aria-expanded starts with a valid value
  btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') === 'true' ? 'true' : 'false');

  function openMenu() {
    nav.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
    nav.querySelector('a, button')?.focus();
  }

  function closeMenu() {
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  function toggleMenu() {
    if (nav.classList.contains('open')) closeMenu();
    else openMenu();
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) closeMenu();
  });

  // Close when clicking/tapping outside
  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('open')) return;
    const t = e.target;
    if (!nav.contains(t) && !btn.contains(t)) closeMenu();
  });

  // Close when a nav link is clicked (handy on mobile)
  nav.addEventListener('click', (e) => {
    if (e.target && e.target.tagName === 'A') closeMenu();
  });
})();
