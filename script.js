// Utilities
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];

// Year
$("#year").textContent = new Date().getFullYear();

// Mobile nav
const toggle = $(".nav-toggle");
const menu = $("#nav-menu");
if (toggle) {
  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    menu.classList.toggle("open");
  });
}

// Count-up stat (fun, not real telemetry)
const stat = $(".stat-number");
if (stat) {
  const target = parseFloat(stat.getAttribute("data-countto") || "100.0");
  let cur = 0, step = target / 120;
  const tick = () => {
    cur = Math.min(cur + step, target);
    stat.textContent = cur.toFixed(2);
    if (cur < target) requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { tick(); io.disconnect(); }
  }, { threshold: 0.5 });
  io.observe(stat);
}

// Scroll reveal
const revealEls = $$(".reveal");
const io2 = new IntersectionObserver((entries)=>{
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
}, { threshold: 0.18 });
revealEls.forEach(el => io2.observe(el));

// Matrix rain background
(function matrixRain() {
  const c = document.getElementById("matrix");
  const ctx = c.getContext("2d");
  let w, h, cols, drops, fontSize;

  const letters = "01#=/*\\-_|<>{}[]()$&@%ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  function resize() {
    w = c.width = window.innerWidth;
    h = c.height = window.innerHeight;
    fontSize = Math.max(14, Math.floor(w / 90));
    cols = Math.floor(w / fontSize);
    drops = new Array(cols).fill(1);
  }
  resize();
  window.addEventListener("resize", resize);

  function draw() {
    ctx.fillStyle = "rgba(7,11,10,0.08)";
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#00f5c4";
    ctx.font = fontSize + "px JetBrains Mono, monospace";

    drops.forEach((y, i) => {
      const text = letters[Math.floor(Math.random() * letters.length)];
      const x = i * fontSize;
      ctx.fillText(text, x, y * fontSize);
      if (y * fontSize > h && Math.random() > 0.975) drops[i] = 0;
      drops[i] = y + 1;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();
