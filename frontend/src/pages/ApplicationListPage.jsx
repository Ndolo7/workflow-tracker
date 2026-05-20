import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { api } from '../api'

function statusClass(status) {
  return `status status-${status.toLowerCase().replace(/\s+/g, '-')}`
}

export default function ApplicationListPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.listApplications().then(setItems).catch((err) => setError(err.message))
  }, [])

  const stats = useMemo(() => {
    const submitted = items.filter((x) => x.status === 'Submitted').length
    const review = items.filter((x) => x.status === 'Under Review').length
    const done = items.filter((x) => x.status === 'Approved' || x.status === 'Rejected').length
    return { total: items.length, submitted, review, done }
  }, [items])

  return (
    <section className="card-panel">
      <div className="section-head">
        <h2>Applications</h2>
        <span className="meta-pill">Live Register</span>
      </div>

      <div className="kpi-grid">
        <article><p>Total</p><h3>{stats.total}</h3></article>
        <article><p>Submitted</p><h3>{stats.submitted}</h3></article>
        <article><p>In Review</p><h3>{stats.review}</h3></article>
        <article><p>Closed</p><h3>{stats.done}</h3></article>
      </div>

      {error && <p className="error">{error}</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Tracking Number</th>
              <th>Applicant</th>
              <th>Company</th>
              <th>Type</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td><Link to={`/applications/${item.id}`}>{item.tracking_number}</Link></td>
                <td>{item.applicant_name}</td>
                <td>{item.company_name}</td>
                <td>{item.application_type}</td>
                <td><span className={statusClass(item.status)}>{item.status}</span></td>
                <td>{new Date(item.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
