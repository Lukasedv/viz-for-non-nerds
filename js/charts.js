/* ============================================
   Charts.js — Chart.js helpers & factories
   ============================================ */

const COLORS = {
  accent: '#6366f1',
  accentLight: '#818cf8',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  text: '#e8eaf0',
  textSecondary: '#9ca3b4',
  muted: '#6b7280',
  gridLine: 'rgba(45, 49, 72, 0.6)',
  gridLineBad: 'rgba(100, 100, 120, 0.4)',

  palette: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'],
  paletteMuted: ['#4f5280', '#0d8c63', '#b8780a', '#b53636', '#6b45a1', '#0590a1', '#c05a12', '#b83872'],

  badPalette: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ff8800', '#88ff00'],
};

/* Default Chart.js configuration for dark theme */
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: true,
  aspectRatio: 2,
  plugins: {
    legend: {
      labels: {
        color: COLORS.textSecondary,
        font: { family: "'Inter', sans-serif", size: 12 },
        padding: 16,
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
      titleFont: { family: "'Inter', sans-serif", weight: '600' },
      bodyFont: { family: "'Inter', sans-serif" },
    }
  },
  scales: {
    x: {
      grid: { color: COLORS.gridLine, drawBorder: false },
      ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } },
    },
    y: {
      grid: { color: COLORS.gridLine, drawBorder: false },
      ticks: { color: COLORS.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } },
    }
  }
};

/* Deep-merge helper */
function mergeDeep(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = mergeDeep(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

/* Create a bar chart with good defaults */
function createBarChart(canvasId, labels, data, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const config = {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: options.colors || COLORS.palette.slice(0, data.length),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 60,
      }]
    },
    options: mergeDeep(CHART_DEFAULTS, {
      plugins: {
        legend: { display: options.showLegend || false },
        title: options.title ? {
          display: true,
          text: options.title,
          color: COLORS.text,
          font: { family: "'Inter', sans-serif", size: 14, weight: '600' },
          padding: { bottom: 16 }
        } : { display: false }
      },
      scales: {
        y: {
          beginAtZero: options.beginAtZero !== false,
          min: options.yMin,
          max: options.yMax,
          grid: { color: COLORS.gridLine },
          ticks: {
            color: COLORS.textSecondary,
            callback: options.yFormat || undefined,
          }
        },
        x: {
          grid: { display: false }
        }
      },
      indexAxis: options.horizontal ? 'y' : 'x',
      ...options.extra
    })
  };

  return new Chart(ctx, config);
}

/* Create a line chart with good defaults */
function createLineChart(canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const formattedDatasets = datasets.map((ds, i) => ({
    label: ds.label || `Series ${i + 1}`,
    data: ds.data,
    borderColor: ds.color || COLORS.palette[i],
    backgroundColor: (ds.color || COLORS.palette[i]) + '20',
    fill: ds.fill || false,
    tension: 0.4,
    pointRadius: ds.pointRadius !== undefined ? ds.pointRadius : 3,
    pointHoverRadius: 6,
    borderWidth: 2.5,
    ...ds.extra
  }));

  const config = {
    type: 'line',
    data: { labels, datasets: formattedDatasets },
    options: mergeDeep(CHART_DEFAULTS, {
      plugins: {
        legend: { display: datasets.length > 1 },
        title: options.title ? {
          display: true,
          text: options.title,
          color: COLORS.text,
          font: { family: "'Inter', sans-serif", size: 14, weight: '600' },
          padding: { bottom: 16 }
        } : { display: false }
      },
      scales: {
        y: {
          beginAtZero: options.beginAtZero || false,
          min: options.yMin,
          max: options.yMax,
        }
      },
      ...options.extra
    })
  };

  return new Chart(ctx, config);
}

/* Create a pie/doughnut chart */
function createPieChart(canvasId, labels, data, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const config = {
    type: options.doughnut ? 'doughnut' : 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: options.colors || COLORS.palette.slice(0, data.length),
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
        },
        title: options.title ? {
          display: true,
          text: options.title,
          color: COLORS.text,
          font: { family: "'Inter', sans-serif", size: 14, weight: '600' },
          padding: { bottom: 16 }
        } : { display: false }
      }
    }
  };

  return new Chart(ctx, config);
}

/* Create a scatter chart */
function createScatterChart(canvasId, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const formattedDatasets = datasets.map((ds, i) => ({
    label: ds.label || `Series ${i + 1}`,
    data: ds.data,
    backgroundColor: (ds.color || COLORS.palette[i]) + 'cc',
    borderColor: ds.color || COLORS.palette[i],
    borderWidth: 1,
    pointRadius: ds.pointRadius || 5,
    pointHoverRadius: 8,
    ...ds.extra
  }));

  const config = {
    type: 'scatter',
    data: { datasets: formattedDatasets },
    options: mergeDeep(CHART_DEFAULTS, {
      plugins: {
        legend: { display: datasets.length > 1 },
        title: options.title ? {
          display: true,
          text: options.title,
          color: COLORS.text,
          font: { family: "'Inter', sans-serif", size: 14, weight: '600' },
          padding: { bottom: 16 }
        } : { display: false }
      },
      scales: {
        x: {
          title: options.xLabel ? {
            display: true, text: options.xLabel,
            color: COLORS.textSecondary,
            font: { family: "'Inter', sans-serif", size: 12 }
          } : undefined,
        },
        y: {
          title: options.yLabel ? {
            display: true, text: options.yLabel,
            color: COLORS.textSecondary,
            font: { family: "'Inter', sans-serif", size: 12 }
          } : undefined,
        }
      },
      ...options.extra
    })
  };

  return new Chart(ctx, config);
}
