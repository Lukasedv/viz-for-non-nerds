/* ============================================
   Main.js — Navigation, collapsibles, utilities
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initCollapsibles();
  initBeforeAfter();
  initFadeIn();
});

/* --- Mobile Navigation --- */
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }
}

/* --- Collapsible Sections --- */
function initCollapsibles() {
  document.querySelectorAll('.collapsible-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.collapsible').classList.toggle('open');
    });
  });
}

/* --- Before / After Toggles --- */
function initBeforeAfter() {
  document.querySelectorAll('.ba-toggle').forEach(toggle => {
    const buttons = toggle.querySelectorAll('button');
    const container = toggle.closest('.before-after');
    const charts = container.querySelectorAll('.ba-chart');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.target;
        charts.forEach(c => {
          c.classList.toggle('active', c.dataset.view === target);
        });
      });
    });
  });
}

/* --- Fade-in on scroll --- */
function initFadeIn() {
  const els = document.querySelectorAll('.fade-in');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  els.forEach(el => observer.observe(el));

  // Fallback: make all visible after 2s in case observer doesn't fire
  setTimeout(() => {
    els.forEach(el => el.classList.add('visible'));
  }, 2000);
}

/* --- Story Sequence Controller --- */
function createStorySequence(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  const steps = container.querySelectorAll('.story-step');
  const dots = container.querySelectorAll('.story-dot');
  const prevBtn = container.querySelector('.story-prev');
  const nextBtn = container.querySelector('.story-next');
  let current = 0;

  function show(index) {
    steps.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === steps.length - 1;
    current = index;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) show(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (current < steps.length - 1) show(current + 1); });

  show(0);
  return { show, getCurrent: () => current };
}
