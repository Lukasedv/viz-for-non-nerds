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

/* Registry of all created chart instances for theme updates */
const _chartRegistry = [];

/* Read a CSS custom property from the document root */
function _cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* Return current theme-aware chart colors from CSS custom properties */
function _liveColors() {
  return {
    text:                _cssVar('--chart-tooltip-text')            || COLORS.text,
    textSecondary:       _cssVar('--chart-tooltip-text-secondary')  || COLORS.textSecondary,
    tooltipBg:           _cssVar('--chart-tooltip-bg')              || '#1e2130',
    tooltipBorder:       _cssVar('--chart-tooltip-border')          || '#2d3148',
    gridLine:            _cssVar('--chart-grid')                    || COLORS.gridLine,
    pieBorder:           _cssVar('--chart-pie-border')              || '#1e2130',
  };
}

/* Build chart defaults using current theme colors */
function _getChartDefaults() {
  const c = _liveColors();
  return {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        labels: {
          color: c.textSecondary,
          font: { family: "'Inter', sans-serif", size: 12 },
          padding: 16,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: c.tooltipBg,
        titleColor: c.text,
        bodyColor: c.textSecondary,
        borderColor: c.tooltipBorder,
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        titleFont: { family: "'Inter', sans-serif", weight: '600' },
        bodyFont: { family: "'Inter', sans-serif" },
      }
    },
    scales: {
      x: {
        grid: { color: c.gridLine, drawBorder: false },
        ticks: { color: c.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } },
      },
      y: {
        grid: { color: c.gridLine, drawBorder: false },
        ticks: { color: c.textSecondary, font: { family: "'Inter', sans-serif", size: 11 } },
      }
    }
  };
}

/* Alias kept for compatibility with any existing call sites */
const CHART_DEFAULTS = _getChartDefaults();

/* Update all tracked chart instances to match the current theme */
function applyThemeToCharts() {
  const c = _liveColors();
  _chartRegistry.forEach(chart => {
    if (!chart || chart.ctx === null) return; // destroyed

    // Legend labels
    if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
      chart.options.plugins.legend.labels.color = c.textSecondary;
    }
    // Tooltip
    if (chart.options.plugins && chart.options.plugins.tooltip) {
      const tt = chart.options.plugins.tooltip;
      tt.backgroundColor = c.tooltipBg;
      tt.titleColor = c.text;
      tt.bodyColor = c.textSecondary;
      tt.borderColor = c.tooltipBorder;
    }
    // Title
    if (chart.options.plugins && chart.options.plugins.title && chart.options.plugins.title.display) {
      chart.options.plugins.title.color = c.text;
    }
    // Scales
    ['x', 'y'].forEach(axis => {
      if (chart.options.scales && chart.options.scales[axis]) {
        const scale = chart.options.scales[axis];
        if (scale.ticks) scale.ticks.color = c.textSecondary;
        if (scale.grid) scale.grid.color = c.gridLine;
        if (scale.title) scale.title.color = c.textSecondary;
      }
    });
    // Pie / doughnut segment border
    if (chart.config.type === 'pie' || chart.config.type === 'doughnut') {
      chart.data.datasets.forEach(ds => {
        ds.borderColor = c.pieBorder;
      });
    }
    chart.update('none');
  });
}

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

  const c = _liveColors();
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
    options: mergeDeep(_getChartDefaults(), {
      plugins: {
        legend: { display: options.showLegend || false },
        title: options.title ? {
          display: true,
          text: options.title,
          color: c.text,
          font: { family: "'Inter', sans-serif", size: 14, weight: '600' },
          padding: { bottom: 16 }
        } : { display: false }
      },
      scales: {
        y: {
          beginAtZero: options.beginAtZero !== false,
          min: options.yMin,
          max: options.yMax,
          grid: { color: c.gridLine },
          ticks: {
            color: c.textSecondary,
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

  const chart = new Chart(ctx, config);
  _chartRegistry.push(chart);
  return chart;
}

/* Create a line chart with good defaults */
function createLineChart(canvasId, labels, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const c = _liveColors();
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
    options: mergeDeep(_getChartDefaults(), {
      plugins: {
        legend: { display: datasets.length > 1 },
        title: options.title ? {
          display: true,
          text: options.title,
          color: c.text,
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

  const chart = new Chart(ctx, config);
  _chartRegistry.push(chart);
  return chart;
}

/* Create a pie/doughnut chart */
function createPieChart(canvasId, labels, data, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const c = _liveColors();
  const config = {
    type: options.doughnut ? 'doughnut' : 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: options.colors || COLORS.palette.slice(0, data.length),
        borderColor: c.pieBorder,
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
            color: c.textSecondary,
            font: { family: "'Inter', sans-serif", size: 12 },
            padding: 16,
            usePointStyle: true,
          }
        },
        tooltip: {
          backgroundColor: c.tooltipBg,
          titleColor: c.text,
          bodyColor: c.textSecondary,
          borderColor: c.tooltipBorder,
          borderWidth: 1,
          cornerRadius: 8,
          padding: 12,
        },
        title: options.title ? {
          display: true,
          text: options.title,
          color: c.text,
          font: { family: "'Inter', sans-serif", size: 14, weight: '600' },
          padding: { bottom: 16 }
        } : { display: false }
      }
    }
  };

  const chart = new Chart(ctx, config);
  _chartRegistry.push(chart);
  return chart;
}

/* Create a scatter chart */
function createScatterChart(canvasId, datasets, options = {}) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const c = _liveColors();
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
    options: mergeDeep(_getChartDefaults(), {
      plugins: {
        legend: { display: datasets.length > 1 },
        title: options.title ? {
          display: true,
          text: options.title,
          color: c.text,
          font: { family: "'Inter', sans-serif", size: 14, weight: '600' },
          padding: { bottom: 16 }
        } : { display: false }
      },
      scales: {
        x: {
          title: options.xLabel ? {
            display: true, text: options.xLabel,
            color: c.textSecondary,
            font: { family: "'Inter', sans-serif", size: 12 }
          } : undefined,
        },
        y: {
          title: options.yLabel ? {
            display: true, text: options.yLabel,
            color: c.textSecondary,
            font: { family: "'Inter', sans-serif", size: 12 }
          } : undefined,
        }
      },
      ...options.extra
    })
  };

  const chart = new Chart(ctx, config);
  _chartRegistry.push(chart);
  return chart;
}
