/* ============================================
   Topic 5 — Non-Negotiable Rules
   Interactive demos for bar-zero, pie-100%, color
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initIncomeBarDemo();
  initLineComparison();
  initPieDemo();
  initColorCharts();
});

/* -------------------------------------------------
   Section 1: Bar Charts Start at Zero — Slider Demo
   ------------------------------------------------- */
function initIncomeBarDemo() {
  const ctx = document.getElementById('incomeBarChart');
  if (!ctx) return;

  const labels = ['Honolulu', 'Maui', 'Kauai', 'Hawaii'];
  const data = [72000, 67000, 65000, 55000];

  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [COLORS.accent, COLORS.accentLight, COLORS.palette[4], COLORS.palette[2]],
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 60,
      }]
    },
    options: mergeDeep(CHART_DEFAULTS, {
      plugins: { legend: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 80000,
          grid: { color: COLORS.gridLine },
          ticks: {
            color: COLORS.textSecondary,
            callback: v => '$' + (v / 1000).toFixed(0) + 'k'
          }
        },
        x: { grid: { display: false } }
      }
    })
  });

  const slider = document.getElementById('yAxisMin');
  const valueLabel = document.getElementById('yAxisMinValue');
  const badge = document.getElementById('barWarning');
  const explanation = document.getElementById('barExplanation');

  if (!slider) return;

  slider.addEventListener('input', () => {
    const minVal = parseInt(slider.value, 10);
    chart.options.scales.y.min = minVal;
    chart.update();

    valueLabel.textContent = '$' + minVal.toLocaleString();

    // Update warning badge
    if (minVal === 0) {
      badge.className = 'warning-badge safe';
      badge.textContent = '✓ ACCURATE';
    } else {
      badge.className = 'warning-badge danger';
      badge.textContent = '⚠ MISLEADING';
    }

    // Compute apparent vs actual ratio
    const honoluluVisible = 72000 - minVal;
    const hawaiiVisible = 55000 - minVal;
    const apparentRatio = hawaiiVisible > 0
      ? (honoluluVisible / hawaiiVisible).toFixed(1)
      : '∞';
    const actualRatio = (72000 / 55000).toFixed(1);

    explanation.textContent = hawaiiVisible > 0
      ? `At this scale, Honolulu appears to have ${apparentRatio}× the income of Hawaii, but it's actually only ${actualRatio}× more.`
      : `At this scale, Hawaii's bar has disappeared entirely — yet the actual difference is only ${actualRatio}×.`;
  });
}

/* -------------------------------------------------
   Section 2: Line Chart Exception — Side by Side
   ------------------------------------------------- */
function initLineComparison() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const temps = [32, 35, 42, 55, 65, 72];

  // Left chart: starts at zero
  createLineChart('lineZeroChart', months, [
    { label: 'Temperature (°F)', data: temps, color: COLORS.accent, fill: true }
  ], { beginAtZero: true, yMin: 0, yMax: 80 });

  // Right chart: appropriate range
  createLineChart('lineRangeChart', months, [
    { label: 'Temperature (°F)', data: temps, color: COLORS.success, fill: true }
  ], { yMin: 25, yMax: 80 });
}

/* -------------------------------------------------
   Section 3: Pie Charts Sum to 100% — Interactive
   ------------------------------------------------- */
function initPieDemo() {
  const ctx = document.getElementById('marketPieChart');
  if (!ctx) return;

  const validLabels = ['Company A', 'Company B', 'Company C', 'Company D'];
  const validData = [42, 28, 18, 12];

  const chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [...validLabels],
      datasets: [{
        data: [...validData],
        backgroundColor: COLORS.palette.slice(0, 4),
        borderColor: '#1e2130',
        borderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: COLORS.textSecondary,
            font: { family: "'Inter', sans-serif", size: 12 },
            padding: 16,
            usePointStyle: true,
          }
        }
      }
    }
  });

  const badge = document.getElementById('pieWarning');
  const btnOverlap = document.getElementById('pieAddOverlap');
  const btnSurvey = document.getElementById('pieSurveyData');
  const btnReset = document.getElementById('pieReset');

  function updateBadge(dataArr) {
    const sum = dataArr.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 100) < 0.5) {
      badge.className = 'warning-badge safe';
      badge.textContent = '✓ VALID — Slices sum to 100%';
    } else {
      badge.className = 'warning-badge danger';
      badge.textContent = '⚠ CRIME — Slices sum to ' + Math.round(sum) + '%!';
    }
  }

  function setActiveBtn(active) {
    [btnOverlap, btnSurvey, btnReset].forEach(b => b.classList.remove('active'));
    active.classList.add('active');
  }

  btnOverlap.addEventListener('click', () => {
    chart.data.labels = [...validLabels, 'Company E'];
    chart.data.datasets[0].data = [42, 28, 18, 12, 25];
    chart.data.datasets[0].backgroundColor = COLORS.palette.slice(0, 5);
    chart.update();
    updateBadge(chart.data.datasets[0].data);
    setActiveBtn(btnOverlap);
  });

  btnSurvey.addEventListener('click', () => {
    chart.data.labels = ['Email', 'Social Media', 'Search', 'Word of Mouth', 'Ads'];
    chart.data.datasets[0].data = [65, 48, 42, 35, 28];
    chart.data.datasets[0].backgroundColor = COLORS.palette.slice(0, 5);
    chart.update();
    updateBadge(chart.data.datasets[0].data);
    setActiveBtn(btnSurvey);
  });

  btnReset.addEventListener('click', () => {
    chart.data.labels = [...validLabels];
    chart.data.datasets[0].data = [...validData];
    chart.data.datasets[0].backgroundColor = COLORS.palette.slice(0, 4);
    chart.update();
    updateBadge(validData);
    setActiveBtn(btnReset);
  });
}

/* -------------------------------------------------
   Section 4: Color Must Be Intentional
   ------------------------------------------------- */
function initColorCharts() {
  const labels = ['Q1', 'Q2', 'Q3', 'Q4'];
  const values = [120, 95, 140, 110];

  // Rainbow — no meaning
  createBarChart('colorRainbowChart', labels, values, {
    colors: COLORS.badPalette.slice(0, 4),
  });

  // Misleading — red=profit, green=loss
  createBarChart('colorMisleadChart',
    ['Profit', 'Profit', 'Loss', 'Loss'],
    [120, 95, -40, -25],
    {
      colors: ['#ef4444', '#ef4444', '#10b981', '#10b981'],
      yFormat: v => '$' + v + 'k',
    }
  );

  // Intentional — one highlighted, rest grey
  const grey = '#4f5280';
  createBarChart('colorIntentChart', labels, values, {
    colors: [grey, grey, COLORS.accent, grey],
  });
}
