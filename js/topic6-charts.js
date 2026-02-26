/* ============================================
   Topic 6: Narrative Structure — Charts & Interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initStoryArc();
  initOneChartPerPoint();
  initTemplatesTabs();
  initDashboardCharts();
});

/* --- Data: Monthly preprint submissions (synthetic, based on Wilke's story) --- */

function generateQbioData() {
  const labels = [];
  const data = [];
  // 2007–2018, quarterly for clarity
  for (let year = 2007; year <= 2018; year++) {
    for (let q = 1; q <= 4; q++) {
      const label = `${year} Q${q}`;
      labels.push(label);
      const t = (year - 2007) * 4 + (q - 1);
      if (year < 2014) {
        // Exponential growth: ~10 to ~120
        data.push(Math.round(10 * Math.exp(0.09 * t) + (Math.random() - 0.5) * 8));
      } else {
        // Flat after 2013: ~110-130
        data.push(Math.round(115 + (Math.random() - 0.5) * 20));
      }
    }
  }
  return { labels, data };
}

function generateBiorxivData(labels) {
  return labels.map((label) => {
    const year = parseInt(label.split(' ')[0]);
    const q = parseInt(label.split('Q')[1]);
    const t = (year - 2014) * 4 + (q - 1);
    if (year < 2014) return null;
    // Exponential growth starting from ~5 in 2014
    return Math.round(5 * Math.exp(0.12 * t) + (Math.random() - 0.5) * 10);
  });
}


/* --- Section 2: Story Arc --- */

let storyCharts = {};

function destroyStoryChart(key) {
  if (storyCharts[key]) {
    storyCharts[key].destroy();
    storyCharts[key] = null;
  }
}

function initStoryArc() {
  const container = document.getElementById('preprint-story');
  if (!container) return;

  const seq = createStorySequence('preprint-story');
  if (!seq) return;

  const qbio = generateQbioData();

  // Wrap show to create/destroy charts on step change
  const origPrev = container.querySelector('.story-prev');
  const origNext = container.querySelector('.story-next');

  function onStepChange() {
    const current = seq.getCurrent();
    destroyStoryChart('qbio');
    destroyStoryChart('resolution');

    if (current === 1) {
      // Challenge chart: q-bio only
      setTimeout(() => {
        storyCharts.qbio = createLineChart('chart-qbio-growth', qbio.labels, [
          { label: 'q-bio submissions', data: qbio.data, color: COLORS.accent }
        ], {
          title: 'arXiv q-bio: Monthly Submissions',
          beginAtZero: true,
          extra: {
            plugins: {
              annotation: false,
            }
          }
        });
      }, 50);
    }

    if (current === 3) {
      const biorxivData = generateBiorxivData(qbio.labels);
      setTimeout(() => {
        storyCharts.resolution = createLineChart('chart-preprint-resolution', qbio.labels, [
          { label: 'q-bio (arXiv)', data: qbio.data, color: COLORS.accent },
          { label: 'bioRxiv', data: biorxivData, color: COLORS.success }
        ], {
          title: 'bioRxiv Absorbed the Biology Preprint Growth',
          beginAtZero: true
        });
      }, 50);
    }
  }

  // Listen for clicks on story controls
  if (origPrev) origPrev.addEventListener('click', () => setTimeout(onStepChange, 10));
  if (origNext) origNext.addEventListener('click', () => setTimeout(onStepChange, 10));

  // Initial step
  onStepChange();
}


/* --- Section 3: One Chart Per Point (Before/After) --- */

function initOneChartPerPoint() {
  const qbio = generateQbioData();
  const biorxivData = generateBiorxivData(qbio.labels);

  // "Before" — overloaded chart with both datasets
  createLineChart('chart-overloaded', qbio.labels, [
    { label: 'q-bio (arXiv)', data: qbio.data, color: COLORS.accent },
    { label: 'bioRxiv', data: biorxivData, color: COLORS.success },
    {
      label: 'Combined total',
      data: qbio.data.map((v, i) => v + (biorxivData[i] || 0)),
      color: COLORS.warning,
      extra: { borderDash: [5, 5], borderWidth: 1.5, pointRadius: 0 }
    }
  ], {
    title: 'All Preprint Data — Too Much at Once',
    beginAtZero: true
  });

  // "After" — sequential chart 1: q-bio only
  createLineChart('chart-sequential-1', qbio.labels, [
    { label: 'q-bio submissions', data: qbio.data, color: COLORS.accent }
  ], { beginAtZero: true });

  // "After" — sequential chart 2: bioRxiv only
  createLineChart('chart-sequential-2', qbio.labels, [
    { label: 'bioRxiv submissions', data: biorxivData, color: COLORS.success }
  ], { beginAtZero: true });
}


/* --- Section 4: Templates Tabs --- */

function initTemplatesTabs() {
  document.querySelectorAll('.step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.dataset.step;
      document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.step-content').forEach(c => c.classList.remove('active'));
      const target = document.getElementById(step);
      if (target) target.classList.add('active');
    });
  });
}


/* --- Section 5: Dashboard Charts --- */

function initDashboardCharts() {
  // Revenue by Quarter bar chart
  createBarChart('chart-revenue-quarters',
    ['Q1', 'Q2', 'Q3', 'Q4'],
    [620, 615, 480, 685],
    {
      colors: [COLORS.accent, COLORS.accent, COLORS.danger, COLORS.success],
      beginAtZero: true,
      yFormat: (v) => '$' + v + 'K',
    }
  );

  // Acquisition vs Revenue line chart
  createLineChart('chart-acquisition-revenue',
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    [
      {
        label: 'New Customers',
        data: [120, 135, 142, 155, 160, 158, 150, 148, 145, 170, 185, 200],
        color: COLORS.accent
      },
      {
        label: 'Revenue ($K)',
        data: [210, 215, 220, 210, 205, 200, 155, 160, 165, 220, 235, 250],
        color: COLORS.success
      }
    ],
    { beginAtZero: true }
  );
}
