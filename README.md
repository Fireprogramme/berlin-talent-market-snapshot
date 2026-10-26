# Berlin Talent Market Snapshot

**Berlin Talent Market Snapshot** is an interactive recruitment research dashboard exploring technology job advertisements in Berlin. It brings together job listings, technical skills, seniority levels, language requirements and source-verification information in one place.

**[Explore the live dashboard](https://fireprogramme.github.io/berlin-talent-market-snapshot/)**

## Project overview

This project combines an interest in recruitment and talent market intelligence with practical web development and data analysis. It is designed to make a small, manually collected set of technology vacancies easier to explore, compare and interpret.

The dashboard is built using **HTML, CSS, vanilla JavaScript and JSON**, with no backend or external charting library.

## What the dashboard does

- **Job explorer:** Browse advertisements and filter by keyword, role category, seniority and verification status.
- **Skills analysis:** Compare how frequently technical skills appear across the selected advertisements.
- **Recruitment intelligence:** Explore the distribution of seniority labels and stated language requirements.
- **Research insights:** View summary observations generated from the current dataset and filters.
- **Data quality:** See whether each listing has been checked against its original source.
- **CSV export:** Download the filtered records for further analysis.

The layout is responsive and works on desktop and mobile screens.

## Data and methodology

The initial dataset contains **seven manually collected technology job records** with employer names, role titles, locations, skill labels and links to original advertisements.

The dashboard counts a skill once per advertisement and groups records by their stored seniority and language labels. Charts and observations describe the selected sample, **not the entire Berlin labour market**.

**Research limitation:** The original advertisements have not been independently reverified for this release. All seven records are currently marked **unverified**, so the project should not be interpreted as a live job board or a verified measure of current hiring demand. Source links may become outdated.

## Technology

- **HTML5** — page structure and dashboard sections
- **CSS3** — responsive styling and chart presentation
- **JavaScript** — data loading, filtering, analysis and export
- **JSON** — structured vacancy records
- **GitHub Pages** — static website hosting

## Project structure

```text
index.html          Dashboard structure
style.css           Responsive design
script.js           Filtering, analysis and interaction
jobs.json           Research dataset
tests/validate.mjs  Dataset validation
LICENSE             MIT license
```

## Project links

**Live website:** https://fireprogramme.github.io/berlin-talent-market-snapshot/  
**Source code:** https://github.com/Fireprogramme/berlin-talent-market-snapshot

## License

MIT — see [LICENSE](LICENSE).
