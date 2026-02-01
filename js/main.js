<script>
  function toggleMenu() {
    const navLinks = document.getElementById("navLinks");
    const menuBtn = document.querySelector(".mobile-menu-btn");
    if (!navLinks || !menuBtn) return;

    navLinks.classList.toggle("active");
    menuBtn.setAttribute("aria-expanded", navLinks.classList.contains("active") ? "true" : "false");
  }

  (function bindNavClose() {
    const navLinks = document.getElementById("navLinks");
    const menuBtn = document.querySelector(".mobile-menu-btn");
    if (!navLinks || !menuBtn) return;

    navLinks.addEventListener("click", (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (target.tagName.toLowerCase() !== "a") return;

      navLinks.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  })();
</script>