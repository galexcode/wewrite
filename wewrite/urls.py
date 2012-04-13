from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'wewrite.views.home', name='home'),
    # url(r'^wewrite/', include('wewrite.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
from wewrite.app import views as aViews
urlpatterns += patterns('',
                        url(r'^$', aViews.index, name='index'),
                        url(r'^this/$', aViews.this, name='this'),
                        url(r'^userProfile/$', aViews.userProfile, name='userProfile'),
    )
