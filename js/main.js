/* ============================================
   Main.js — Navigation, collapsibles, utilities
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initCollapsibles();
  initBeforeAfter();
  initFadeIn();
});

/* --- Theme Management --- */
function initTheme() {
  const btn = document.getElementById('theme-toggle');

  // Remove no-transition class after first paint so subsequent changes animate
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.remove('no-transition');
    });
  });

  function getEffectiveTheme(pref) {
    if (pref === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return pref;
  }

  function applyTheme(theme) {
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', theme);

    if (btn) {
      const isDark = theme === 'dark';
      btn.innerHTML = `<span aria-hidden="true">${isDark ? '☀️' : '🌙'}</span>`;
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        isDark ? 'Dark mode active — switch to light mode' : 'Light mode active — switch to dark mode'
      );
    }

    // Notify chart helpers to update if available
    if (typeof applyThemeToCharts === 'function') {
      applyThemeToCharts();
    }

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 250);
  }

  function setPref(pref) {
    localStorage.setItem('theme', pref);
    applyTheme(getEffectiveTheme(pref));
  }

  // Set initial button icon based on current theme
  const storedPref = localStorage.getItem('theme') || 'system';
  const currentTheme = getEffectiveTheme(storedPref);
  applyTheme(currentTheme);

  // Toggle between light and dark on click
  if (btn) {
    btn.addEventListener('click', () => {
      const active = document.documentElement.getAttribute('data-theme');
      setPref(active === 'dark' ? 'light' : 'dark');
    });
  }

  // React in real time to OS-level preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const pref = localStorage.getItem('theme') || 'system';
    if (pref === 'system') {
      applyTheme(getEffectiveTheme('system'));
    }
  });
}

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
