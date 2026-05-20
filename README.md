# Mini Application Workflow Tracker (Django + Django Ninja + React)

This project recreates the workflow tracker app in `/worktracker` with:
- Backend: Django + Django Ninja API
- Frontend: React + Vite

## Workflow

Draft -> Submitted -> Under Review -> Need More Information / Approved / Rejected

Rules implemented:
- Only `Draft` and `Need More Information` applications can be edited.
- Only `Draft` and `Need More Information` applications can be submitted.
- Only `Submitted` applications can move to `Under Review`.
- Only `Under Review` applications can receive reviewer decisions.
- `Approved` and `Rejected` cannot be edited.
- Reviewer comment is required for `Need More Information` and `Rejected`.

## Backend setup (Django Ninja)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Backend runs at `http://127.0.0.1:8000`.

API docs:
- Swagger UI: `http://127.0.0.1:8000/api/docs`
- OpenAPI JSON: `http://127.0.0.1:8000/api/openapi.json`

### Backend endpoints

- `POST /api/applications` Create application draft
- `GET /api/applications` List applications
- `GET /api/applications/{id}` View application details
- `PATCH /api/applications/{id}` Update draft/need-more-info application
- `POST /api/applications/{id}/submit` Submit/resubmit application
- `POST /api/applications/{id}/start-review` Move submitted to under review
- `POST /api/applications/{id}/decision` Record reviewer decision

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Frontend environment

Create `frontend/.env` (already added in this project):

```env
VITE_API_BASE=http://127.0.0.1:8000/api
```

If you change `.env`, restart the frontend dev server.

## Run migrations

```bash
cd backend
source .venv/bin/activate
python manage.py migrate
```

## Assumptions made

- No authentication/authorization is required for this coding exercise.
- Single reviewer workflow without reviewer user accounts.
- SQLite is acceptable for local development.

## What I would improve with more time

- Add authentication and role-based authorization.
- Add filtering/pagination/search to application listing.
- Add automated tests for all workflow transitions and API validation.
- Add Docker setup and CI checks.
- Improve UX feedback/loading states and add toasts.
# workflow-tracker
