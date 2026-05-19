/* global React, gsap, ScrollTrigger */
// District Boutique — GSAP scroll choreography
//
// Public hooks (exported via window):
//   useScrollReveal()        — top-level: registers all the page-wide effects
//   useImageCurtain(ref)     — clip-path reveal on a single image
//
// Effects:
//   [data-reveal="lines"]    — split into lines, mask up
//   [data-reveal="fade-up"]  — soft fade + translateY
//   [data-reveal="curtain"]  — clip-path bottom→top reveal
//   [data-reveal="stagger"]  — children stagger fade-up
//   [data-parallax="0.X"]    — scrub parallax on background-image element
//   [data-count]             — counter that animates to data-count when in view
//   [data-pin]               — section pinned + content fades through scrub

(function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("[gsap] not loaded yet");
    return;
  }
  gsap.registerPlugin(ScrollTrigger);
  if (typeof SplitText !== "undefined") gsap.registerPlugin(SplitText);

  function killAll() {
    ScrollTrigger.getAll().forEach((s) => s.kill());
  }

  function splitTextSafely(el) {
    // Walk text nodes only, wrap each word in a span — preserves nested elements
    // (e.g. <em> inside the heading) instead of corrupting innerHTML with regex.
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) {
      // Skip nodes that already contain only whitespace
      if (n.nodeValue && n.nodeValue.trim()) textNodes.push(n);
    }
    const wrapped = [];
    textNodes.forEach((tn) => {
      const frag = document.createDocumentFragment();
      // Preserve leading/trailing whitespace; split on word runs
      const parts = tn.nodeValue.split(/(\s+)/);
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          const span = document.createElement("span");
          span.className = "split-word";
          span.textContent = part;
          frag.appendChild(span);
          wrapped.push(span);
        }
      });
      tn.parentNode.replaceChild(frag, tn);
    });
    return wrapped;
  }

  function setupReveals() {
    // ----- lines (use SplitText if present, else safe word-walker) -----
    document.querySelectorAll('[data-reveal="lines"]').forEach((el) => {
      if (el.dataset.split === "1") return;
      el.dataset.split = "1";

      let targets;
      if (typeof SplitText !== "undefined") {
        const split = new SplitText(el, { type: "lines", linesClass: "split-line" });
        targets = split.lines;
      } else {
        targets = splitTextSafely(el);
      }
      if (!targets || !targets.length) return;
      gsap.set(targets, { yPercent: 110, opacity: 0 });
      gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.04,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });

    // ----- fade-up -----
    gsap.utils.toArray('[data-reveal="fade-up"]').forEach((el) => {
      const delay = parseFloat(el.dataset.delay || 0);
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          delay,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%" },
        }
      );
    });

    // ----- stagger children -----
    gsap.utils.toArray('[data-reveal="stagger"]').forEach((el) => {
      const kids = el.children;
      gsap.fromTo(
        kids,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    // ----- curtain (clip-path reveal) -----
    gsap.utils.toArray('[data-reveal="curtain"]').forEach((el) => {
      gsap.fromTo(
        el,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
      // Subtle scale on inner image for "settle" effect
      const inner = el.querySelector(".curtain-inner") || el;
      gsap.fromTo(
        inner,
        { scale: 1.18 },
        {
          scale: 1,
          duration: 1.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        }
      );
    });

    // ----- parallax on images -----
    gsap.utils.toArray("[data-parallax]").forEach((el) => {
      const factor = parseFloat(el.dataset.parallax) || 0.2;
      gsap.fromTo(
        el,
        { yPercent: -factor * 50 },
        {
          yPercent: factor * 50,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    });

    // ----- counters -----
    gsap.utils.toArray("[data-count]").forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || "";
      const decimals = parseInt(el.dataset.decimals || 0, 10);
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 1.8,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 85%" },
        onUpdate: () => {
          el.textContent = obj.v.toFixed(decimals) + suffix;
        },
      });
    });

    // ----- hero parallax (subtle) -----
    const heroMedia = document.querySelector(".hero-media");
    if (heroMedia) {
      gsap.to(heroMedia, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    // ----- room images: subtle parallax scrub on enter -----
    gsap.utils.toArray(".room-card").forEach((card) => {
      const img = card.querySelector(".room-image");
      if (!img) return;
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
        }
      );
    });

    // ----- nav background on scroll handled in React; nothing here -----

    ScrollTrigger.refresh();
  }

  // Public init — call after React mount
  window.DBAnimations = {
    init() {
      killAll();
      // Wait one frame for React DOM to settle
      requestAnimationFrame(() => {
        setupReveals();
      });
    },
    refresh: () => ScrollTrigger.refresh(),
    kill: killAll,
  };
})();
