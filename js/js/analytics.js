/* File: js/analytics.js */
(() => {
  /**
   * Google Analytics 4 loader.
   *
   * Depends on:
   * - window.LLL_GA_ID (string, e.g. "G-XXXXXXXXXX") from js/config.js
   * - window.LLL_TRACKING.debug (boolean) optional
   *
   * Behavior:
   * - If LLL_GA_ID is missing/invalid, GA is not loaded.
   * - If gtag already exists, it will not re-inject duplicates.
   */
  const gaId = String(window.LLL_GA_ID || "").trim();
  const debug = Boolean(window.LLL_TRACKING && window.LLL_TRACKING.debug);

  const isValidGaId = /^G-[A-Z0-9]+$/i.test(gaId);
  if (!isValidGaId) return;

  // If GA already present (you pasted the official snippet), don't duplicate.
  if (typeof window.gtag === "function" && Array.isArray(window.dataLayer)) {
    try {
      window.gtag("config", gaId, { debug_mode: debug });
    } catch {
      // ignore
    }
    return;
  }

  // Avoid injecting the script twice.
  const alreadyInjected = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js"][src*="id=${encodeURIComponent(gaId)}"]`
  );
  if (alreadyInjected) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      window.dataLayer.push(arguments);
    };

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", gaId, {
    send_page_view: true,
    debug_mode: debug,
  });
})();
