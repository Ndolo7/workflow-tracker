import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { api } from '../api'

const appTypes = ['Recordation', 'Renewal', 'Change of Ownership', 'Change of Name', 'Discontinuation']

export default function ApplicationFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    applicant_name: '',
    applicant_email: '',
    company_name: '',
    application_type: appTypes[0],
    description: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    api.getApplication(id)
      .then((data) => setForm({
        applicant_name: data.applicant_name,
        applicant_email: data.applicant_email,
        company_name: data.company_name,
        application_type: data.application_type,
        description: data.description,
      }))
      .catch((err) => setError(err.message))
  }, [id, isEdit])

  const onChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isEdit) {
        await api.updateApplication(id, form)
        navigate(`/applications/${id}`)
      } else {
        const created = await api.createApplication(form)
        navigate(`/applications/${created.id}`)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="card-panel form-panel">
      <div className="section-head">
        <div>
          <h2>{isEdit ? 'Edit Application' : 'Create Draft'}</h2>
          <p className="section-sub">Fields marked with <span className="required">*</span> are required.</p>
        </div>
      </div>
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit} className="form">
        <label>
          <span className="label-text">Applicant Name <span className="required">*</span></span>
          <input name="applicant_name" value={form.applicant_name} onChange={onChange} placeholder="e.g. Cloud 9" required />
        </label>

        <label>
          <span className="label-text">Applicant Email <span className="required">*</span></span>
          <input name="applicant_email" value={form.applicant_email} onChange={onChange} placeholder="e.g. jane@company.com" type="email" required />
        </label>

        <label>
          <span className="label-text">Company Name <span className="required">*</span></span>
          <input name="company_name" value={form.company_name} onChange={onChange} placeholder="e.g. Cloud9 Softwares" required />
        </label>

        <label>
          <span className="label-text">Application Type <span className="required">*</span></span>
          <select name="application_type" value={form.application_type} onChange={onChange} required>
            {appTypes.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
        </label>

        <label>
          <span className="label-text">Description</span>
          <textarea name="description" value={form.description} onChange={onChange} placeholder="Give background and context for this request." rows="6" />
        </label>

        <button className="btn btn-primary" type="submit">{isEdit ? 'Update Application' : 'Create Draft'}</button>
      </form>
    </section>
  )
}
