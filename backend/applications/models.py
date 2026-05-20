import uuid

from django.db import models
from django.utils import timezone


class Application(models.Model):
    class ApplicationType(models.TextChoices):
        RECORDATION = 'Recordation', 'Recordation'
        RENEWAL = 'Renewal', 'Renewal'
        CHANGE_OWNERSHIP = 'Change of Ownership', 'Change of Ownership'
        CHANGE_NAME = 'Change of Name', 'Change of Name'
        DISCONTINUATION = 'Discontinuation', 'Discontinuation'

    class Status(models.TextChoices):
        DRAFT = 'Draft', 'Draft'
        SUBMITTED = 'Submitted', 'Submitted'
        UNDER_REVIEW = 'Under Review', 'Under Review'
        NEED_MORE_INFO = 'Need More Information', 'Need More Information'
        APPROVED = 'Approved', 'Approved'
        REJECTED = 'Rejected', 'Rejected'

    tracking_number = models.CharField(max_length=32, unique=True, editable=False)
    applicant_name = models.CharField(max_length=255)
    applicant_email = models.EmailField()
    company_name = models.CharField(max_length=255)
    application_type = models.CharField(max_length=32, choices=ApplicationType.choices)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.DRAFT)
    reviewer_comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = f'APP-{uuid.uuid4().hex[:8].upper()}'
        super().save(*args, **kwargs)

    def can_edit(self):
        return self.status in {self.Status.DRAFT, self.Status.NEED_MORE_INFO}

    def submit(self):
        if self.status not in {self.Status.DRAFT, self.Status.NEED_MORE_INFO}:
            raise ValueError('Only Draft or Need More Information applications can be submitted.')
        self.status = self.Status.SUBMITTED
        self.submitted_at = timezone.now()
        self.save(update_fields=['status', 'submitted_at', 'updated_at'])

    def start_review(self):
        if self.status != self.Status.SUBMITTED:
            raise ValueError('Only Submitted applications can move to Under Review.')
        self.status = self.Status.UNDER_REVIEW
        self.save(update_fields=['status', 'updated_at'])

    def decide(self, decision, reviewer_comment):
        if self.status != self.Status.UNDER_REVIEW:
            raise ValueError('Only Under Review applications can receive a reviewer decision.')
        if decision in {self.Status.NEED_MORE_INFO, self.Status.REJECTED} and not reviewer_comment.strip():
            raise ValueError('Reviewer comment is required for Need More Information or Rejected decisions.')

        self.status = decision
        self.reviewer_comment = reviewer_comment
        self.reviewed_at = timezone.now()
        self.save(update_fields=['status', 'reviewer_comment', 'reviewed_at', 'updated_at'])
