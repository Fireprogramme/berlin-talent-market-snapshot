import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const jobs = JSON.parse(readFileSync(new URL('../jobs.json', import.meta.url), 'utf8'));
assert.ok(Array.isArray(jobs) && jobs.length > 0, 'Dataset must be a nonempty array');
assert.equal(new Set(jobs.map(job => job.id)).size, jobs.length, 'Job IDs must be unique');
for (const job of jobs) {
  for (const field of ['company','title','location','category','seniority','language','source','verificationStatus']) assert.equal(typeof job[field], 'string', `Invalid ${field} on ID ${job.id}`);
  assert.ok(Array.isArray(job.skills), `Missing skills array for ${job.id}`);
  assert.ok(Array.isArray(job.requiredSkills) && Array.isArray(job.preferredSkills), `Missing skill classification arrays for ${job.id}`);
  assert.ok(new URL(job.source).protocol === 'https:', `Source must be HTTPS for ${job.id}`);
  assert.ok(['unverified','active','expired'].includes(job.verificationStatus), `Invalid status for ${job.id}`);
  if (job.verificationStatus !== 'unverified') assert.match(job.dateVerified || '', /^\d{4}-\d{2}-\d{2}$/, `Verified record ${job.id} needs a date`);
}
assert.equal(jobs.length, 7, 'Seed dataset should have 7 records');
assert.equal(new Set(jobs.map(job => job.company)).size, 5, 'Seed dataset should have 5 employers');
assert.equal(jobs.filter(job => job.skills.includes('Python')).length, 6, 'Python should occur in 6 seed records');
console.log(`PASS: ${jobs.length} valid records; unique IDs; valid sources; verification fields; seed counts.`);
