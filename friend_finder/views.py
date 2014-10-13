import json
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

import instagram

# Create your views here.
import facebook


def home(request):
    return render(request, 'index.html')







