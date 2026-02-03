// /js/nav.js
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.getElementById("navLinks");
  if (!btn || !navLinks) return;

  const setExpanded = (expanded) => {
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  };

  btn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    setExpanded(navLinks.classList.contains("active"));
  });

  // Close menu when a link is clicked (mobile)
  navLinks.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    navLinks.classList.remove("active");
    setExpanded(false);
  });

  // Close menu on outside click (mobile)
  document.addEventListener("click", (e) => {
    const clickedInsideNav = e.target.closest(".nav-container");
    if (clickedInsideNav) return;

    if (navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      setExpanded(false);
    }
  });
});