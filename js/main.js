// main.js
// Accessible mobile menu toggle with Escape & outside-click support
(function () {
  const btn = document.querySelector('.mobile-menu-btn');
  const nav = document.getElementById('navLinks') || document.querySelector('.nav-links');
  if (!btn || !nav) return;

  // Optional debug line — remove after testing:
  // console.log('main.js loaded');

  // Ensure aria-expanded has a valid starting value
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

  // Close when a nav link is clicked (mobile UX)
  nav.addEventListener('click', (e) => {
    if (e.target && e.target.tagName === 'A') closeMenu();
  });
})();
