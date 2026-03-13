/* ============================================
   Topic 7: PowerPoint Data Visualization — Charts & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initChartTypeTabs();
  initChartTypeDemos();
  initExample1Charts();
  initMakeoverCharts();
});


/* --- Section 2: Chart Type Tabs --- */

function initChartTypeTabs() {
  document.querySelectorAll('#chart-type-tabs .step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#chart-type-tabs .step-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
      const target = document.getElementById(btn.dataset.step);
      if (target) target.classList.add('active');
    });
  });
}


/* --- Section 2: Chart Type Demo Charts --- */

function initChartTypeDemos() {
  // 1. Bar chart demo — Q4 regional revenue comparison
  createBarChart('chart-bar-demo',
    ['North', 'East', 'South', 'West', 'Central'],
    [820, 640, 510, 730, 390],
    {
      colors: [COLORS.accent, COLORS.muted, COLORS.muted, COLORS.muted, COLORS.muted],
      beginAtZero: true,
      yFormat: (v) => '$' + v + 'K',
    }
  );

  // 2. Line chart demo — monthly active users over a year
  createLineChart('chart-line-demo',
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    [
      {
        label: 'Monthly Active Users',
        data: [4200, 4500, 4800, 5100, 5600, 6000, 5800, 6200, 6700, 7100, 7500, 8100],
        color: COLORS.accent,
        fill: true,
      }
    ],
    { beginAtZero: false }
  );

  // 3. Pie chart demo — revenue by segment (2–4 slices: good use case)
  createPieChart('chart-pie-demo',
    ['Enterprise', 'SMB', 'Self-Serve'],
    [61, 26, 13],
    {
      colors: [COLORS.accent, COLORS.accentLight, COLORS.muted],
      title: 'Revenue by Segment (%)',
    }
  );

  // 4. Scatter chart demo — ad spend vs conversions
  const scatterData = generateScatterData();
  createScatterChart('chart-scatter-demo',
    [
      {
        label: 'Campaigns',
        data: scatterData,
        color: COLORS.accent,
        pointRadius: 6,
      }
    ],
    {
      xLabel: 'Ad Spend ($K)',
      yLabel: 'Conversions',
    }
  );

  // 5. Combo chart demo — revenue (bar) + margin % (line)
  createComboChart('chart-combo-demo',
    ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
    [580, 620, 490, 710, 650, 690, 540, 780],   // revenue $K
    [22, 24, 18, 28, 25, 26, 20, 31]             // margin %
  );
}

function generateScatterData() {
  const points = [];
  for (let i = 0; i < 20; i++) {
    const spend = Math.round(10 + Math.random() * 90);
    const conversions = Math.round(spend * (2.5 + Math.random() * 1.5) + (Math.random() - 0.5) * 40);
    points.push({ x: spend, y: Math.max(0, conversions) });
  }
  return points;
}

/* Combo chart: bar series for revenue, line series for margin % */
function createComboChart(canvasId, labels, barData, lineData) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    data: {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Revenue ($K)',
          data: barData,
          backgroundColor: COLORS.accent + '99',
          borderColor: COLORS.accent,
          borderWidth: 1,
          borderRadius: 4,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Gross Margin (%)',
          data: lineData,
          borderColor: COLORS.success,
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 7,
          borderWidth: 2.5,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          labels: {
            color: COLORS.textSecondary,
            font: { family: "'Inter', sans-serif", size: 12 },
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: '#1e2130',
          titleColor: COLORS.text,
          bodyColor: COLORS.textSecondary,
          borderColor: '#2d3148',
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } },
        },
        y: {
          position: 'left',
          beginAtZero: true,
          grid: { color: COLORS.gridLine },
          ticks: {
            color: COLORS.textSecondary,
            font: { family: "'Inter', sans-serif", size: 11 },
            callback: (v) => '$' + v + 'K',
          },
        },
        y1: {
          position: 'right',
          beginAtZero: true,
          max: 40,
          grid: { drawOnChartArea: false },
          ticks: {
            color: COLORS.success,
            font: { family: "'Inter', sans-serif", size: 11 },
            callback: (v) => v + '%',
          },
        }
      }
    }
  });
}


/* --- Section 5: Worked Example 1 Charts --- */

function initExample1Charts() {
  // Bar chart: revenue by segment, Enterprise highlighted
  createBarChart('chart-example1-bar',
    ['Enterprise', 'SMB', 'Self-Serve'],
    [1900, 820, 380],
    {
      colors: [COLORS.accent, COLORS.muted, COLORS.muted],
      beginAtZero: true,
      yFormat: (v) => '$' + v + 'K',
      horizontal: true,
    }
  );

  // Line chart: monthly revenue trend for Enterprise vs other segments
  createLineChart('chart-example1-line',
    ['Oct', 'Nov', 'Dec'],
    [
      {
        label: 'Enterprise',
        data: [520, 620, 760],
        color: COLORS.accent,
      },
      {
        label: 'SMB',
        data: [280, 270, 270],
        color: COLORS.muted,
      },
      {
        label: 'Self-Serve',
        data: [140, 130, 110],
        color: COLORS.textSecondary,
      }
    ],
    { beginAtZero: true }
  );
}


/* --- Section 6: Makeover Charts --- */

function initMakeoverCharts() {
  // BEFORE: 3D-style pie with many garish colors (simulated as flat pie with bad palette)
  const ctx = document.getElementById('chart-makeover-before');
  if (ctx) {
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Software', 'Hardware', 'Services', 'Licensing', 'Support', 'Other'],
        datasets: [{
          data: [38, 22, 17, 12, 7, 4],
          backgroundColor: COLORS.badPalette.slice(0, 6),
          borderColor: '#ffffff',
          borderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: COLORS.textSecondary,
              font: { family: "'Inter', sans-serif", size: 10 },
            }
          },
          title: {
            display: true,
            text: 'Market Share by Product Category',
            color: COLORS.textSecondary,
            font: { family: "'Inter', sans-serif", size: 11 },
          }
        }
      }
    });
  }

  // AFTER: horizontal sorted bar, accent for Software, danger for Hardware, grey rest
  createBarChart('chart-makeover-after',
    ['Software', 'Hardware', 'Services', 'Licensing', 'Support', 'Other'],
    [38, 22, 17, 12, 7, 4],
    {
      colors: [COLORS.accent, COLORS.danger, COLORS.muted, COLORS.muted, COLORS.muted, COLORS.muted],
      beginAtZero: true,
      yFormat: (v) => v + '%',
      horizontal: true,
    }
  );
}
