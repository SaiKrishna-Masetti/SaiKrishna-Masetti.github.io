// ========== Utilities ==========
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ========== Year ==========
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ========== Mobile Nav ==========
const toggle = $(".nav-toggle");
const menu = $("#nav-menu");
if (toggle) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("open");
  });
  // Close menu on link click
  $$(".main-nav a").forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ========== Scroll Reveal ==========
const revealEls = $$(".reveal");
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

// ========== Count-Up Stats ==========
function animateCountUp(el) {
  const target = parseInt(el.getAttribute("data-countto") || "0", 10);
  const suffix = el.getAttribute("data-suffix") || "";
  const duration = 2000;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);

    if (target >= 1000000) {
      el.textContent = (current / 1000000).toFixed(1) + "M" + suffix;
    } else if (target >= 10000) {
      el.textContent = (current / 1000).toFixed(1) + "K" + suffix;
    } else {
      el.textContent = current.toLocaleString() + suffix;
    }

    if (progress < 1) requestAnimationFrame(tick);
  }

  if (reducedMotion) {
    if (target >= 1000000) el.textContent = "1M" + suffix;
    else if (target >= 10000) el.textContent = (target / 1000).toFixed(1) + "K" + suffix;
    else el.textContent = target.toLocaleString() + suffix;
  } else {
    requestAnimationFrame(tick);
  }
}

const statEls = $$(".stat-number");
if (statEls.length) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animateCountUp(e.target);
          statObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  statEls.forEach((el) => statObserver.observe(el));
}

// ========== Skill Bar Animation ==========
const skillBars = $$(".skill-bar");
if (skillBars.length) {
  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const level = e.target.getAttribute("data-level") || "0";
          const fill = $(".skill-bar-fill", e.target);
          if (fill) {
            if (reducedMotion) {
              fill.style.transition = "none";
            }
            // Small delay for visual effect
            setTimeout(() => {
              fill.style.width = level + "%";
            }, 100);
          }
          skillObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  skillBars.forEach((el) => skillObserver.observe(el));
}

// ========== Terminal Typing Effect ==========
(function terminalTyper() {
  if (reducedMotion) {
    const el = $("#typed-output");
    if (el) el.textContent = "SOC Analyst | Security Engineer";
    const cursor = $("#terminal-cursor");
    if (cursor) cursor.style.display = "none";
    return;
  }

  const el = $("#typed-output");
  const cursor = $("#terminal-cursor");
  if (!el) return;

  const lines = [
    "SOC Analyst | Security Engineer",
    "SIEM: Splunk · Wazuh · QRadar · Sentinel",
    "1M+ honeypot events captured & analyzed",
    "MITRE ATT&CK · NIST CSF · ISO 27001",
    "CompTIA Security+ | (ISC)² CC Certified",
  ];

  let lineIdx = 0, charIdx = 0, deleting = false, pause = 0;
  const typeSpeed = 55, deleteSpeed = 30, linePause = 2200, deletePause = 600;

  function tick() {
    if (pause > 0) { pause -= 16; requestAnimationFrame(tick); return; }
    const currentLine = lines[lineIdx];

    if (!deleting) {
      charIdx++;
      el.textContent = currentLine.slice(0, charIdx);
      if (charIdx >= currentLine.length) {
        deleting = true;
        pause = linePause;
      }
    } else {
      charIdx--;
      el.textContent = currentLine.slice(0, charIdx);
      if (charIdx <= 0) {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
        pause = deletePause;
      }
    }
    requestAnimationFrame(() => setTimeout(tick, deleting ? deleteSpeed : typeSpeed));
  }
  tick();
})();

// ========== ScrollSpy ==========
(function scrollSpy() {
  const sections = $$("section[id], main[id]");
  const navLinks = $$(".main-nav a[href^='#']");
  let ticking = false;

  function update() {
    let current = "";
    sections.forEach((sec) => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) current = sec.getAttribute("id");
    });
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
})();

// ========== Matrix Rain ==========
(function matrixRain() {
  if (reducedMotion) return;

  const c = $("#matrix");
  if (!c) return;
  const ctx = c.getContext("2d");
  let w, h, cols, drops, fontSize;
  const isMobile = window.innerWidth < 768;

  const letters = "01#=/*\\-_|<>{}[]()$&@%ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  function resize() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    fontSize = Math.max(14, Math.floor(w / (isMobile ? 50 : 90)));
    cols = Math.floor(w / fontSize);
    drops = new Array(cols).fill(1);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  resize();

  let frameCount = 0;
  let paused = false;

  function draw() {
    if (paused) { requestAnimationFrame(draw); return; }

    // Skip frames on mobile for performance
    frameCount++;
    if (isMobile && frameCount % 2 !== 0) {
      requestAnimationFrame(draw);
      return;
    }

    ctx.fillStyle = "rgba(10, 10, 10, 0.08)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#00ff41";
    ctx.font = fontSize + "px Fira Code, monospace";

    drops.forEach((y, i) => {
      const text = letters[Math.floor(Math.random() * letters.length)];
      const x = i * fontSize;
      // Vary brightness
      const brightness = Math.random();
      if (brightness > 0.95) {
        ctx.fillStyle = "#ffffff";
      } else if (brightness > 0.7) {
        ctx.fillStyle = "#00ff41";
      } else {
        ctx.fillStyle = "rgba(0, 255, 65, 0.4)";
      }
      ctx.fillText(text, x, y * fontSize);
      if (y * fontSize > h && Math.random() > 0.975) drops[i] = 0;
      drops[i] = y + 1;
    });
    requestAnimationFrame(draw);
  }
  draw();

  // Pause when tab is hidden
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
  });
})();

// ========== Particle Network ==========
(function particleNetwork() {
  if (reducedMotion) return;

  const c = $("#particles");
  if (!c) return;
  const ctx = c.getContext("2d");
  let w, h;
  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 30 : 60;
  const connectionDistance = isMobile ? 100 : 150;
  let particles = [];
  let paused = false;
  let mouse = { x: null, y: null };

  function resize() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
  resize();

  // Track mouse for interactive connections
  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 1.5 + 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w) this.vx *= -1;
      if (this.y < 0 || this.y > h) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 255, 65, 0.5)";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  let frameCount = 0;

  function animate() {
    if (paused) { requestAnimationFrame(animate); return; }

    frameCount++;
    if (isMobile && frameCount % 2 !== 0) {
      requestAnimationFrame(animate);
      return;
    }

    ctx.clearRect(0, 0, w, h);

    particles.forEach((p) => {
      p.update();
      p.draw();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance) {
          const opacity = 1 - dist / connectionDistance;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 65, ${opacity * 0.15})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Mouse connection
      if (mouse.x !== null) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < connectionDistance * 1.5) {
          const opacity = 1 - dist / (connectionDistance * 1.5);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity * 0.3})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
  });
})();

// ========== Smooth Scroll for Nav Links ==========
$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    }
  });
});
