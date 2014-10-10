import json
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

import instagram

# Create your views here.
import facebook


def home(request):
    return render(request, 'home.html')


def instagram_login(request):
    request.user.social_auth_filter(provider='instagram').first()
    instagram_login()
    instagram.InstagramAPI()


@login_required
def profile(request):
    user_social_auth = request.user.social_auth.filter(provider='facebook').first()
    graph = facebook.GraphAPI(user_social_auth.extra_data['access_token'])
    profile_data = graph.get_object("me/picture", height="200")

    return render(request, 'profile.html', profile_data)



def maps(request):
    user_social_auth = request.user.social_auth.filter(provider='facebook').first()
    graph = facebook.GraphAPI(user_social_auth.extra_data['access_token'])
    photos = graph.get_object("me/photos", limit=50)

    return render(request, 'map.html', {'photo_json': json.dumps(photos['data'])})





