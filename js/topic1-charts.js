/* ============================================
   Topic 1 — Make a Figure for the Generals
   Charts & interactive demos
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBadScatterChart();
  initBeforeAfterCharts();
  initComplexitySlider();
  initDashboardCharts();
});

/* ---- Section 1: Bad scatter chart (the problem) ---- */
function initBadScatterChart() {
  const airlines = [
    { label: 'Delta',     color: COLORS.badPalette[0] },
    { label: 'American',  color: COLORS.badPalette[1] },
    { label: 'United',    color: COLORS.badPalette[2] },
    { label: 'JetBlue',   color: COLORS.badPalette[3] },
    { label: 'Southwest', color: COLORS.badPalette[4] },
  ];

  function randomFlights(n, delayCenter) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      pts.push({
        x: Math.round(200 + Math.random() * 2600),
        y: Math.round(delayCenter + (Math.random() - 0.5) * 80),
        r: 3 + Math.random() * 8,
      });
    }
    return pts;
  }

  const datasets = airlines.map((a, i) => {
    const delays = [-1.2, -0.5, 3.2, 4.8, 5.1];
    return {
      label: a.label,
      data: randomFlights(40, delays[i] * 5),
      color: a.color,
      pointRadius: randomFlights(40, 0).map(() => 3 + Math.random() * 7),
    };
  });

  createScatterChart('bad-scatter-chart', datasets, {
    xLabel: 'Distance (miles)',
    yLabel: 'Arrival Delay (min)',
    title: 'Airline Flight Performance — All Dimensions at Once',
  });
}

