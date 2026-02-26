/* ============================================
   Topic 3 — Eliminate Chart Junk
   Interactive junk remover, before/after,
   and "spot the junk" dashboard
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initJunkRemover();
  initCompareCharts();
  initSpotTheJunk();
});

/* --------------------------------------------------
   Data shared across charts
   -------------------------------------------------- */
const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Home', 'Sports'];
const SALES_DATA = [42, 31, 56, 24, 38];

/* --------------------------------------------------
   Section 2 — Interactive Chart Junk Remover
   -------------------------------------------------- */
function initJunkRemover() {
  const ctx = document.getElementById('junkRemoverChart');
  if (!ctx) return;

  const chart = new Chart(ctx, buildJunkConfig(getAllJunkState()));

  document.querySelectorAll('#junk-toggles input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      const state = getAllJunkState();
      applyJunkState(chart, state);
      updateInkRatio(state);
    });
  });

  updateInkRatio(getAllJunkState());
}

function getAllJunkState() {
  const state = {};
  document.querySelectorAll('#junk-toggles input[type="checkbox"]').forEach(cb => {
    state[cb.dataset.junk] = cb.checked;
  });
  return state;
}

function buildJunkConfig(state) {
  return {
    type: 'bar',
    data: {
      labels: CATEGORIES,
      datasets: [{
        label: 'Monthly Sales ($k)',
        data: SALES_DATA,
        backgroundColor: getBarColors(state),
        borderColor: state.borders ? 'rgba(0,0,0,0.8)' : 'transparent',
        borderWidth: state.borders ? 3 : 0,
        borderRadius: 4,
        borderSkipped: false,
        maxBarThickness: 60,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: state.legend,
          labels: {
            color: COLORS.textSecondary,
            font: { family: "'Inter', sans-serif", size: 12 },
          }
        },
        tooltip: CHART_DEFAULTS.plugins.tooltip,
      },
      scales: {
        x: {
          grid: {
            display: state.gridlines,
            color: state.gridlines ? 'rgba(150,150,170,0.5)' : COLORS.gridLine,
            lineWidth: state.gridlines ? 2 : 1,
            drawBorder: false,
          },
          ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: state.gridlines ? 'rgba(150,150,170,0.5)' : COLORS.gridLine,
            lineWidth: state.gridlines ? 2 : 1,
            drawBorder: false,
          },
          ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } },
        }
      }
    },
    plugins: state.threed ? [shadowPlugin] : []
  };
}

/* Apply current junk state to existing chart without destroying it */
function applyJunkState(chart, state) {
  const ds = chart.data.datasets[0];

  // Colors
  ds.backgroundColor = getBarColors(state);

  // Borders
  ds.borderColor = state.borders ? 'rgba(0,0,0,0.8)' : 'transparent';
  ds.borderWidth = state.borders ? 3 : 0;

  // Gridlines
  chart.options.scales.x.grid.display = state.gridlines;
  chart.options.scales.x.grid.color = state.gridlines ? 'rgba(150,150,170,0.5)' : COLORS.gridLine;
  chart.options.scales.x.grid.lineWidth = state.gridlines ? 2 : 1;
  chart.options.scales.y.grid.color = state.gridlines ? 'rgba(150,150,170,0.5)' : COLORS.gridLine;
  chart.options.scales.y.grid.lineWidth = state.gridlines ? 2 : 1;

  // Legend
  chart.options.plugins.legend.display = state.legend;

  // Background
  const area = document.getElementById('junk-chart-area');
  if (area) {
    area.style.background = state.background
      ? 'linear-gradient(135deg, #2a1a3e, #1a2a3e)'
      : '';
  }

  // 3D shadow plugin
  if (state.threed) {
    if (!chart.config.plugins.includes(shadowPlugin)) {
      chart.config.plugins.push(shadowPlugin);
    }
  } else {
    chart.config.plugins = chart.config.plugins.filter(p => p !== shadowPlugin);
  }

  chart.update();
}

function getBarColors(state) {
  if (state.gradients) {
    // Return gradient-ish solid approximations (Chart.js canvas gradients are complex;
    // using two-tone palette as a visual cue for "bad gradients")
    return state.colors
      ? COLORS.badPalette.slice(0, 5)
      : ['#6366f1', '#818cf8', '#6366f1', '#818cf8', '#6366f1'];
  }
  if (state.colors) {
    return COLORS.badPalette.slice(0, 5);
  }
  // Clean: single accent color
  return Array(5).fill(COLORS.accent);
}

/* Chart.js plugin that draws a shadow behind each bar to fake 3D */
const shadowPlugin = {
  id: 'barShadow',
  beforeDatasetsDraw(chart) {
    const { ctx } = chart;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 6;
    ctx.shadowOffsetY = 6;
  },
  afterDatasetsDraw(chart) {
    chart.ctx.restore();
  }
};

function updateInkRatio(state) {
  const junkCount = Object.values(state).filter(Boolean).length;
  const total = Object.keys(state).length;
  const ratio = Math.round(30 + (1 - junkCount / total) * 60);
  const el = document.getElementById('ink-ratio');
  if (!el) return;
  el.textContent = ratio + '%';

  if (ratio >= 75) {
    el.style.color = 'var(--success)';
  } else if (ratio >= 50) {
    el.style.color = 'var(--warning)';
  } else {
    el.style.color = 'var(--danger)';
  }
}

