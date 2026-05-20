from django.contrib import admin

from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'applicant_name', 'company_name', 'application_type', 'status', 'created_at')
    search_fields = ('tracking_number', 'applicant_name', 'company_name', 'applicant_email')
    list_filter = ('status', 'application_type', 'created_at')
