/* File: js/config.js */
(() => {
  /**
   * Site configuration (edit these).
   *
   * LLL_GA_ID:
   * - Set to your GA4 Measurement ID (starts with "G-") to enable Google Analytics.
   * - Leave blank to disable GA but keep local tracking + export.
   *
   * LLL_SITE_URL:
   * - Your live site URL, used by sitemap/robots generation and as a label in events.
   */
  window.LLL_GA_ID = "G-XXXXXXXXXX";
  window.LLL_SITE_URL = "https://example.com";

  /**
   * Tracking settings.
   */
  window.LLL_TRACKING = {
    enabled: true,
    debug: false,
    maxEvents: 200,
    storageKey: "lll_events",
  };
})();

/* File: js/analytics.js */
(() => {
  const gaId = (window.LLL_GA_ID || "").trim();
  if (!gaId || !/^G-[A-Z0-9]+$/i.test(gaId)) return;

  const existing = document.querySelector(`script[src*="gtag/js?id=${encodeURIComponent(gaId)}"]`);
  if (existing) return;

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
  window.gtag("config", gaId, { send_page_view: true });
})();

/* File: js/main.js */
(() => {
  const cfg = window.LLL_TRACKING || {};
  const STORAGE_KEY = cfg.storageKey || "lll_events";
  const MAX_EVENTS = Number.isFinite(cfg.maxEvents) ? cfg.maxEvents : 200;
  const TRACKING_ENABLED = cfg.enabled !== false;
  const DEBUG = cfg.debug === true;

  function nowIso() {
    return new Date().toISOString();
  }

  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  function getBasename(urlOrPath) {
    const clean = (urlOrPath || "").split("#")[0].split("?")[0];
    const parts = clean.split("/");
    return parts[parts.length - 1] || "";
  }

  function currentPageName() {
    const base = getBasename(window.location.pathname);
    return base || "index.html";
  }

  function normalizeHrefToPageName(href) {
    if (!href) return "";
    if (href.startsWith("http://") || href.startsWith("https://")) {
      try {
        const u = new URL(href);
        return getBasename(u.pathname) || "index.html";
      } catch {
        return "";
      }
    }
    if (href.startsWith("mailto:") || href.startsWith("tel:")) return "";
    if (href.startsWith("#")) return currentPageName();
    return getBasename(href) || "index.html";
  }

  function readEvents() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return Array.isArray(safeJsonParse(raw, [])) ? safeJsonParse(raw, []) : [];
  }

  function writeEvents(events) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events.slice(-MAX_EVENTS)));
  }

  function track(name, props = {}) {
    if (!TRACKING_ENABLED) return;

    const payload = {
      name: String(name || "event"),
      ts: nowIso(),
      path: window.location.pathname || "/",
      site: (window.LLL_SITE_URL || "").trim() || undefined,
      ...props,
    };

    try {
      const events = readEvents();
      events.push(payload);
      writeEvents(events);
    } catch {
      // localStorage may be blocked; ignore
    }

    if (typeof window.gtag === "function") {
      try {
        window.gtag("event", payload.name, props);
      } catch {
        // ignore analytics errors
      }
    }

    if (DEBUG) {
      try {
        // eslint-disable-next-line no-console
        console.log("[track]", payload);
      } catch {
        // ignore
      }
    }
  }

  function downloadJson(filename, data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function setupExportButton() {
    const btn =
      document.querySelector('[data-export-events="true"]') ||
      document.querySelector("#export-activity") ||
      document.querySelector('[data-export-events]');

    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.preventDefault();

      const events = readEvents();
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      downloadJson(`latimore-activity-${stamp}.json`, events);

      track("analytics_export", { count: events.length });
    });
  }

  function setupStickyNavShadow() {
    const header =
      document.querySelector(".navbar") ||
      document.querySelector(".site-header") ||
      document.querySelector("header");

    if (!header) return;

    let ticking = false;

    const update = () => {
      ticking = false;
      const scrolled = window.scrollY > 8;
      header.classList.toggle("scrolled", scrolled);
    };

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();
  }

  function setupActiveNavLink() {
    const page = currentPageName();
    const navLinks = document.querySelectorAll(
      ".nav-links a[href], .nav-list a[href], nav a[href]"
    );

    navLinks.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const targetPage = normalizeHrefToPageName(href);
      if (!targetPage) return;

      const isCurrent = targetPage.toLowerCase() === page.toLowerCase();
      if (isCurrent) {
        a.setAttribute("aria-current", "page");
        a.classList.add("current");
      }
    });
  }

  function setupMobileMenu() {
    const menuBtn =
      document.querySelector(".mobile-menu-btn") ||
      document.querySelector('[data-mobile-menu="button"]') ||
      document.querySelector('[data-mobile-menu-btn]');

    const menu =
      document.querySelector(".nav-links") ||
      document.querySelector(".nav-list") ||
      document.querySelector('[data-mobile-menu="links"]');

    if (!menuBtn || !menu) return;

    const container =
      menu.closest(".nav-container") ||
      menu.closest(".navbar") ||
      menu.closest("header") ||
      document;

    if (!menu.id) menu.id = "mobile-nav";
    if (!menuBtn.getAttribute("aria-controls")) menuBtn.setAttribute("aria-controls", menu.id);
    menuBtn.setAttribute("aria-expanded", "false");

    function isOpen() {
      return menu.classList.contains("active");
    }

    function open() {
      menu.classList.add("active");
      menuBtn.setAttribute("aria-expanded", "true");
      track("menu_open", { location: currentPageName() });
    }

    function close() {
      if (!isOpen()) return;
      menu.classList.remove("active");
      menuBtn.setAttribute("aria-expanded", "false");
      track("menu_close", { location: currentPageName() });
    }

    function toggle() {
      if (isOpen()) close();
      else open();
    }

    menuBtn.addEventListener("click", (e) => {
      e.preventDefault();
      toggle();
    });

    menu.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      close();
    });

    document.addEventListener("click", (e) => {
      if (!isOpen()) return;
      const target = e.target;
      if (!(target instanceof Element)) return;

      const clickedInsideMenu = menu.contains(target);
      const clickedButton = menuBtn.contains(target);
      const clickedInsideContainer = container !== document && container.contains(target);

      if (clickedInsideMenu || clickedButton) return;
      if (container !== document && clickedInsideContainer) {
        close();
        return;
      }
      close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function setupClickTracking() {
    document.addEventListener("click", (e) => {
      const el = e.target instanceof Element ? e.target.closest("a,button") : null;
      if (!el) return;

      const text = (el.textContent || "").trim().slice(0, 120);

      if (el instanceof HTMLAnchorElement) {
        const href = (el.getAttribute("href") || "").trim();
        const fullHref = (el.href || href || "").trim();

        if (href.startsWith("tel:") || fullHref.startsWith("tel:")) {
          track("phone_click", { href: fullHref, text });
          return;
        }

        if (href.startsWith("mailto:") || fullHref.startsWith("mailto:")) {
          track("email_click", { href: fullHref, text });
          return;
        }

        if (text.toLowerCase().includes("quote") || href.toLowerCase().includes("quote")) {
          track("quote_form_open", { href: fullHref, text });
          return;
        }

        if (
          text.toLowerCase().includes("consultation") ||
          text.toLowerCase().includes("book") ||
          href.toLowerCase().includes("consult")
        ) {
          track("cta_click", { href: fullHref, text });
          return;
        }

        track("link_click", { href: fullHref, text });
        return;
      }

      if (el instanceof HTMLButtonElement) {
        const id = (el.id || "").toLowerCase();
        const cls = (el.className || "").toString().toLowerCase();

        if (text.toLowerCase().includes("quote") || id.includes("quote") || cls.includes("quote")) {
          track("quote_form_open", { text, id, className: el.className || "" });
          return;
        }

        if (text.toLowerCase().includes("consultation") || text.toLowerCase().includes("book")) {
          track("cta_click", { text, id, className: el.className || "" });
          return;
        }

        track("button_click", { text, id, className: el.className || "" });
      }
    });
  }

  function init() {
    setupMobileMenu();
    setupStickyNavShadow();
    setupActiveNavLink();
    setupClickTracking();
    setupExportButton();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