/* ---- Section 2: Before / After ---- */
function initBeforeAfterCharts() {
  // Before: cluttered scatter (same data as above but in the BA container)
  const airlines = ['Delta', 'American', 'United', 'JetBlue', 'Southwest'];
  const delayCenters = [-1.2, -0.5, 3.2, 4.8, 5.1];

  function randomPts(n, center) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      pts.push({
        x: Math.round(200 + Math.random() * 2600),
        y: Math.round(center * 5 + (Math.random() - 0.5) * 80),
      });
    }
    return pts;
  }

  const scatterDS = airlines.map((name, i) => ({
    label: name,
    data: randomPts(35, delayCenters[i]),
    color: COLORS.badPalette[i],
    pointRadius: 4 + Math.random() * 4,
  }));

  createScatterChart('before-chart', scatterDS, {
    xLabel: 'Distance (miles)',
    yLabel: 'Arrival Delay (min)',
  });

  // After: clean horizontal bar
  const sortedAirlines = ['Delta', 'American', 'United', 'JetBlue', 'Southwest'];
  const sortedDelays   = [-1.2,    -0.5,       3.2,      4.8,       5.1];

  const barColors = sortedDelays.map((v, i) =>
    i === 0 ? COLORS.success : COLORS.palette[0] + '88'
  );

  createBarChart('after-chart', sortedAirlines, sortedDelays, {
    horizontal: true,
    colors: barColors,
    beginAtZero: false,
    yMin: undefined,
    extra: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.parsed.x > 0 ? '+' : ''}${ctx.parsed.x} min`
          }
        }
      },
      scales: {
        x: {
          grid: { color: COLORS.gridLine },
          ticks: {
            callback: v => `${v > 0 ? '+' : ''}${v} min`,
            color: COLORS.textSecondary,
          }
        },
        y: {
          grid: { display: false },
          ticks: { color: COLORS.text, font: { weight: '600', size: 13 } }
        }
      }
    }
  });
}

/* ---- Section 3: Complexity / Dimension slider ---- */
function initComplexitySlider() {
  const slider = document.getElementById('dimension-slider');
  const label  = document.getElementById('dimension-label');
  const score  = document.getElementById('readability-score');
  const title  = document.getElementById('complexity-title');
  const sub    = document.getElementById('complexity-subtitle');
  const canvas = document.getElementById('complexity-chart');
  if (!slider || !canvas) return;

  const products = ['Widget A', 'Widget B', 'Widget C', 'Widget D', 'Widget E'];
  const revenue  = [420, 380, 310, 270, 190];
  const growth   = [12, -3, 8, 22, -7];
  const margin   = [34, 28, 41, 19, 37];

  const steps = [
    {
      label: '1 — Bars Only',
      title: 'Step 1: Simple Bars',
      subtitle: 'Revenue by product — one clear dimension',
      stars: '★★★★★',
    },
    {
      label: '2 — Add Color',
      title: 'Step 2: Color-Encoded Categories',
      subtitle: 'Each product gets a unique color — decorative, not informative',
      stars: '★★★★☆',
    },
    {
      label: '3 — Add Second Axis',
      title: 'Step 3: Dual Axis (Growth %)',
      subtitle: 'A line on a second y-axis — now the viewer must track two scales',
      stars: '★★★☆☆',
    },
    {
      label: '4 — Add Data Labels',
      title: 'Step 4: Every Number Labeled',
      subtitle: 'Data labels on bars AND line — text competes with visuals',
      stars: '★★☆☆☆',
    },
    {
      label: '5 — Add Patterns & Borders',
      title: 'Step 5: "Just One More Thing…"',
      subtitle: 'Borders, patterns, extra annotations — total chart junk',
      stars: '★☆☆☆☆',
    },
  ];

  let chart = null;

  function renderStep(step) {
    const s = steps[step - 1];
    label.textContent = s.label;
    score.textContent = s.stars;
    title.textContent = s.title;
    sub.textContent = s.subtitle;

    if (chart) { chart.destroy(); chart = null; }

    const ctx = canvas.getContext('2d');
    const datasets = [];
    const scales = {};

    // Base bars
    const barColors = step === 1
      ? Array(5).fill(COLORS.accent)
      : COLORS.palette.slice(0, 5);

    const barDS = {
      type: 'bar',
      label: 'Revenue ($K)',
      data: revenue,
      backgroundColor: barColors,
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 60,
      yAxisID: 'y',
      order: 2,
    };

    if (step >= 5) {
      barDS.borderColor = COLORS.badPalette.slice(0, 5);
      barDS.borderWidth = 3;
    }

    if (step >= 4) {
      barDS.datalabels = true;
    }

    datasets.push(barDS);

    // Y axis (always present)
    scales.y = {
      beginAtZero: true,
      grid: { color: COLORS.gridLine },
      ticks: { color: COLORS.textSecondary, callback: v => `$${v}K` },
      title: { display: true, text: 'Revenue ($K)', color: COLORS.textSecondary,
               font: { family: "'Inter', sans-serif", size: 12 } },
    };
    scales.x = {
      grid: { display: false },
      ticks: { color: COLORS.textSecondary },
    };

    // Step 3+: growth line on second axis
    if (step >= 3) {
      datasets.push({
        type: 'line',
        label: 'Growth %',
        data: growth,
        borderColor: COLORS.warning,
        backgroundColor: COLORS.warning + '30',
        borderWidth: 2.5,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: COLORS.warning,
        yAxisID: 'y2',
        order: 1,
      });
      scales.y2 = {
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { color: COLORS.warning, callback: v => `${v}%` },
        title: { display: true, text: 'Growth %', color: COLORS.warning,
                 font: { family: "'Inter', sans-serif", size: 12 } },
      };
    }

    // Step 5: extra line for margin
    if (step >= 5) {
      datasets.push({
        type: 'line',
        label: 'Margin %',
        data: margin,
        borderColor: COLORS.danger,
        borderDash: [6, 4],
        backgroundColor: COLORS.danger + '30',
        borderWidth: 2,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: COLORS.danger,
        yAxisID: 'y2',
        order: 0,
      });
    }

    const plugins = {
      legend: {
        display: step >= 2,
        labels: {
          color: COLORS.textSecondary,
          font: { family: "'Inter', sans-serif", size: 12 },
          padding: 16,
          usePointStyle: true,
        }
      },
      tooltip: CHART_DEFAULTS.plugins.tooltip,
    };

    chart = new Chart(ctx, {
      type: 'bar',
      data: { labels: products, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins,
        scales,
      },
      plugins: step >= 4 ? [{
        id: 'customLabels',
        afterDatasetsDraw(chart) {
          const ctx2 = chart.ctx;
          chart.data.datasets.forEach((ds, di) => {
            const meta = chart.getDatasetMeta(di);
            meta.data.forEach((bar, i) => {
              const value = ds.data[i];
              ctx2.save();
              ctx2.fillStyle = COLORS.text;
              ctx2.font = "bold 11px 'Inter', sans-serif";
              ctx2.textAlign = 'center';
              if (ds.type === 'line' || di > 0) {
                ctx2.fillText(`${value}%`, bar.x, bar.y - 10);
              } else {
                ctx2.fillText(`$${value}K`, bar.x, bar.y - 8);
              }
              ctx2.restore();
            });
          });
        }
      }] : [],
    });
  }

  slider.addEventListener('input', () => renderStep(parseInt(slider.value)));
  renderStep(1);
}

/* ---- Section 4: Dashboard charts ---- */
function initDashboardCharts() {
  // Revenue by Region bar chart
  createBarChart('dashboard-bar',
    ['North America', 'Europe', 'Asia-Pacific', 'Latin America'],
    [980, 620, 510, 290],
    {
      title: 'Revenue by Region ($K)',
      colors: [COLORS.accent, COLORS.accent + '99', COLORS.accent + '66', COLORS.accent + '44'],
      extra: {
        scales: {
          y: {
            ticks: { callback: v => `$${v}K` }
          }
        }
      }
    }
  );

  // Monthly Revenue trend line
  createLineChart('dashboard-line',
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    [{
      label: 'Revenue',
      data: [165, 172, 180, 178, 195, 205, 198, 212, 220, 235, 242, 260],
      color: COLORS.accent,
      fill: true,
      pointRadius: 3,
    }],
    {
      title: 'Monthly Revenue, Last 12 Months ($K)',
      extra: {
        scales: {
          y: {
            ticks: { callback: v => `$${v}K` }
          }
        }
      }
    }
  );
}
