/* ============================================
   Topic 4 — Story-Driven Titles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTitleTypeDemo();
  initLiveTitleEditor();
  initSubtitleChart();
  initGalleryCharts();
});

/* ------------------------------------------
   Section 1: Three Title Types (toggle demo)
   ------------------------------------------ */
function initTitleTypeDemo() {
  const titles = {
    technical: 'Figure 3.2',
    descriptive: 'Quarterly Revenue, FY2024',
    story: 'Revenue Dropped 23% in Q3 After Product Launch Delays'
  };

  const badges = {
    technical: { text: '❌ The worst', cls: 'danger' },
    descriptive: { text: '⚠️ OK but passive', cls: 'danger' },
    story: { text: '✅ The best', cls: 'safe' }
  };

  const ctx = document.getElementById('title-type-chart');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [{
        data: [2.1, 2.3, 1.8, 2.0],
        backgroundColor: [COLORS.accent, COLORS.accent, COLORS.danger, COLORS.accent],
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 60
      }]
    },
    options: mergeDeep(CHART_DEFAULTS, {
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: titles.technical,
          color: COLORS.text,
          font: { family: "'Inter', sans-serif", size: 16, weight: '700' },
          padding: { bottom: 20 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => '$' + v.toFixed(1) + 'M'
          }
        },
        x: { grid: { display: false } }
      }
    })
  });

  const label = document.getElementById('title-type-label');

  document.querySelectorAll('#title-type-steps .step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#title-type-steps .step-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const step = btn.dataset.step;
      chart.options.plugins.title.text = titles[step];
      chart.update();

      const badge = badges[step];
      label.textContent = badge.text;
      label.className = 'warning-badge ' + badge.cls;
    });
  });
}

/* ------------------------------------------
   Section 3: Live Title Editor
   ------------------------------------------ */
function initLiveTitleEditor() {
  const ctx = document.getElementById('live-title-chart');
  if (!ctx) return;

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['North', 'South', 'East', 'West'],
      datasets: [{
        data: [4.2, 3.1, 5.8, 2.9],
        backgroundColor: [COLORS.accent, COLORS.accent, COLORS.success, COLORS.accent],
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 60
      }]
    },
    options: mergeDeep(CHART_DEFAULTS, {
      plugins: {
        legend: { display: false },
        title: {
          display: true,
          text: 'Sales by Region',
          color: COLORS.text,
          font: { family: "'Inter', sans-serif", size: 16, weight: '700' },
          padding: { bottom: 20 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: v => '$' + v.toFixed(1) + 'M'
          }
        },
        x: { grid: { display: false } }
      }
    })
  });

  const input = document.getElementById('title-input');
  if (input) {
    input.addEventListener('input', () => {
      chart.options.plugins.title.text = input.value || ' ';
      chart.update();
    });
  }

  document.querySelectorAll('#title-suggestions .step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.title;
      input.value = title;
      chart.options.plugins.title.text = title;
      chart.update();
    });
  });
}

/* ------------------------------------------
   Section 4: Subtitle Strategy (line chart)
   ------------------------------------------ */
function initSubtitleChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  createLineChart('subtitle-chart', months, [
    {
      label: 'Tech',
      data: [0, 2, 1, 3, 5, 8, 10, 12, 14, 16, 18, 22],
      color: COLORS.accent
    },
    {
      label: 'Retail',
      data: [0, -2, -8, -15, -12, -8, -5, -2, 1, 3, 5, 4],
      color: COLORS.warning
    },
    {
      label: 'Services',
      data: [0, -5, -18, -35, -40, -38, -32, -28, -25, -22, -20, -18],
      color: COLORS.danger,
      extra: { borderWidth: 3.5 }
    }
  ], {
    yMin: -45,
    yMax: 25,
    extra: {
      plugins: { legend: { display: true } },
      scales: {
        y: {
          ticks: {
            callback: v => (v > 0 ? '+' : '') + v + '%'
          }
        }
      }
    }
  });
}

/* ------------------------------------------
   Section 5: Gallery mini-charts
   ------------------------------------------ */
function initGalleryCharts() {
  // 1. Sales grew 15% YoY — bar chart
  createBarChart('gallery-chart-1', ['2021', '2022', '2023', '2024'], [3.2, 3.5, 3.9, 4.5], {
    colors: [COLORS.accentLight, COLORS.accentLight, COLORS.accentLight, COLORS.success],
    beginAtZero: true,
    yFormat: v => '$' + v.toFixed(1) + 'M'
  });

  // 2. Added 2,000 customers in Q4 — bar chart
  createBarChart('gallery-chart-2', ['Q1', 'Q2', 'Q3', 'Q4'], [800, 950, 1100, 2000], {
    colors: [COLORS.accentLight, COLORS.accentLight, COLORS.accentLight, COLORS.success],
    beginAtZero: true
  });

  // 3. Support volume spiked 3x — line chart
  createLineChart('gallery-chart-3',
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    [{
      label: 'Tickets',
      data: [120, 115, 130, 380, 410, 360],
      color: COLORS.danger
    }],
    { beginAtZero: true }
  );

  // 4. NPS reached 72 — line chart
  createLineChart('gallery-chart-4',
    ['Q1 \'23', 'Q2 \'23', 'Q3 \'23', 'Q4 \'23', 'Q1 \'24', 'Q2 \'24'],
    [{
      label: 'NPS',
      data: [58, 61, 64, 67, 70, 72],
      color: COLORS.success
    }],
    { yMin: 50, yMax: 80 }
  );
}
