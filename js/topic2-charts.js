/* ============================================
   Topic 2 — The SWD Framework
   Interactive walkthrough & audience demo
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initWalkthrough();
  initAudienceDemo();
});

/* --- Satisfaction data used across all demos --- */
const PRODUCTS = ['Product A', 'Product B', 'Product C', 'Product D', 'Product E', 'Product F'];
const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const SATISFACTION = {
  'Product A': [6.8, 7.0, 6.9, 7.1],
  'Product B': [7.2, 7.5, 7.4, 7.6],
  'Product C': [8.1, 8.4, 8.6, 8.9],
  'Product D': [6.5, 6.3, 6.7, 6.4],
  'Product E': [7.0, 7.1, 7.3, 7.2],
  'Product F': [5.9, 6.0, 6.2, 5.8],
};

function avgScore(product) {
  const vals = SATISFACTION[product];
  return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

const AVERAGES = PRODUCTS.map(avgScore);
const SORTED_INDICES = AVERAGES.map((v, i) => i).sort((a, b) => AVERAGES[b] - AVERAGES[a]);
const SORTED_PRODUCTS = SORTED_INDICES.map(i => PRODUCTS[i]);
const SORTED_AVERAGES = SORTED_INDICES.map(i => AVERAGES[i]);

/* ===========================================
   Section 2: Step-by-step walkthrough
   =========================================== */

function initWalkthrough() {
  const stepsContainer = document.getElementById('swd-steps');
  if (!stepsContainer) return;

  let currentChart = null;

  const stepMeta = [
    {
      title: 'Customer Satisfaction by Product Line (Q1–Q4)',
      subtitle: 'Raw data — 24 bars across 6 products and 4 quarters',
      icon: '📊',
      expTitle: 'Starting Point',
      expText: 'This is the default grouped bar chart — cluttered, colorful, and hard to read. 24 bars compete for attention with no clear message.',
    },
    {
      title: 'Customer Satisfaction by Product Line (Q1–Q4)',
      subtitle: 'Step 1: Understand the context',
      icon: '🎯',
      expTitle: 'Step 1 — Understand the Context',
      expText: 'Audience: VP of Product. Goal: Decide which product line to invest in. Key message: Product C is outperforming all others. The chart stays the same — but now we know what story to tell.',
    },
    {
      title: 'Average Customer Satisfaction by Product',
      subtitle: 'Step 2: Choose a simpler display — sorted horizontal bars',
      icon: '📐',
      expTitle: 'Step 2 — Choose an Appropriate Display',
      expText: 'We collapsed 4 quarters into averages and switched to a sorted horizontal bar chart. 6 bars instead of 24 — the ranking is immediately visible.',
    },
    {
      title: 'Average Customer Satisfaction by Product',
      subtitle: 'Step 3: Remove gridlines, reduce ticks, simplify',
      icon: '✂️',
      expTitle: 'Step 3 — Eliminate Clutter',
      expText: 'Gridlines gone. Axis ticks reduced. Colors softened to neutral grey. The data speaks without visual noise.',
    },
    {
      title: 'Average Customer Satisfaction by Product',
      subtitle: 'Step 4: Highlight Product C — the key insight',
      icon: '🔦',
      expTitle: 'Step 4 — Focus Attention',
      expText: 'Product C is highlighted in accent color while all others fade to grey. The viewer\'s eye goes directly to the insight.',
    },
    {
      title: 'Average Customer Satisfaction by Product',
      subtitle: 'Step 5: Clean typography, white space, alignment',
      icon: '🎨',
      expTitle: 'Step 5 — Think Like a Designer',
      expText: 'Larger fonts, better alignment, and intentional white space make the chart feel polished and professional.',
    },
    {
      title: 'Product C Leads in Customer Satisfaction — Double Down on Investment',
      subtitle: 'Step 6: The chart tells a story with a clear call to action',
      icon: '📖',
      expTitle: 'Step 6 — Tell a Story',
      expText: 'The title IS the insight. A reader who only glances at this chart still walks away with the message and the recommended action.',
    },
  ];

  function buildChart(step) {
    const canvas = document.getElementById('walkthrough-chart');
    if (currentChart) { currentChart.destroy(); currentChart = null; }

    const meta = stepMeta[step];
    document.getElementById('walkthrough-title').textContent = meta.title;
    document.getElementById('walkthrough-subtitle').textContent = meta.subtitle;
    document.getElementById('walkthrough-exp-title').textContent = meta.expTitle;
    document.getElementById('walkthrough-exp-text').textContent = meta.expText;
    document.querySelector('#walkthrough-explanation .intro-icon').textContent = meta.icon;

    const ctx = canvas.getContext('2d');

    if (step === 0 || step === 1) {
      // Grouped bar: 4 datasets (quarters) × 6 products
      const datasets = QUARTERS.map((q, qi) => ({
        label: q,
        data: PRODUCTS.map(p => SATISFACTION[p][qi]),
        backgroundColor: COLORS.badPalette[qi],
        borderRadius: 2,
        borderSkipped: false,
      }));
      currentChart = new Chart(ctx, {
        type: 'bar',
        data: { labels: PRODUCTS, datasets },
        options: mergeDeep(CHART_DEFAULTS, {
          plugins: { legend: { display: true } },
          scales: {
            y: { beginAtZero: true, max: 10, grid: { color: COLORS.gridLineBad } },
            x: { grid: { display: true, color: COLORS.gridLineBad } },
          },
        }),
      });
    } else if (step === 2) {
      // Sorted horizontal bar — colorful palette
      currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: SORTED_PRODUCTS,
          datasets: [{ data: SORTED_AVERAGES, backgroundColor: COLORS.palette.slice(0, 6), borderRadius: 6, borderSkipped: false, maxBarThickness: 40 }],
        },
        options: mergeDeep(CHART_DEFAULTS, {
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, max: 10, grid: { color: COLORS.gridLine } },
            y: { grid: { display: false } },
          },
        }),
      });
    } else if (step === 3) {
      // Decluttered — all grey, no grid
      const grey = '#6b7280';
      currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: SORTED_PRODUCTS,
          datasets: [{ data: SORTED_AVERAGES, backgroundColor: Array(6).fill(grey), borderRadius: 6, borderSkipped: false, maxBarThickness: 40 }],
        },
        options: mergeDeep(CHART_DEFAULTS, {
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, max: 10, grid: { display: false }, ticks: { display: false } },
            y: { grid: { display: false } },
          },
        }),
      });
    } else if (step === 4) {
      // Focus — Product C in accent, rest grey
      const focusColors = SORTED_PRODUCTS.map(p => p === 'Product C' ? COLORS.accent : '#4a4e5a');
      currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: SORTED_PRODUCTS,
          datasets: [{ data: SORTED_AVERAGES, backgroundColor: focusColors, borderRadius: 6, borderSkipped: false, maxBarThickness: 40 }],
        },
        options: mergeDeep(CHART_DEFAULTS, {
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { beginAtZero: true, max: 10, grid: { display: false }, ticks: { display: false } },
            y: { grid: { display: false } },
          },
        }),
      });
    } else if (step === 5) {
      // Designer — bigger labels, data labels, clean
      const focusColors = SORTED_PRODUCTS.map(p => p === 'Product C' ? COLORS.accent : '#4a4e5a');
      currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: SORTED_PRODUCTS,
          datasets: [{
            data: SORTED_AVERAGES,
            backgroundColor: focusColors,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 44,
          }],
        },
        options: mergeDeep(CHART_DEFAULTS, {
          indexAxis: 'y',
          layout: { padding: { left: 8, right: 24, top: 8, bottom: 8 } },
          plugins: {
            legend: { display: false },
            datalabels: { display: false },
          },
          scales: {
            x: { display: false },
            y: {
              grid: { display: false },
              ticks: { color: COLORS.text, font: { family: "'Inter', sans-serif", size: 13, weight: '600' } },
            },
          },
        }),
      });
    } else if (step === 6) {
      // Story — same as step 5 with story title (set via DOM above)
      const focusColors = SORTED_PRODUCTS.map(p => p === 'Product C' ? COLORS.accent : '#4a4e5a');
      currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: SORTED_PRODUCTS,
          datasets: [{
            data: SORTED_AVERAGES,
            backgroundColor: focusColors,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 44,
          }],
        },
        options: mergeDeep(CHART_DEFAULTS, {
          indexAxis: 'y',
          layout: { padding: { left: 8, right: 24, top: 8, bottom: 8 } },
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: {
              grid: { display: false },
              ticks: { color: COLORS.text, font: { family: "'Inter', sans-serif", size: 13, weight: '600' } },
            },
          },
        }),
      });
    }
  }

  // Step button click handlers
  stepsContainer.querySelectorAll('.step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      stepsContainer.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      buildChart(parseInt(btn.dataset.step, 10));
    });
  });

  buildChart(0);
}

