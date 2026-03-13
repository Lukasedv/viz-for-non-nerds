# Viz for Non-Nerds 📊

> **A Data Scientist's Guide to Communicating with Humans**

[![Deploy to GitHub Pages](https://github.com/Lukasedv/viz-for-non-nerds/actions/workflows/static.yml/badge.svg)](https://github.com/Lukasedv/viz-for-non-nerds/actions/workflows/static.yml)
[![License: Educational](https://img.shields.io/badge/License-Educational-blue.svg)](#-license)

An interactive, zero-dependency web course covering **6 essential topics** on how to visualize data effectively for non-technical audiences. Designed for data science team learning days — open it in a browser and go.

**[▶ Launch the course](https://lukasedv.github.io/viz-for-non-nerds/)**

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Course Topics](#-course-topics)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🗂 About the Project

Data scientists often struggle to make their insights land with non-technical stakeholders. Charts that make perfect sense to the analyst are confusing or misleading to the audience. **Viz for Non-Nerds** bridges that gap.

This self-contained web course walks learners through six focused modules — each with interactive demos, before/after comparisons, and practical rules — so that every chart you produce tells a clear, compelling story.

Key highlights:

- **No installation required** — pure static HTML/CSS/JS, runs in any modern browser.
- **Hands-on interactivity** — toggle chart junk, scrub Y-axis distortion sliders, live-edit titles.
- **Research-backed** — grounded in the work of Tufte, Knaflic, Wilke, Cairo, and Rost.
- **Ready to fork and host** — one-click deploy to GitHub Pages.

---

## 📖 Course Topics

| # | Topic | Key Takeaway |
|---|-------|-------------|
| 1 | **Make a Figure for the Generals** | Ruthless simplification — if a chart needs 30 seconds, it failed |
| 2 | **The SWD Framework** | Cole Nussbaumer Knaflic's 6-step Context → Story process |
| 3 | **Eliminate Chart Junk** | Strip away noise and let the data-ink ratio do the talking |
| 4 | **Story-Driven Titles** | Your title should reveal the insight, not just label the axes |
| 5 | **Non-Negotiable Rules** | Zero baselines, 100% pies, intentional color — rules that must not be broken |
| 6 | **Narrative Structure** | Give your data a story arc — tension, climax, resolution |

Each topic includes:

- Interactive Chart.js visualizations
- Before/after comparisons
- Mini-dashboards
- Practical tips for slide decks

---

## ✅ Prerequisites

No software installation is required to **use** this course.

| Requirement | Details |
|------------|---------|
| Modern web browser | Chrome, Firefox, Edge, or Safari (last 2 major versions) |
| Internet connection | Only needed to load Chart.js and Google Fonts from CDN on first visit |

To **host or develop** locally you only need:

| Requirement | Details |
|------------|---------|
| Git | Any recent version |
| A local HTTP server (optional) | e.g. `python -m http.server`, VS Code Live Server, or any static file server |

---

## 🚀 Getting Started

### Option 1 — Use the live site

Open **[https://lukasedv.github.io/viz-for-non-nerds/](https://lukasedv.github.io/viz-for-non-nerds/)** in your browser. No setup needed.

### Option 2 — Run locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/Lukasedv/viz-for-non-nerds.git
   cd viz-for-non-nerds
   ```

2. **Start a local server** (pick whichever you have available)

   ```bash
   # Python 3
   python -m http.server 8080

   # Node.js (npx, no install required)
   npx serve .
   ```

3. **Open your browser** at `http://localhost:8080`

### Option 3 — Deploy your own GitHub Pages copy

1. Fork or push this repository to your GitHub account.
2. Go to **Settings → Pages**.
3. Set the source to **Deploy from a branch** → `main` → `/ (root)`.
4. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

No build step is required — it's all static HTML/CSS/JS.

---

## 🛠 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Vanilla HTML / CSS / JavaScript | Core structure, styles, and interactivity — no framework, no build step |
| [Chart.js 4.x](https://www.chartjs.org/) (CDN) | All interactive chart visualizations |
| [Google Fonts](https://fonts.google.com/) — Inter & JetBrains Mono | Typography |
| GitHub Pages | Hosting and continuous deployment |
| GitHub Actions | Automatic deployment on every push to `main` |

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome!

### Reporting an issue

1. Check the [existing issues](https://github.com/Lukasedv/viz-for-non-nerds/issues) to avoid duplicates.
2. Open a [new issue](https://github.com/Lukasedv/viz-for-non-nerds/issues/new) and describe:
   - What you expected to happen
   - What actually happened
   - Steps to reproduce (include browser/OS if relevant)

### Submitting a pull request

1. Fork the repository and create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes. Since there is no build step, you can preview changes immediately by opening the relevant HTML file in a browser (or using a local server as described in [Getting Started](#-getting-started)).

3. Commit with a clear message:

   ```bash
   git commit -m "feat: describe your change"
   ```

4. Push your branch and open a pull request against `main`:

   ```bash
   git push origin feature/your-feature-name
   ```

5. Fill in the pull-request template and await review.

### Style guidelines

- Keep all assets self-contained in `css/`, `js/`, or inline — no external build tools.
- Match the existing code style (2-space indent, single quotes in JS).
- Test in at least two modern browsers before submitting.

---

## 📄 License

This project is made available for **educational use**. The course content is based on publicly available research from:

- Cole Nussbaumer Knaflic (*Storytelling with Data*)
- Edward Tufte (*The Visual Display of Quantitative Information*)
- Claus Wilke (*Fundamentals of Data Visualization*)
- Alberto Cairo (*The Functional Art*)
- Lisa Charlotte Rost (Datawrapper Blog)

Please credit original authors when reusing or adapting this material.
