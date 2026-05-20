const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

function requestId() {
  return `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

async function request(path, options = {}) {
  const id = requestId()
  const method = options.method || 'GET'
  const startedAt = performance.now()

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Request-ID': id,
      ...(options.headers || {}),
    },
    ...options,
  })

  const elapsed = Math.round(performance.now() - startedAt)
  const data = await res.json()

  console.debug(`[api:${id}] ${method} ${path} -> ${res.status} (${elapsed}ms)`, data)

  if (!res.ok) {
    const detailMessage = data?.detail && typeof data.detail === 'string' ? data.detail : ''
    throw new Error(data.message || detailMessage || 'Request failed')
  }
  return data
}

export const api = {
  listApplications: () => request('/applications'),
  getApplication: (id) => request(`/applications/${id}`),
  createApplication: (payload) => request('/applications', { method: 'POST', body: JSON.stringify(payload) }),
  updateApplication: (id, payload) => request(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
  submitApplication: (id) => request(`/applications/${id}/submit`, { method: 'POST' }),
  startReview: (id) => request(`/applications/${id}/start-review`, { method: 'POST' }),
  decision: (id, payload) => request(`/applications/${id}/decision`, { method: 'POST', body: JSON.stringify(payload) }),
}
