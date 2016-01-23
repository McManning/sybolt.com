
import logging

from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Auth form stuff
from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required

from .models import Profile

logger = logging.getLogger('sybolt.safespace')

class ProfileForm(forms.ModelForm):
    """Update additional profile data """
    class Meta:
        model = Profile
        fields = ('murmur_username', 'minecraft_username', 'minecraft_uuid')


@login_required(login_url='/safespace/login')
def index(request):

    return render(request, 'safespace/index.html.j2', 
        context={
            'foo': 'bar'
        },
        status=200,
        content_type='text/html'
    )

# TODO: Override login so we can override login form and 
# replace label_suffix with our own thing. 

# TODO: Probably not this. Our form does AJAX posting, but I want to test outside
# the actual form, and I'm too lazy to generate tokens
@csrf_exempt
def register(request):
    """Custom registration form to accept AJAX POSTs """

    # POST requests are handled AJAX-style
    if request.method == 'POST':
        uform = UserCreationForm(request.POST)
        pform = ProfileForm(request.POST)

        logger.info(request.POST)

        if uform.is_valid() and pform.is_valid():
            user = uform.save()

            # Create but don't push until we associate a User
            profile = pform.save(commit=False) 
            profile.user = user
            profile.save()

            #redirect(reverse('safespace:index'))
            return JsonResponse({
                'redirect': reverse('safespace:index')
            }, status=201)
        else:
            # Send errors as response JSON
            errors = uform.errors.copy()
            errors.update(pform.errors)

            return JsonResponse({
                'errors': errors
            }, status=400)
    else:
        # Your average page access, show a registration form
        return render(request, 'safespace/register.html.j2', 
            context={
                'uform': UserCreationForm(),
                'pform': ProfileForm()
            },
            status=200,
            content_type='text/html'
        )
