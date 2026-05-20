import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { api } from '../api'

const decisions = ['Approved', 'Need More Information', 'Rejected']
const flow = ['Draft', 'Submitted', 'Under Review', 'Need More Information', 'Approved', 'Rejected']

function statusClass(status) {
  return `status status-${status.toLowerCase().replace(/\s+/g, '-')}`
}

export default function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [app, setApp] = useState(null)
  const [error, setError] = useState('')
  const [decision, setDecision] = useState('Approved')
  const [comment, setComment] = useState('')

  const load = () => api.getApplication(id).then(setApp).catch((err) => setError(err.message))

  useEffect(() => {
    load()
  }, [id])

  const perform = async (fn) => {
    setError('')
    try {
      await fn()
      await load()
    } catch (err) {
      setError(err.message)
    }
  }

  const stage = useMemo(() => {
    if (!app) return 0
    const idx = flow.indexOf(app.status)
    return idx === -1 ? 0 : idx
  }, [app])

  if (!app) return <p>Loading...</p>

  return (
    <section className="card-panel detail-panel">
      <div className="section-head">
        <div>
          <p className="eyebrow">Application</p>
          <h2>{app.tracking_number}</h2>
        </div>
        <span className={statusClass(app.status)}>{app.status}</span>
      </div>

      <div className="progress-row">
        {flow.map((step, idx) => (
          <span key={step} className={`step-chip ${idx <= stage ? 'active' : ''}`}>{step}</span>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      <div className="details-grid">
        <p><strong>Applicant</strong><span>{app.applicant_name} ({app.applicant_email})</span></p>
        <p><strong>Company</strong><span>{app.company_name}</span></p>
        <p><strong>Type</strong><span>{app.application_type}</span></p>
        <p><strong>Description</strong><span>{app.description || '-'}</span></p>
        <p><strong>Reviewer Comment</strong><span>{app.reviewer_comment || '-'}</span></p>
      </div>

      <div className="actions">
        {(app.status === 'Draft' || app.status === 'Need More Information') && (
          <>
            <button className="btn" onClick={() => navigate(`/applications/${app.id}/edit`)}>Edit</button>
            <button className="btn btn-primary" onClick={() => perform(() => api.submitApplication(app.id))}>{app.status === 'Draft' ? 'Submit' : 'Resubmit'}</button>
          </>
        )}

        {app.status === 'Submitted' && (
          <button className="btn btn-primary" onClick={() => perform(() => api.startReview(app.id))}>Start Review</button>
        )}

        {app.status === 'Under Review' && (
          <div className="decision-box">
            <h3>Reviewer Decision</h3>
            <label>
              <span className="label-text">Decision <span className="required">*</span></span>
              <select value={decision} onChange={(e) => setDecision(e.target.value)} required>
                {decisions.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            <label>
              <span className="label-text">Comment {(decision === 'Rejected' || decision === 'Need More Information') ? <span className="required">*</span> : null}</span>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Reviewer comment" rows="4" />
            </label>
            <button className="btn btn-primary" onClick={() => perform(() => api.decision(app.id, { decision, reviewer_comment: comment }))}>
              Save Decision
            </button>
          </div>
        )}

        <Link className="back-link" to="/">Back to List</Link>
      </div>
    </section>
  )
}