/* ===========================================
   Section 3: Audience selector demo
   =========================================== */

function initAudienceDemo() {
  const select = document.getElementById('audience-select');
  if (!select) return;

  const charts = {};

  function destroyAll() {
    Object.values(charts).forEach(c => { if (c) c.destroy(); });
    Object.keys(charts).forEach(k => delete charts[k]);
  }

  function showView(audience) {
    document.querySelectorAll('.audience-view').forEach(v => v.style.display = 'none');
    destroyAll();

    if (audience === 'ceo') {
      document.getElementById('audience-ceo').style.display = 'block';
      // Simple sorted bar
      const focusColors = SORTED_PRODUCTS.map(p => p === 'Product C' ? COLORS.accent : '#4a4e5a');
      charts.ceo = new Chart(document.getElementById('chart-ceo'), {
        type: 'bar',
        data: {
          labels: SORTED_PRODUCTS,
          datasets: [{
            data: SORTED_AVERAGES,
            backgroundColor: focusColors,
            borderRadius: 6,
            borderSkipped: false,
            maxBarThickness: 44,
          }],
        },
        options: mergeDeep(CHART_DEFAULTS, {
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { display: false },
            y: {
              grid: { display: false },
              ticks: { color: COLORS.text, font: { family: "'Inter', sans-serif", size: 13, weight: '600' } },
            },
          },
        }),
      });

    } else if (audience === 'data-scientist') {
      document.getElementById('audience-data-scientist').style.display = 'block';
      // Scatter plot with error bars approximation
      const scatterData = PRODUCTS.map((p, i) => ({
        x: i + 1,
        y: avgScore(p),
      }));
      const errorBars = PRODUCTS.map(p => {
        const vals = SATISFACTION[p];
        const mean = avgScore(p);
        const sd = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length);
        return sd;
      });

      charts.ds = new Chart(document.getElementById('chart-ds'), {
        type: 'scatter',
        data: {
          datasets: [{
            label: 'Mean Satisfaction ± SD',
            data: scatterData,
            backgroundColor: COLORS.palette.map(c => c + 'cc'),
            borderColor: COLORS.palette.slice(0, 6),
            borderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 11,
          }],
        },
        options: mergeDeep(CHART_DEFAULTS, {
          plugins: {
            legend: { display: true },
            tooltip: {
              callbacks: {
                label: function(ctx) {
                  const idx = ctx.dataIndex;
                  return `${PRODUCTS[idx]}: μ=${ctx.parsed.y} (σ=${errorBars[idx].toFixed(2)})`;
                },
              },
            },
          },
          scales: {
            x: {
              title: { display: true, text: 'Product Index', color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 12 } },
              ticks: {
                callback: function(val) { return PRODUCTS[val - 1] || ''; },
                color: COLORS.textSecondary,
              },
              min: 0, max: 7,
            },
            y: {
              title: { display: true, text: 'Satisfaction Score (1-10)', color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 12 } },
              min: 5, max: 10,
            },
          },
        }),
      });

    } else if (audience === 'marketing') {
      document.getElementById('audience-marketing').style.display = 'block';
      // Colorful vertical bar with trend line overlay
      const brandColors = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff', '#5f27cd'];
      charts.mkt = new Chart(document.getElementById('chart-marketing'), {
        type: 'bar',
        data: {
          labels: PRODUCTS,
          datasets: [
            {
              label: 'Avg Satisfaction',
              data: AVERAGES,
              backgroundColor: brandColors,
              borderRadius: 8,
              borderSkipped: false,
              maxBarThickness: 56,
              order: 2,
            },
            {
              label: 'Trend',
              data: AVERAGES,
              type: 'line',
              borderColor: COLORS.warning,
              backgroundColor: 'transparent',
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: COLORS.warning,
              borderWidth: 2,
              borderDash: [6, 3],
              order: 1,
            },
          ],
        },
        options: mergeDeep(CHART_DEFAULTS, {
          plugins: { legend: { display: true } },
          scales: {
            y: { beginAtZero: true, max: 10, grid: { color: COLORS.gridLine } },
            x: { grid: { display: false } },
          },
        }),
      });
    }
  }

  select.addEventListener('change', () => showView(select.value));
  showView('ceo');
}
