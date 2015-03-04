from django.conf.urls import patterns, include, url
from django.contrib import admin


urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'feedr.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', 'friend_finder.views.home', name='home'),
    url('', include('social.apps.django_app.urls', namespace='social')),
    url(r'^logout/$', 'django.contrib.auth.views.logout', name='logout'),
    url(r'^get_feed/$', 'friend_finder.views.get_feed', name='get_feed'),
    url(r'^get_profile/$', 'friend_finder.views.get_profile', name='get_profile'),
)
