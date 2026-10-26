"use strict";

const $ = (id) => document.getElementById(id);
const state = { all: [], filtered: [] };

function el(tag, className = "", content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = String(content);
  return node;
}

function safeArray(value) { return Array.isArray(value) ? value : []; }
function normalizedSkill(value) {
  const raw = String(value || "").trim();
  const aliases = { "spark": "Apache Spark", "apache spark": "Apache Spark", "python": "Python", "sql": "SQL", "aws": "AWS", "ci/cd": "CI/CD", "databricks": "Databricks", "pyspark": "PySpark", "aws glue": "AWS Glue", "git": "Git", "machine learning": "Machine Learning" };
  return aliases[raw.toLowerCase()] || raw;
}
function countSkills(jobs) {
  const counts = new Map();
  jobs.forEach(job => {
    const unique = new Set(safeArray(job.skills).map(normalizedSkill).filter(Boolean));
    unique.forEach(skill => counts.set(skill, (counts.get(skill) || 0) + 1));
  });
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
function seniority(job) {
  const label = String(job.seniority || "").toLowerCase();
  if (/senior|lead|principal/.test(label)) return "Senior";
  if (/junior|entry|graduate/.test(label)) return "Junior";
  if (/mid|experienced/.test(label)) return "Mid / experienced";
  return "Not specified";
}
function language(job) {
  const label = String(job.language || "").toLowerCase();
  if (label.includes("german and english required") || label.includes("english and german required")) return "German + English required";
  if (label.includes("german required")) return "German required";
  if (label.includes("german preferred")) return "English required / German preferred";
  if (label.includes("english required")) return "English required";
  if (label.trim() === "english") return "English listed (requirement unclear)";
  return "Not verified";
}
function verification(job) {
  const value = String(job.verificationStatus || "unverified").toLowerCase();
  // A verified status needs a verification date, not just a label.
  if ((value === "active" || value === "expired") && /^\d{4}-\d{2}-\d{2}$/.test(String(job.dateVerified || ""))) return value;
  return "unverified";
}
function pct(n, d) { return d ? `${(n / d * 100).toFixed(1)}%` : "0%"; }
function countBy(jobs, classify) {
  const counts = new Map();
  jobs.forEach(job => { const key = classify(job); counts.set(key, (counts.get(key) || 0) + 1); });
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
}
function renderChart(container, rows) {
  container.replaceChildren();
  if (!rows.length) { container.append(el("p", "empty-chart", "No data for this selection.")); return; }
  const max = Math.max(1, ...rows.map(row => row[1]));
  rows.forEach(([label, value]) => {
    const row = el("div", "bar-row");
    const track = el("div", "bar-track");
    const fill = el("div", "bar-fill");
    fill.style.width = `${100 * value / max}%`;
    track.append(fill);
    row.append(el("span", "bar-label", label), track, el("span", "bar-count", value));
    container.append(row);
  });
}
function renderJobs(jobs) {
  $("jobGrid").replaceChildren();
  $("resultCount").textContent = `${jobs.length} ${jobs.length === 1 ? "record" : "records"}`;
  if (!jobs.length) { $("jobGrid").append(el("div", "empty-state", "No matching records. Try clearing or adjusting the filters.")); return; }
  jobs.forEach(job => {
    const card = el("article", "job-card");
    const top = el("div", "job-top");
    top.append(el("div", "company-badge", String(job.company || "?")[0]), el("span", "category-tag", job.category || "Uncategorized"));
    card.append(top, el("h3", "", job.title || "Untitled role"), el("p", "company-line", `${job.company || "Unknown employer"} · ${job.location || "Unknown location"}`));
    card.append(el("p", "job-detail", `Seniority: ${job.seniority || "Not specified"}`));
    card.append(el("p", "job-detail", `Languages: ${job.language || "Not verified"}`));
    card.append(el("p", "job-detail", `Work mode: ${job.workMode || "Not specified"}`));
    const tags = el("div", "skill-tags");
    [...new Set(safeArray(job.skills).map(normalizedSkill))].forEach(skill => tags.append(el("span", "skill-tag", skill)));
    card.append(tags);
    const bottom = el("div", "job-bottom");
    const status = verification(job);
    bottom.append(el("span", `verification-badge verification-${status}`, status === "unverified" ? "Source not verified" : `Verified ${status}`));
    if (job.source) {
      try {
        const url = new URL(job.source);
        if (url.protocol === "https:" || url.protocol === "http:") {
          const link = el("a", "source-link", "Open original source ↗");
          link.href = url.href; link.target = "_blank"; link.rel = "noopener noreferrer";
          bottom.append(link);
        }
      } catch (_) { /* invalid source URL: omit link */ }
    }
    bottom.append(el("div", "job-footer", `Record date: ${job.dateRecorded || "Unknown"}${job.dateVerified ? ` · Verified: ${job.dateVerified}` : " · Verification pending"}`));
    card.append(bottom); $("jobGrid").append(card);
  });
}
function renderQuality(jobs) {
  const counts = { active: 0, expired: 0, unverified: 0 };
  jobs.forEach(job => counts[verification(job)]++);
  $("activeCount").textContent = counts.active;
  $("expiredCount").textContent = counts.expired;
  $("unverifiedCount").textContent = counts.unverified;
  $("verificationRate").textContent = pct(counts.active + counts.expired, jobs.length);
}
function renderInsights(jobs) {
  const target = $("insightsList"); target.replaceChildren();
  if (!jobs.length) { target.append(el("p", "", "No records match the selected filters.")); return; }
  const skills = countSkills(jobs);
  const companies = new Set(jobs.map(job => job.company));
  const senior = jobs.filter(job => seniority(job) === "Senior").length;
  const german = jobs.filter(job => ["German required", "German + English required"].includes(language(job))).length;
  const verified = jobs.filter(job => verification(job) !== "unverified").length;
  const insights = [
    `${jobs.length} recorded advertisements from ${companies.size} employers in this selection.`,
    skills.length ? `${skills[0][0]} appears in ${skills[0][1]} of ${jobs.length} ads (${pct(skills[0][1], jobs.length)}).` : "No skills recorded.",
    `${senior} of ${jobs.length} records are classified as senior roles.`,
    `${german} of ${jobs.length} records explicitly indicate German is required.`,
    `${verified} of ${jobs.length} records have a documented verification status.`,
    "Caution: Findings describe this small, non-random sample only."
  ];
  insights.forEach(text => target.append(el("div", "insight-card", text)));
}
function update() {
  const query = $("searchInput").value.trim().toLowerCase();
  const category = $("categoryFilter").value;
  const level = $("seniorityFilter").value;
  const status = $("statusFilter").value;
  state.filtered = state.all.filter(job => {
    const text = [job.title, job.company, job.location, job.category, job.language, job.seniority, ...safeArray(job.skills)].join(" ").toLowerCase();
    return text.includes(query) && (category === "all" || job.category === category) && (level === "all" || seniority(job) === level) && (status === "all" || verification(job) === status);
  });
  renderJobs(state.filtered);
  renderChart($("skillsChart"), countSkills(state.filtered).slice(0, 10));
  renderChart($("seniorityChart"), countBy(state.filtered, seniority));
  renderChart($("languageChart"), countBy(state.filtered, language));
  renderQuality(state.filtered); renderInsights(state.filtered);
}
function csvCell(value) {
  // Protect against spreadsheet formula injection when opening exported CSV.
  let text = String(value ?? "");
  if (/^[\s]*[=+@\-]/.test(text)) text = "'" + text;
  return `"${text.replace(/"/g, '""')}"`;
}
function exportCSV() {
  if (!state.filtered.length) { window.alert("No matching records to export."); return; }
  const fields = ["id", "company", "title", "location", "category", "seniority", "skills", "requiredSkills", "preferredSkills", "language", "workMode", "verificationStatus", "dateRecorded", "dateVerified", "source", "notes"];
  const rows = state.filtered.map(job => fields.map(field => csvCell(Array.isArray(job[field]) ? job[field].join("; ") : (field === "verificationStatus" ? verification(job) : job[field]))).join(","));
  const csv = "\uFEFF" + [fields.map(csvCell).join(","), ...rows].join("\r\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = "berlin-talent-market-sample.csv";
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function initialize(data) {
  if (!Array.isArray(data) || data.some(job => !job || typeof job !== "object" || !job.company || !job.title || !Array.isArray(job.skills))) throw new Error("Invalid job dataset structure");
  state.all = data;
  $("jobCount").textContent = data.length;
  $("companyCount").textContent = new Set(data.map(job => job.company)).size;
  $("skillCount").textContent = countSkills(data).length;
  const categories = [...new Set(data.map(job => job.category || "Uncategorized"))].sort();
  $("categoryCount").textContent = categories.length;
  categories.forEach(category => { const option = el("option", "", category); option.value = category; $("categoryFilter").append(option); });
  [...new Set(data.map(seniority))].sort().forEach(level => { const option = el("option", "", level); option.value = level; $("seniorityFilter").append(option); });
  $("sampleUpdated").textContent = `Sample: ${data.length} records · Source audit pending`;
  update();
}
$("searchInput").addEventListener("input", update);
["categoryFilter", "seniorityFilter", "statusFilter"].forEach(id => $(id).addEventListener("change", update));
$("resetFilters").addEventListener("click", () => { $("searchInput").value = ""; ["categoryFilter", "seniorityFilter", "statusFilter"].forEach(id => $(id).value = "all"); update(); });
$("exportCSV").addEventListener("click", exportCSV);
fetch("jobs.json", { cache: "no-store" })
  .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
  .then(initialize)
  .catch(error => { console.error("Data load failed:", error); $("resultCount").textContent = "Unable to load data"; $("jobGrid").replaceChildren(el("div", "empty-state", "Could not load jobs.json. Check the JSON and use Live Server or a local HTTP server (not file://).")); });
