
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

from .models import Profile

# Define additional inline editable settings so we can edit
# profile data alongside User data on the admin side
class ProfileInline(admin.StackedInline):
    model = Profile
    can_delete = False
    verbose_name_plural = 'profile'

# Override base admin role
class UserAdmin(BaseUserAdmin):
    inlines = (ProfileInline,)

# Re-register
admin.site.unregister(User)
admin.site.register(User, UserAdmin)


