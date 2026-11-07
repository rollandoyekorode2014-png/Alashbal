/**
 * Alashbal International School – main.js
 * All interactive behavior: nav, animations, forms, gallery, theme, language
 */

(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Preloader ---------- */
  function initPreloader() {
    const pre = $(".preloader");
    if (!pre) return;
    window.addEventListener("load", () => {
      setTimeout(() => {
        pre.classList.add("hidden");
        document.body.classList.add("loaded");
      }, prefersReduced ? 100 : 1200);
    });
    // Fallback
    setTimeout(() => {
      pre.classList.add("hidden");
      document.body.classList.add("loaded");
    }, 3500);
  }

  /* ---------- Theme (light / dark) ---------- */
  function initTheme() {
    const stored = localStorage.getItem("ais-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
    updateThemeIcons(theme);

    $$(".theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        const next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("ais-theme", next);
        updateThemeIcons(next);
      });
    });
  }

  function updateThemeIcons(theme) {
    $$(".theme-toggle").forEach((btn) => {
      const sun = btn.querySelector(".icon-sun");
      const moon = btn.querySelector(".icon-moon");
      if (sun && moon) {
        sun.style.display = theme === "dark" ? "block" : "none";
        moon.style.display = theme === "dark" ? "none" : "block";
      }
    });
  }

  /* ---------- Language EN / AR ---------- */
  function initLanguage() {
    const stored = localStorage.getItem("ais-lang") || "en";
    applyLang(stored);

    $$(".lang-toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("lang") || "en";
        const next = current === "en" ? "ar" : "en";
        localStorage.setItem("ais-lang", next);
        applyLang(next);
      });
    });
  }

  function applyLang(lang) {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    $$(".lang-toggle").forEach((btn) => {
      btn.textContent = lang === "en" ? "AR" : "EN";
      btn.setAttribute("aria-label", lang === "en" ? "Switch to Arabic" : "Switch to English");
    });
    // Note: full translation would require content dictionary; structure supports RTL
  }

  /* ---------- Header scroll ---------- */
  function initHeader() {
    const header = $(".site-header");
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 40) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Scroll progress ---------- */
  function initScrollProgress() {
    const bar = $(".scroll-progress");
    if (!bar) return;
    window.addEventListener(
      "scroll",
      () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
        bar.style.width = pct + "%";
      },
      { passive: true }
    );
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const toggle = $(".menu-toggle");
    const menu = $(".mobile-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", () => {
      const open = menu.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });

    $$("a", menu).forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (prefersReduced || window.matchMedia("(hover: none)").matches) return;
    const dot = $(".cursor-dot");
    const ring = $(".cursor-ring");
    if (!dot || !ring) return;

    document.body.classList.add("has-custom-cursor");
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    function animateRing() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(animateRing);
    }
    animateRing();
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (prefersReduced || window.matchMedia("(hover: none)").matches) return;
    $$(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- 3D Tilt cards ---------- */
  function initTilt() {
    if (prefersReduced || window.matchMedia("(hover: none)").matches) return;
    $$(".tilt-card").forEach((card) => {
      const inner = card.querySelector(".tilt-inner") || card;
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotX = (0.5 - y) * 12;
        const rotY = (x - 0.5) * 12;
        inner.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
      });
      card.addEventListener("mouseleave", () => {
        inner.style.transform = "";
      });
    });
  }

  /* ---------- IntersectionObserver reveals ---------- */
  function initReveals() {
    if (prefersReduced) {
      $$(".reveal, .stagger, .section-title").forEach((el) => el.classList.add("revealed"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    $$(".reveal, .stagger, .section-title").forEach((el) => io.observe(el));
  }

  /* ---------- Stat counters ---------- */
  function initCounters() {
    const counters = $$("[data-count]");
    if (!counters.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const target = parseInt(el.getAttribute("data-count"), 10);
          const suffix = el.getAttribute("data-suffix") || "";
          const prefix = el.getAttribute("data-prefix") || "";
          const duration = 1800;
          const start = performance.now();

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(eased * target);
            el.textContent = prefix + val.toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + target.toLocaleString() + suffix;
          }
          if (prefersReduced) {
            el.textContent = prefix + target.toLocaleString() + suffix;
          } else {
            requestAnimationFrame(tick);
          }
          io.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => io.observe(c));
  }

  /* ---------- Hero word reveal ---------- */
  function initHeroWords() {
    const title = $(".hero-title");
    if (!title || prefersReduced) return;
    const text = title.getAttribute("data-text") || title.textContent;
    title.innerHTML = "";
    const words = text.trim().split(/\s+/);
    words.forEach((word, i) => {
      const wrap = document.createElement("span");
      wrap.className = "word";
      const span = document.createElement("span");
      span.textContent = word;
      span.style.animationDelay = 0.4 + i * 0.08 + "s";
      wrap.appendChild(span);
      title.appendChild(wrap);
      title.appendChild(document.createTextNode(" "));
    });
  }

  /* ---------- Parallax / mouse blobs ---------- */
  function initParallax() {
    if (prefersReduced) return;
    const hero = $(".hero");
    if (!hero) return;
    const blobs = $$(".blob", hero);
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      blobs.forEach((b, i) => {
        const speed = (i + 1) * 8;
        b.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  /* ---------- Floating Apply button ---------- */
  function initFloatApply() {
    const btn = $(".float-apply");
    if (!btn) return;
    window.addEventListener(
      "scroll",
      () => {
        if (window.scrollY > 600) btn.classList.add("visible");
        else btn.classList.remove("visible");
      },
      { passive: true }
    );
  }

  /* ---------- Tabs (Academics) ---------- */
  function initTabs() {
    const tabs = $$(".tab-btn");
    if (!tabs.length) return;
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");
        tabs.forEach((t) => {
          t.classList.remove("active");
          t.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        $$(".tab-panel").forEach((p) => {
          p.classList.toggle("active", p.id === target);
        });
      });
    });
  }

  /* ---------- Accordion ---------- */
  function initAccordion() {
    $$(".accordion-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".accordion-item");
        const open = item.classList.contains("open");
        // Close others in same accordion
        const parent = item.closest(".accordion");
        if (parent) {
          $$(".accordion-item", parent).forEach((i) => {
            i.classList.remove("open");
            const b = i.querySelector(".accordion-btn");
            if (b) b.setAttribute("aria-expanded", "false");
          });
        }
        if (!open) {
          item.classList.add("open");
          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* ---------- Gallery filter + lightbox ---------- */
  function initGallery() {
    const filters = $$(".filter-btn");
    const items = $$(".gallery-item");
    if (!items.length) return;

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((f) => f.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.getAttribute("data-filter");
        items.forEach((item) => {
          const match = cat === "all" || item.getAttribute("data-category") === cat;
          item.classList.toggle("hide", !match);
        });
      });
    });

    // Lightbox
    const lb = $(".lightbox");
    if (!lb) return;
    const lbImg = $(".lightbox-img", lb);
    const lbCap = $(".lightbox-caption", lb);
    let currentIndex = 0;
    let visibleItems = [];

    function openLightbox(index) {
      visibleItems = items.filter((i) => !i.classList.contains("hide"));
      currentIndex = index;
      const item = visibleItems[currentIndex];
      if (!item) return;
      const img = item.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = img.alt || "";
      lb.classList.add("open");
      document.body.style.overflow = "hidden";
    }

    function closeLightbox() {
      lb.classList.remove("open");
      document.body.style.overflow = "";
    }

    function navLightbox(dir) {
      currentIndex = (currentIndex + dir + visibleItems.length) % visibleItems.length;
      const item = visibleItems[currentIndex];
      const img = item.querySelector("img");
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      if (lbCap) lbCap.textContent = img.alt || "";
    }

    items.forEach((item, i) => {
      item.addEventListener("click", () => {
        const visible = items.filter((it) => !it.classList.contains("hide"));
        const idx = visible.indexOf(item);
        openLightbox(idx >= 0 ? idx : i);
      });
    });

    $(".lightbox-close", lb)?.addEventListener("click", closeLightbox);
    $(".lightbox-prev", lb)?.addEventListener("click", () => navLightbox(-1));
    $(".lightbox-next", lb)?.addEventListener("click", () => navLightbox(1));
    lb.addEventListener("click", (e) => {
      if (e.target === lb) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navLightbox(-1);
      if (e.key === "ArrowRight") navLightbox(1);
    });
  }

  /* ---------- Multi-step form (Apply) ---------- */
  function initMultiStepForm() {
    const form = $("#apply-form");
    if (!form) return;

    const steps = $$(".form-step", form);
    const progressBar = $(".form-progress-bar");
    const progressSteps = $$(".progress-step");
    let current = 0;

    function showStep(n) {
      steps.forEach((s, i) => s.classList.toggle("active", i === n));
      progressSteps.forEach((ps, i) => {
        ps.classList.toggle("active", i === n);
        ps.classList.toggle("done", i < n);
      });
      if (progressBar) {
        progressBar.style.width = (n / (steps.length - 1)) * 100 + "%";
      }
      current = n;
      window.scrollTo({ top: form.offsetTop - 100, behavior: "smooth" });
    }

    function validateStep(n) {
      const step = steps[n];
      let valid = true;
      $$("[required]", step).forEach((input) => {
        const err = input.classList.contains("error");
        if (!input.value.trim()) {
          input.classList.add("error");
          valid = false;
        } else {
          input.classList.remove("error");
        }
        if (input.type === "email" && input.value) {
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
          if (!ok) {
            input.classList.add("error");
            valid = false;
          }
        }
      });
      return valid;
    }

    $$(".form-next", form).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (validateStep(current) && current < steps.length - 1) {
          showStep(current + 1);
        }
      });
    });

    $$(".form-prev", form).forEach((btn) => {
      btn.addEventListener("click", () => {
        if (current > 0) showStep(current - 1);
      });
    });

    // File upload UI
    const fileInput = $("#doc-upload");
    const fileZone = $(".file-upload");
    const fileName = $(".file-name");
    if (fileInput && fileZone) {
      fileZone.addEventListener("click", () => fileInput.click());
      fileZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        fileZone.classList.add("dragover");
      });
      fileZone.addEventListener("dragleave", () => fileZone.classList.remove("dragover"));
      fileZone.addEventListener("drop", (e) => {
        e.preventDefault();
        fileZone.classList.remove("dragover");
        if (e.dataTransfer.files.length) {
          fileInput.files = e.dataTransfer.files;
          if (fileName) fileName.textContent = e.dataTransfer.files[0].name;
        }
      });
      fileInput.addEventListener("change", () => {
        if (fileName && fileInput.files.length) {
          fileName.textContent = fileInput.files[0].name;
        }
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      // Honeypot check
      const hp = form.querySelector(".honeypot input");
      if (hp && hp.value) return;

      if (!validateStep(current)) return;

      // Success state
      form.style.display = "none";
      const success = $(".form-success");
      if (success) success.classList.add("show");

      // Optional: mailto fallback
      // In production, replace with real endpoint
      const formData = new FormData(form);
      console.log("Application submitted (placeholder):", Object.fromEntries(formData));
    });

    showStep(0);
  }

  /* ---------- Contact form ---------- */
  function initContactForm() {
    const form = $("#contact-form");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const hp = form.querySelector(".honeypot input");
      if (hp && hp.value) return;

      let valid = true;
      $$("[required]", form).forEach((input) => {
        if (!input.value.trim()) {
          input.classList.add("error");
          valid = false;
        } else {
          input.classList.remove("error");
        }
      });
      if (!valid) return;

      const success = form.querySelector(".form-success") || $(".form-success");
      form.style.display = "none";
      if (success) {
        success.classList.add("show");
        success.style.display = "block";
      }
      console.log("Contact form submitted (placeholder)");
    });
  }

  /* ---------- Timeline draw on scroll ---------- */
  function initTimeline() {
    const line = $(".timeline-line");
    const timeline = $(".timeline");
    if (!line || !timeline) return;

    const items = $$(".timeline-item", timeline);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.3 }
    );
    items.forEach((item) => io.observe(item));

    window.addEventListener(
      "scroll",
      () => {
        const rect = timeline.getBoundingClientRect();
        const winH = window.innerHeight;
        const progress = Math.min(Math.max((winH - rect.top) / (rect.height + winH * 0.3), 0), 1);
        line.style.height = progress * 100 + "%";
      },
      { passive: true }
    );
  }

  /* ---------- Page transitions ---------- */
  function initPageTransitions() {
    if (prefersReduced) return;
    const overlay = $(".page-transition");
    if (!overlay) return;

    $$("a[href]").forEach((link) => {
      const href = link.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("http") ||
        link.target === "_blank"
      )
        return;

      link.addEventListener("click", (e) => {
        // Same page
        if (href === window.location.pathname.split("/").pop() || href === "./" || href === "index.html")
          return;
        e.preventDefault();
        overlay.classList.add("active");
        setTimeout(() => {
          window.location.href = href;
        }, 450);
      });
    });
  }

  /* ---------- Active nav link ---------- */
  function initActiveNav() {
    const path = window.location.pathname.split("/").pop() || "index.html";
    $$(".nav-desktop a, .mobile-menu a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href === path || (path === "" && href === "index.html")) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Init all ---------- */
  function init() {
    initPreloader();
    initTheme();
    initLanguage();
    initHeader();
    initScrollProgress();
    initMobileMenu();
    initCursor();
    initMagnetic();
    initTilt();
    initReveals();
    initCounters();
    initHeroWords();
    initParallax();
    initFloatApply();
    initTabs();
    initAccordion();
    initGallery();
    initMultiStepForm();
    initContactForm();
    initTimeline();
    initPageTransitions();
    initActiveNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
