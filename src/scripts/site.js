import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/* ------------------------------------------------------------------ */
/*  WeStack global motion engine (single init — guarded).              */
/*  Lenis smooth scroll + GSAP/ScrollTrigger + cursor + magnetic +     */
/*  reveals + header state + hero ready signal.                        */
/* ------------------------------------------------------------------ */

if (!window.__wsEngine) {
  window.__wsEngine = true;

  gsap.registerPlugin(ScrollTrigger);

  const reduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer =
    window.matchMedia && window.matchMedia("(pointer: fine)").matches;

  /* ------------------------------ Lenis ----------------------------- */
  let lenis = null;
  if (!reduced) {
    lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    document.documentElement.classList.add("lenis");
  }

  /* --------------------------- Header state ------------------------- */
  const header = document.getElementById("site-header");
  if (header) {
    const onScroll = () => {
      const y = lenis ? lenis.scroll : window.scrollY;
      header.classList.toggle("scrolled", y > 12);
    };
    ScrollTrigger.create({ start: 0, end: "max", onUpdate: onScroll });
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ----------------------- Anchor links via Lenis ------------------- */
  if (lenis) {
    document.addEventListener("click", (e) => {
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -64, duration: 1.4 });
    });
  }

  /* ---------------------------- Custom cursor ----------------------- */
  if (!reduced && finePointer) {
    document.body.classList.add("no-cursor");
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    document.body.append(dot, ring);

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3.out" });

    window.addEventListener(
      "mousemove",
      (e) => {
        dotX(e.clientX - 3);
        dotY(e.clientY - 3);
        ringX(e.clientX - 17);
        ringY(e.clientY - 17);
      },
      { passive: true },
    );

    document.addEventListener(
      "mouseover",
      (e) => {
        const interactive = e.target.closest("a, button, [data-cursor]");
        ring.classList.toggle("cursor-hover", !!interactive);
      },
      { passive: true },
    );

    document.addEventListener("mouseleave", () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    });
    document.addEventListener("mouseenter", () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    });
  }

  /* ------------------------- Magnetic elements ---------------------- */
  if (!reduced && finePointer) {
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const strength = Number(el.dataset.magnetic || 0.35);
      const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3.out" });

      el.addEventListener(
        "mousemove",
        (e) => {
          const r = el.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(dx * strength);
          yTo(dy * strength);
        },
        { passive: true },
      );
      el.addEventListener("mouseleave", () => {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* ------------------------ Generic .reveal scroll-in --------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduced) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    revealEls.forEach((el) => {
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => el.classList.add("is-visible"),
      });
    });
  }

  /* ------------------------- Hero ready signal --------------------- */
  window.__wsReady = true;
  document.dispatchEvent(new CustomEvent("ws:ready"));

  /* ---------------------- Word / line mask helpers ------------------ */
  function splitWords(el) {
    const text = el.textContent.trim().replace(/\s+/g, " ");
    el.textContent = "";
    text.split(" ").forEach((word) => {
      const w = document.createElement("span");
      w.className = "word";
      const inner = document.createElement("span");
      inner.textContent = word;
      w.appendChild(inner);
      el.appendChild(w);
      el.appendChild(document.createTextNode(" "));
    });
    return el.querySelectorAll(".word > span");
  }

  window.__ws = { gsap, ScrollTrigger, lenis, splitWords };
}

export { gsap, ScrollTrigger };
