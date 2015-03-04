import json
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render
import facebook


def home(request):
    return render(request, 'index.html')


@login_required
def get_feed(request):
    social_auth = request.user.social_auth.filter(provider='facebook').first()
    graph = facebook.GraphAPI(social_auth.extra_data['access_token'])
    user = graph.get_object('me')
    feed = graph.get_object(user['id'] + '/home', limit=45)
    return HttpResponse(json.dumps(feed))

@login_required
def get_profile(request):
    social_auth = request.user.social_auth.filter(provider='facebook').first()
    graph = facebook.GraphAPI(social_auth.extra_data['access_token'])
    user = graph.get_object('me')
    feed = graph.get_object(user['id'] + '/feed', limit=50)
    return HttpResponse(json.dumps(feed))

