const isElectronShell =
  window.location.protocol === 'file:' ||
  new URLSearchParams(window.location.search).has('electron')

const BASE = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || (
  isElectronShell ? 'http://localhost:8000/api' : '/api'
)

//Error type

export class ApiError extends Error {
  constructor(status, message, body = null) {
    super(message)
    this.name    = 'ApiError'
    this.status  = status
    this.body    = body
  }
}

// Core fetch wrapper

export async function apiFetch(path, init = {}) {
  const headers = { ...init.headers }

  if (init.body && typeof init.body === 'string') {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${BASE}${path}`, { ...init, headers })

  // 204 No Content — nothing to parse
  if (response.status === 204) return null

  let body
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    body = await response.json()
  } else {
    body = await response.text()
  }

  if (!response.ok) {
    // FastAPI wraps validation errors as { detail: string | object[] }
    const message =
      (typeof body === 'object' && body !== null && body.detail)
        ? (typeof body.detail === 'string' ? body.detail : JSON.stringify(body.detail))
        : `HTTP ${response.status}`

    throw new ApiError(response.status, message, body)
  }

  return body
}



/** GET /api{path} */
export const get  = (path) => apiFetch(path)

/** POST /api{path} with a JSON body */
export const post = (path, data)  => apiFetch(path, { method: 'POST',   body: JSON.stringify(data) })

/** PUT /api{path} with a JSON body */
export const put  = (path, data)  => apiFetch(path, { method: 'PUT',    body: JSON.stringify(data) })

/** DELETE /api{path} */
export const del  = (path)        => apiFetch(path, { method: 'DELETE' })




//WebSocket URL helper


 
 //   wss://host/api/test-cases/<id>/execute   (https)
 //   ws://host/api/test-cases/<id>/execute    (http)
 
export function wsUrl(testCaseId) {
  if (isElectronShell) {
    return `ws://localhost:8000/api/test-cases/${testCaseId}/execute`
  }

  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  return `${protocol}://${window.location.host}/api/test-cases/${testCaseId}/execute`
}
