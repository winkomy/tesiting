(function () {
  "use strict";

  const VERSION = "20260923-motion1";
  const scriptEl = document.currentScript;
  const scriptUrl = scriptEl?.src ? new URL(scriptEl.src, window.location.href) : new URL("motion.js", window.location.href);
  const asset = (path) => new URL(path, scriptUrl).href;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isHome = document.body?.dataset?.page === "home";

  function loadCss() {
    if (document.querySelector('link[data-winko-motion-css]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = asset(`motion.css?v=${VERSION}`);
    link.dataset.winkoMotionCss = "";
    document.head.appendChild(link);
  }

  function loadScript(src, readyTest) {
    if (readyTest?.()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const existing = Array.from(document.scripts).find((node) => node.src === src);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        if (readyTest?.()) resolve();
        return;
      }
      const node = document.createElement("script");
      node.src = src;
      node.async = true;
      node.crossOrigin = "anonymous";
      node.onload = resolve;
      node.onerror = reject;
      document.head.appendChild(node);
    });
  }

  function safeRun(label, task) {
    try {
      return task();
    } catch (error) {
      console.warn(`[WINKO motion] ${label} skipped`, error);
      return null;
    }
  }

  function setupLenis() {
    if (reducedMotion || !window.Lenis) return null;

    const lenis = new window.Lenis({
      duration: 1.04,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      anchors: { offset: -82 }
    });

    let rafId = 0;
    const raf = (time) => {
      lenis.raf(time);
      rafId = window.requestAnimationFrame(raf);
    };
    rafId = window.requestAnimationFrame(raf);

    window.addEventListener("pagehide", () => {
      window.cancelAnimationFrame(rafId);
      lenis.destroy?.();
    }, { once: true });

    return lenis;
  }

  function setupGsap(lenis) {
    if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);

    if (lenis) lenis.on("scroll", ScrollTrigger.update);

    const hero = document.querySelector(".hero--cinematic");
    if (hero) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const heroCopy = hero.querySelector(".hero-copy");
      const heroItems = heroCopy
        ? heroCopy.querySelectorAll(":scope > .eyebrow, :scope > h1, :scope > .hero-lede, :scope > .hero-actions, :scope > .hero-note")
        : [];

      tl.from(heroItems, {
        y: 34,
        opacity: 0,
        duration: 0.85,
        stagger: 0.08,
        clearProps: "transform,opacity"
      });

      const video = hero.querySelector(".hero-intro-video-panel");
      if (video) tl.from(video, { x: 28, opacity: 0, duration: 0.72, clearProps: "transform,opacity" }, "-=0.55");

      const tank = hero.querySelector(".hero-media--tank");
      if (tank) tl.from(tank, { y: 28, scale: 0.985, opacity: 0, duration: 0.8, clearProps: "transform,opacity" }, "-=0.48");

      const approvals = hero.querySelector(".hero-approvals");
      if (approvals) tl.from(approvals, { y: 18, opacity: 0, duration: 0.55, clearProps: "transform,opacity" }, "-=0.42");
    }

    const revealGroups = [
      ".story-grid > *",
      ".section-heading > *",
      ".assembly-shell > *",
      ".sustainability-grid > *",
      ".projects-intro > *",
      ".global-reach-heading > *",
      ".global-reach-grid > *",
      ".cta-inner > *"
    ];

    revealGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        gsap.from(element, {
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
          y: 30,
          opacity: 0,
          duration: 0.72,
          ease: "power2.out",
          clearProps: "transform,opacity"
        });
      });
    });

    const batchSelectors = [
      ".trust-stat",
      ".why-row",
      ".project-card",
      ".sustainability-list article",
      ".reach-pill-list article"
    ];

    batchSelectors.forEach((selector) => {
      if (!document.querySelector(selector)) return;
      ScrollTrigger.batch(selector, {
        start: "top 92%",
        once: true,
        interval: 0.08,
        batchMax: 6,
        onEnter: (batch) => gsap.from(batch, {
          y: 26,
          opacity: 0,
          duration: 0.64,
          stagger: 0.07,
          ease: "power2.out",
          clearProps: "transform,opacity"
        })
      });
    });

    document.querySelectorAll(".project-card img, .story-visual > img, .sustainability-visual > img").forEach((image) => {
      gsap.fromTo(image,
        { yPercent: -2.5 },
        {
          yPercent: 2.5,
          ease: "none",
          scrollTrigger: {
            trigger: image,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.55
          }
        }
      );
    });

    if (finePointer) {
      document.querySelectorAll(".button, .hero-text-link, .text-link").forEach((element) => {
        element.classList.add("winko-magnetic");
        const xTo = gsap.quickTo(element, "x", { duration: 0.28, ease: "power3.out" });
        const yTo = gsap.quickTo(element, "y", { duration: 0.28, ease: "power3.out" });

        element.addEventListener("pointermove", (event) => {
          const rect = element.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width - 0.5) * 9;
          const y = ((event.clientY - rect.top) / rect.height - 0.5) * 7;
          xTo(x);
          yTo(y);
        });
        element.addEventListener("pointerleave", () => { xTo(0); yTo(0); });
      });
    }

    window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  }

  function setupSpotlights() {
    if (!finePointer || reducedMotion) return;
    const selector = [
      ".trust-stat",
      ".product-panel-card",
      ".why-row",
      ".project-card",
      ".reach-pill-list article",
      ".sustainability-list article",
      ".market-map"
    ].join(",");

    document.querySelectorAll(selector).forEach((element) => {
      element.classList.add("winko-spotlight", "winko-motion-lift");
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        element.style.setProperty("--winko-pointer-x", `${event.clientX - rect.left}px`);
        element.style.setProperty("--winko-pointer-y", `${event.clientY - rect.top}px`);
      });
    });
  }

  async function setupVanta() {
    if (!isHome || reducedMotion || window.innerWidth < 900) return;
    if (navigator.deviceMemory && navigator.deviceMemory < 4) return;

    const hero = document.querySelector(".hero--cinematic");
    if (!hero || hero.querySelector(".winko-vanta-layer")) return;

    const layer = document.createElement("div");
    layer.className = "winko-vanta-layer";
    layer.setAttribute("aria-hidden", "true");
    hero.prepend(layer);

    try {
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js",
        () => Boolean(window.THREE?.WebGLRenderer)
      );
      await loadScript(
        "https://cdn.jsdelivr.net/npm/vanta@0.5.24/dist/vanta.net.min.js",
        () => Boolean(window.VANTA?.NET)
      );

      if (!window.VANTA?.NET) return;
      const effect = window.VANTA.NET({
        el: layer,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 200,
        minWidth: 200,
        scale: 1,
        scaleMobile: 1,
        color: 0xff7300,
        backgroundColor: 0x0d1214,
        backgroundAlpha: 0,
        points: 6,
        maxDistance: 17,
        spacing: 20,
        showDots: false
      });

      window.addEventListener("pagehide", () => effect?.destroy?.(), { once: true });
    } catch (error) {
      layer.remove();
      console.warn("[WINKO motion] Vanta background skipped", error);
    }
  }

  async function boot() {
    loadCss();
    document.documentElement.classList.add("winko-motion");

    setupSpotlights();
    setupVanta();

    if (reducedMotion) return;

    try {
      await Promise.all([
        loadScript("https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js", () => Boolean(window.Lenis)),
        loadScript("https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/gsap.min.js", () => Boolean(window.gsap))
      ]);
      await loadScript(
        "https://cdn.jsdelivr.net/npm/gsap@3.13.0/dist/ScrollTrigger.min.js",
        () => Boolean(window.ScrollTrigger)
      );

      const lenis = safeRun("Lenis", setupLenis);
      safeRun("GSAP", () => setupGsap(lenis));
    } catch (error) {
      console.warn("[WINKO motion] external motion libraries unavailable; base site remains active", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
