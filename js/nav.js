function toggleMenu() {
  const navLinks = document.getElementById("navLinks");
  if (!navLinks) return;
  navLinks.classList.toggle("active");
}