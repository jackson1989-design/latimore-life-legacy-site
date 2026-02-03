function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  const btn = document.querySelector(".mobile-menu-btn");
  if (!navLinks || !btn) return;

  navLinks.classList.toggle("active");

  const expanded = navLinks.classList.contains("active");
  btn.setAttribute("aria-expanded", expanded ? "true" : "false");
}

/* Close menu after clicking a nav link (mobile) */
document.addEventListener("click", (e) => {
  const navLinks = document.getElementById("navLinks");
  const btn = document.querySelector(".mobile-menu-btn");
  if (!navLinks || !btn) return;

  const link = e.target.closest("#navLinks a");
  if (link) {
    navLinks.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
  }
});

/* Close menu when clicking outside nav (mobile) */
document.addEventListener("click", (e) => {
  const navLinks = document.getElementById("navLinks");
  const btn = document.querySelector(".mobile-menu-btn");
  if (!navLinks || !btn) return;

  const isOpen = navLinks.classList.contains("active");
  if (!isOpen) return;

  const insideNav = e.target.closest(".nav");
  if (!insideNav) {
    navLinks.classList.remove("active");
    btn.setAttribute("aria-expanded", "false");
  }
});