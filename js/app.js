(() => {
  const config = window.OPERATOR_CONFIG || { ctaUrl: "#founding" };
  const fired = new Set();

  function track(event, payload) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...payload });
    document.dispatchEvent(new CustomEvent("operator:track", { detail: { event, payload } }));
  }

  function bindCtas() {
    document.querySelectorAll("[data-cta]").forEach((el) => {
      if (el.tagName === "A") el.setAttribute("href", config.ctaUrl);
      el.addEventListener("click", () => {
        const source = el.getAttribute("data-cta") || "cta";
        track("founding_access_click", { source });
        if (source === "hero") track("hero_cta_click", { source });
        if (config.ctaUrl && config.ctaUrl !== "#founding") {
          track("checkout_started", { source });
          track("application_started", { source });
        }
      });
    });
  }

  const menuBtn = document.querySelector(".menu-btn");
  const mobileNav = document.querySelector(".mobile-nav");
  menuBtn?.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  mobileNav?.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => mobileNav.classList.remove("open"))
  );

  document.querySelectorAll(".faq details").forEach((d) => {
    d.addEventListener("toggle", () => {
      if (d.open) track("faq_open", { question: d.querySelector("summary")?.textContent?.trim() });
    });
  });

  const sticky = document.querySelector(".sticky-cta");
  const hero = document.querySelector(".hero");
  const onScroll = () => {
    const y = window.scrollY;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? y / max : 0;
    if (pct >= 0.5 && !fired.has("scroll_50")) {
      fired.add("scroll_50");
      track("scroll_50");
    }
    if (pct >= 0.9 && !fired.has("scroll_90")) {
      fired.add("scroll_90");
      track("scroll_90");
    }
    if (sticky && hero && window.innerWidth < 760) {
      const past = y > hero.offsetHeight - 40;
      sticky.classList.toggle("show", past);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  document.querySelectorAll("[data-legal]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = btn.getAttribute("data-legal");
      document.getElementById(id)?.classList.add("open");
    });
  });
  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", () => btn.closest(".legal")?.classList.remove("open"));
  });
  document.querySelectorAll(".legal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("open");
    });
  });

  track("page_view");
  bindCtas();
})();
