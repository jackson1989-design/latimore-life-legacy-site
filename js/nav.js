// /js/nav.js
(function () {
  function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const btn = document.getElementById("menuBtn");
    if (!navLinks || !btn) return;

    navLinks.classList.toggle("active");

    const expanded = navLinks.classList.contains("active");
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  // Expose for onclick="" if you keep it
  window.toggleMenu = toggleMenu;

  // Also auto-wire the button click (works even without onclick)
  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("menuBtn");
    if (btn) btn.addEventListener("click", toggleMenu);
  });
})();function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  if (!navLinks) return;
  navLinks.classList.toggle("active");
}