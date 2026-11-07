# CBE205 Week 13 — CERS quality lab

Node.js 20+. Run `npm ci`, `npm run lint`, `npm test`.

**Expected initial state:** two tests fail by design. Fix duplicate and full-capacity rules in `src/registration.js`. Add boundary tests and explain why this in-memory demo cannot establish concurrency safety. GitHub Actions runs lint + tests on push/PR. No deployment occurs in Week 13.

For production: use a transactional database operation with atomic seat allocation and UNIQUE(event_id, student_id); test real concurrent requests. A process-local mutex is insufficient across multiple instances.
