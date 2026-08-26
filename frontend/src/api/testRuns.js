/**
 * Test Run API — wraps every /api/test-runs endpoint.
 *
 * Endpoint reference:
 *   GET    /api/test-runs/:id                  → TestRunResponse
 *   DELETE /api/test-runs/:id                  → (204)
 *   GET    /api/test-runs/:id/screenshots      → { screenshots: ScreenshotMeta[] }
 *   GET    /api/test-runs/:id/screenshots/:n   → image bytes  (used as <img src>)
 *   GET    /api/test-runs/:id/logs             → { logs: string }
 */

import { get, del } from './client.js'




 // Fetch full details for a single run, including step results.
 
export function getTestRun(id) {
  return get(`/test-runs/${id}`)
}


 // Fetch metadata for all screenshots in a run (no image bytes).
export function getScreenshots(runId) {
  return get(`/test-runs/${runId}/screenshots`)
}

/**
 * Build the URL for a screenshot image by its DB id.
 * Use directly as the `src` of an <img> tag — the browser fetches the bytes.
 */
export function screenshotUrl(runId, screenshotId) {
  return `/api/test-runs/${runId}/screenshots/${screenshotId}`
}

/**
 * Fetch the raw log text for a run.
 * Optionally limited to the last N lines.
 */
export function getLogs(runId, { lines } = {}) {
  const qs = lines ? `?lines=${lines}` : ''
  return get(`/test-runs/${runId}/logs${qs}`)
}


 // Delete a test run and all associated screenshots / logs.

export function deleteTestRun(id) {
  return del(`/test-runs/${id}`)
}

 