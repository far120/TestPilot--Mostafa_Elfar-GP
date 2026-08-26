/**
 * Endpoint reference:
 *   GET    /api/projects                         → PaginatedResponse<ProjectResponse>
 *   POST   /api/projects                         → ProjectResponse  (201)
 *   GET    /api/projects/:id                     → ProjectResponse
 *   PUT    /api/projects/:id                     → ProjectResponse
 *   DELETE /api/projects/:id                     → (204)
 *   GET    /api/projects/:id/stats               → ProjectStats
 *   GET    /api/projects/:id/test-cases          → PaginatedResponse<TestCaseResponse>
 *   GET    /api/projects/:id/test-runs           → PaginatedResponse<TestRunListResponse>
 */

import { get, post, put, del } from './client.js'

 // Fetch a paginated list of all projects.
export function listProjects({ page = 1, pageSize = 50 } = {}) {
  return get(`/projects?page=${page}&page_size=${pageSize}`)
}

// get project by id
export function getProject(id) {
  return get(`/projects/${id}`)
}


 // Fetch aggregate stats for a project (pass rate, total runs, …).

export function getProjectStats(id) {
  return get(`/projects/${id}/stats`)
}


 // Fetch the test cases that belong to a project.
 
export function listProjectTestCases(id, { page = 1, pageSize = 100 } = {}) {
  return get(`/projects/${id}/test-cases?page=${page}&page_size=${pageSize}`)
}


 // Fetch all test runs across every test case in a project.

export function listProjectTestRuns(id, { page = 1, pageSize = 50 } = {}) {
  return get(`/projects/${id}/test-runs?page=${page}&page_size=${pageSize}`)
}


 // Create a new project.
 
export function createProject(data) {
  return post('/projects', data)
}


 // Update a project's name or description.
 
export function updateProject(id, data) {
  return put(`/projects/${id}`, data)
}

// Delete a project and all of its test cases.

export function deleteProject(id) {
  return del(`/projects/${id}`)
}


