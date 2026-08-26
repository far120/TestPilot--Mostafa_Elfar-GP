/**
 * Test Case API — wraps every /api/test-cases endpoint.
 *
 * Endpoint reference:
 *   GET    /api/test-cases?project_id=…        → PaginatedResponse<TestCaseResponse>
 *   POST   /api/test-cases                     → TestCaseResponse  (201)
 *   GET    /api/test-cases/:id                 → TestCaseResponse
 *   PUT    /api/test-cases/:id                 → TestCaseResponse
 *   DELETE /api/test-cases/:id                 → (204)
 *   GET    /api/test-cases/:id/runs            → PaginatedResponse<TestRunListResponse>
 *   POST   /api/test-cases/:id/run             → TestRunResponse   (sync, blocks until done)
 *   WS     /api/test-cases/:id/execute         → streamed events   (see useRunWebSocket)
 */

import { get, post, put, del } from './client.js'



 // Fetch all test cases for a project.

export function listTestCases(projectId, { page = 1, pageSize = 100 } = {}) {
  return get(`/test-cases?project_id=${projectId}&page=${page}&page_size=${pageSize}`)
}


 // Fetch a single test case (includes full steps array).
export function getTestCase(id) {
  return get(`/test-cases/${id}`)
}


 // Fetch paginated run history for a test case.

export function listTestCaseRuns(id, { page = 1, pageSize = 20 } = {}) {
  return get(`/test-cases/${id}/runs?page=${page}&page_size=${pageSize}`)
}




 // Create a new test case

export function createTestCase(data) {
  return post('/test-cases', data)
}


 // Update an existing test case.
 
export function updateTestCase(id, data) {
  return put(`/test-cases/${id}`, data)
}


 // Delete a test case and all of its runs.

export function deleteTestCase(id) {
  return del(`/test-cases/${id}`)
}

// ── Execution (REST, synchronous) ─────────────────────────────────────────────
//
// This blocks until the run completes and returns the full TestRunResponse.
// Prefer the WebSocket approach (useRunWebSocket) for the live UI — use
// this only when you need a fire-and-forget run without streaming.

/**
 * Trigger a synchronous run of a test case.
 * Note: the HTTP connection stays open until the run finishes.
 * For live streaming, use the WebSocket endpoint instead.
 */
export function runTestCase(id, config = {}) {
  return post(`/test-cases/${id}/run`, {
    provider: config.provider ?? 'google',
    model:    config.model    ?? null,
    headless: config.headless ?? true,
  })
}


 // Stop a running test case.

export function stopTestCase(id) {
  return post(`/test-cases/${id}/stop`)
}