/* --------------------------------------------------
   Section 3 — Before / After Side-by-Side
   -------------------------------------------------- */
function initCompareCharts() {
  // Before chart — all junk
  const ctxBefore = document.getElementById('compareBeforeChart');
  if (ctxBefore) {
    new Chart(ctxBefore, {
      type: 'bar',
      data: {
        labels: CATEGORIES,
        datasets: [{
          label: 'Sales ($k)',
          data: SALES_DATA,
          backgroundColor: COLORS.badPalette.slice(0, 5),
          borderColor: 'rgba(0,0,0,0.8)',
          borderWidth: 3,
          borderRadius: 0,
          maxBarThickness: 60,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.6,
        plugins: {
          legend: {
            display: true,
            labels: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } }
          },
        },
        scales: {
          x: {
            grid: { display: true, color: 'rgba(150,150,170,0.5)', lineWidth: 2, drawBorder: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(150,150,170,0.5)', lineWidth: 2, drawBorder: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          }
        }
      },
      plugins: [shadowPlugin]
    });
    // Add background to before container
    ctxBefore.closest('.chart-container').style.background = 'linear-gradient(135deg, #2a1a3e, #1a2a3e)';
  }

  // After chart — clean
  const ctxAfter = document.getElementById('compareAfterChart');
  if (ctxAfter) {
    new Chart(ctxAfter, {
      type: 'bar',
      data: {
        labels: CATEGORIES,
        datasets: [{
          data: SALES_DATA,
          backgroundColor: SALES_DATA.map((v, i) => i === 2 ? COLORS.accent : COLORS.accent + '55'),
          borderRadius: 6,
          borderSkipped: false,
          maxBarThickness: 60,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 1.6,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          },
          y: {
            beginAtZero: true,
            grid: { color: COLORS.gridLine, lineWidth: 0.5, drawBorder: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          }
        }
      }
    });
  }
}

/* --------------------------------------------------
   Section 5 — Spot the Junk Dashboard
   -------------------------------------------------- */
function initSpotTheJunk() {
  const pieLabels = ['Segment A', 'Segment B', 'Segment C', 'Segment D', 'Segment E', 'Segment F', 'Segment G', 'Segment H'];
  const pieData = [18, 15, 12, 11, 10, 14, 9, 11];

  // Bad pie — too many slices, rainbow
  const ctxBadPie = document.getElementById('spotBadPie');
  if (ctxBadPie) {
    new Chart(ctxBadPie, {
      type: 'pie',
      data: {
        labels: pieLabels,
        datasets: [{
          data: pieData,
          backgroundColor: COLORS.badPalette,
          borderColor: '#000',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 }, padding: 8, usePointStyle: true }
          }
        }
      },
      plugins: [shadowPlugin]
    });
  }

  // Good horizontal bar — same data
  const ctxGoodBar = document.getElementById('spotGoodBar');
  if (ctxGoodBar) {
    new Chart(ctxGoodBar, {
      type: 'bar',
      data: {
        labels: pieLabels,
        datasets: [{
          data: pieData,
          backgroundColor: pieData.map((v, i) => i === 0 ? COLORS.accent : COLORS.accent + '44'),
          borderRadius: 4,
          borderSkipped: false,
          maxBarThickness: 28,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: {
            beginAtZero: true,
            grid: { color: COLORS.gridLine, lineWidth: 0.5, drawBorder: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          },
          y: {
            grid: { display: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          }
        }
      }
    });
  }

  // Bad line chart
  const lineLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const lineData = [12, 19, 14, 25, 22, 30];

  const ctxBadLine = document.getElementById('spotBadLine');
  if (ctxBadLine) {
    new Chart(ctxBadLine, {
      type: 'line',
      data: {
        labels: lineLabels,
        datasets: [{
          label: 'Revenue',
          data: lineData,
          borderColor: '#ff0000',
          backgroundColor: 'rgba(255,0,0,0.15)',
          fill: true,
          borderWidth: 4,
          pointRadius: 6,
          pointBackgroundColor: '#ff0000',
          tension: 0.3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            labels: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(150,150,170,0.5)', lineWidth: 2, drawBorder: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          },
          y: {
            grid: { color: 'rgba(150,150,170,0.5)', lineWidth: 2, drawBorder: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          }
        }
      },
      plugins: [shadowPlugin]
    });
    ctxBadLine.closest('.chart-container').style.background = 'linear-gradient(135deg, #2a1a3e, #1a2a3e)';
  }

  // Good line chart
  const ctxGoodLine = document.getElementById('spotGoodLine');
  if (ctxGoodLine) {
    new Chart(ctxGoodLine, {
      type: 'line',
      data: {
        labels: lineLabels,
        datasets: [{
          data: lineData,
          borderColor: COLORS.accent,
          backgroundColor: COLORS.accent + '15',
          fill: false,
          borderWidth: 2.5,
          pointRadius: 3,
          pointHoverRadius: 6,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          },
          y: {
            grid: { color: COLORS.gridLine, lineWidth: 0.5, drawBorder: false },
            ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 10 } },
          }
        }
      }
    });
  }
}
