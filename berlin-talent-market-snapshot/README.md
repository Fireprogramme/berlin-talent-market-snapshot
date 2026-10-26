# Berlin Talent Market Snapshot

An interactive, responsive recruitment research portfolio project built with **HTML, CSS and vanilla JavaScript**. No build step, npm packages, database, API keys or external libraries required.

## Important data disclosure

**This is a research prototype, not a live job board or a verified snapshot of current hiring.** The seven seed records came from an earlier manual collection exercise; the original advertisements and their extracted details have **not been independently reverified** for this release. All records are marked `unverified`. Source links may be stale or broken. Do not claim that all seven positions are currently hiring or that this sample represents Berlin's overall job market.

## Features

- Responsive dashboard and accessible navigation
- Search across employers, roles, locations and skills
- Category, seniority and verification filters
- Dynamic skill-frequency, seniority and language charts
- Verification coverage and transparent limitations
- Source links and per-record metadata
- CSV export of the filtered sample
- GitHub Pages compatible, with relative asset paths

## Run locally

Open this folder in VS Code and select **Open with Live Server** on `index.html`.

Alternatively, from the project directory run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser. Do not open `index.html` with `file://`, since `fetch('jobs.json')` requires HTTP in many browsers.

## Publish to GitHub Pages

1. Create a new **public** GitHub repository named `berlin-talent-market-snapshot`.
2. Upload the contents of this folder to the repository root (including `index.html`, `style.css`, `script.js` and `jobs.json`).
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then **Save**.
5. Wait for GitHub Pages to publish the site. Its URL will usually have the format `https://YOUR_USERNAME.github.io/berlin-talent-market-snapshot/`.
6. Open the live page and verify charts, filtering, source links and CSV export.

## Dataset schema

Each object in `jobs.json` has: `id`, `company`, `title`, `location`, `category`, `seniority`, `skills`, `requiredSkills`, `preferredSkills`, `language`, `workMode`, `source`, `dateRecorded`, `dateVerified`, `verificationStatus`, `notes`.

- `skills`: observed skills; not necessarily all explicitly required.
- `requiredSkills` and `preferredSkills`: empty until checked against the original advertisement.
- `dateRecorded`: date from the earlier collection record; **not proof of a verification**.
- `dateVerified`: `null` until a human reviews the original source; then use an ISO date (`YYYY-MM-DD`).
- `verificationStatus`: `unverified`, `active` or `expired`. The dashboard recognizes `active`/`expired` only if `dateVerified` is populated.
- `notes`: document source discrepancies, assumptions and changes.

### Manual audit protocol

1. Open the employer's original advertisement link.
2. Check employer, title, location, work arrangement and language requirement.
3. Determine whether the job is **currently advertised** or **no longer available**; if inconclusive, keep `unverified`.
4. Copy only explicitly stated required/preferred skills into the appropriate arrays.
5. Record the actual review date in `dateVerified`, set `verificationStatus` accordingly and explain uncertainties in `notes`.
6. Add more records across software engineering, cloud, data, AI, junior, mid-level and senior roles. Avoid drawing population-level conclusions from a convenience sample.

## Analysis rules

- Skill names are normalized for known aliases; each skill counts once per advertisement.
- Seniority is inferred from the stored `seniority` label, not the title or years of experience.
- Language groups are inferred from the stored `language` label; ambiguous values remain ambiguous.
- Charts and insights update with filters, while the four overview metrics describe the complete dataset.
- Verified status requires a `dateVerified` value.
- The dataset is non-random, small and heavily weighted toward data/AI positions. The charts are **descriptive only**.

## Testing

Run `node tests/validate.mjs` to check JSON structure, unique IDs, source URL formats and key dataset assumptions. For an additional syntax check, run `node --check script.js`.

## CV-ready description (accurate at current stage)

**Berlin Talent Market Snapshot — Independent Recruitment Research Dashboard**  
Built a responsive JavaScript dashboard to explore a manually collected sample of Berlin technology job advertisements, including skill-frequency analysis, seniority/language segmentation, data-quality tracking, interactive filters and CSV export. Documented source links, research limitations and a repeatable verification workflow.

**Do not** claim the project tracks live hiring demand, covers 30 verified jobs, or provides validated Berlin-wide market insights until those improvements are actually completed.

## License

MIT — see `LICENSE`.
