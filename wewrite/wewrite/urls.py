from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()


from editor import views as eViews
from cursive import views as cViews
urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'wewrite.views.home', name='home'),
    # url(r'^wewrite/', include('wewrite.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)

urlpatterns += patterns('',
                        url(r'^$',cViews.index,name='index'),
)
