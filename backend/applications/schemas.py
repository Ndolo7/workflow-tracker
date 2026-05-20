from datetime import datetime
from typing import Optional

from ninja import Schema

from .models import Application


class ApplicationCreateSchema(Schema):
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: str
    description: str = ''


class ApplicationUpdateSchema(Schema):
    applicant_name: Optional[str] = None
    applicant_email: Optional[str] = None
    company_name: Optional[str] = None
    application_type: Optional[str] = None
    description: Optional[str] = None


class ReviewerDecisionSchema(Schema):
    decision: str
    reviewer_comment: str = ''


class ApplicationOutSchema(Schema):
    id: int
    tracking_number: str
    applicant_name: str
    applicant_email: str
    company_name: str
    application_type: str
    description: str
    status: str
    reviewer_comment: str
    created_at: datetime
    updated_at: datetime
    submitted_at: Optional[datetime]
    reviewed_at: Optional[datetime]


VALID_APPLICATION_TYPES = {choice[0] for choice in Application.ApplicationType.choices}
VALID_DECISIONS = {
    Application.Status.APPROVED,
    Application.Status.REJECTED,
    Application.Status.NEED_MORE_INFO,
}
