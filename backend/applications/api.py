from django.shortcuts import get_object_or_404
from ninja import NinjaAPI

from .models import Application
from .schemas import (
    ApplicationCreateSchema,
    ApplicationOutSchema,
    ApplicationUpdateSchema,
    ReviewerDecisionSchema,
    VALID_APPLICATION_TYPES,
    VALID_DECISIONS,
)

api = NinjaAPI(title='Workflow Tracker API')


@api.post('/applications', response={201: ApplicationOutSchema, 400: dict})
def create_application_draft(request, payload: ApplicationCreateSchema):
    if payload.application_type not in VALID_APPLICATION_TYPES:
        return 400, {'message': 'Invalid application_type.'}

    app = Application.objects.create(
        applicant_name=payload.applicant_name,
        applicant_email=payload.applicant_email,
        company_name=payload.company_name,
        application_type=payload.application_type,
        description=payload.description,
        status=Application.Status.DRAFT,
    )
    return 201, app


@api.get('/applications', response=list[ApplicationOutSchema])
def list_applications(request):
    return Application.objects.all().order_by('-created_at')


@api.get('/applications/{application_id}', response=ApplicationOutSchema)
def get_application_details(request, application_id: int):
    return get_object_or_404(Application, id=application_id)


@api.patch('/applications/{application_id}', response={200: ApplicationOutSchema, 400: dict})
def update_draft_application(request, application_id: int, payload: ApplicationUpdateSchema):
    app = get_object_or_404(Application, id=application_id)

    if not app.can_edit():
        return 400, {'message': 'Only Draft or Need More Information applications can be edited.'}

    data = payload.dict(exclude_none=True)
    if 'application_type' in data and data['application_type'] not in VALID_APPLICATION_TYPES:
        return 400, {'message': 'Invalid application_type.'}

    for field, value in data.items():
        setattr(app, field, value)
    app.save()
    return 200, app


@api.post('/applications/{application_id}/submit', response={200: ApplicationOutSchema, 400: dict})
def submit_application(request, application_id: int):
    app = get_object_or_404(Application, id=application_id)
    try:
        app.submit()
    except ValueError as exc:
        return 400, {'message': str(exc)}
    return 200, app


@api.post('/applications/{application_id}/start-review', response={200: ApplicationOutSchema, 400: dict})
def start_review(request, application_id: int):
    app = get_object_or_404(Application, id=application_id)
    try:
        app.start_review()
    except ValueError as exc:
        return 400, {'message': str(exc)}
    return 200, app


@api.post('/applications/{application_id}/decision', response={200: ApplicationOutSchema, 400: dict})
def record_reviewer_decision(request, application_id: int, payload: ReviewerDecisionSchema):
    app = get_object_or_404(Application, id=application_id)

    if payload.decision not in VALID_DECISIONS:
        return 400, {'message': 'Invalid decision. Use Approved, Rejected, or Need More Information.'}

    try:
        app.decide(payload.decision, payload.reviewer_comment)
    except ValueError as exc:
        return 400, {'message': str(exc)}

    return 200, app
