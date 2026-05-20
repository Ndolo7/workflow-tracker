import { Link, Route, Routes } from 'react-router-dom'

import ApplicationDetailPage from './pages/ApplicationDetailPage'
import ApplicationFormPage from './pages/ApplicationFormPage'
import ApplicationListPage from './pages/ApplicationListPage'

export default function App() {
  return (
    <div className="app-shell">
      <div className="bg-orb bg-orb-a" />
      <div className="bg-orb bg-orb-b" />
      <div className="container">
        <header className="header card-panel">
          <div>
            <p className="eyebrow">Workflow Operations</p>
            <h1>Application Tracker</h1>
          </div>
          <nav>
            <Link to="/">Applications</Link>
            <Link className="nav-cta" to="/new">New Draft</Link>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<ApplicationListPage />} />
            <Route path="/new" element={<ApplicationFormPage />} />
            <Route path="/applications/:id/edit" element={<ApplicationFormPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}
