from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext as _
from django.apps import apps

from core import models


class UserAdmin(BaseUserAdmin):
    ordering = ["id"]
    list_display = ["email"]
    fieldsets = (
        (None, {"fields": ("email",)}),
        (_("Personal Info"), {"fields": ("password",)}),
        (_("Permissions"), {"fields": ("is_active", "is_staff",)}),
        (_("Important dates"), {"fields": ("last_login",)}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("email", "password1", "password2")}),
    )


app = apps.get_app_config("core")
for model in app.get_models():
    if str(model) == "<class 'core.models.User'>":
        continue
    admin.site.register(model)

admin.site.register(models.User, UserAdmin)
