from django.conf.urls import patterns, url, include
from angularDjangoAdmin.api import admin_views as views

urlpatterns = patterns('api.admin_views',
    url(r'^$', views.AppDetail.as_view(),),

    url(
        r'(?P<app>[a-z]+)/(?P<model>[a-z]+)/',
        views.ModelList.as_view(), name="model_list"
    ),
    url(
        r'(?P<app>[a-z]+)/(?P<model>[a-z]+)/(?P<pk>[0-9]+)',
        views.ModelList.as_view(), name="model_list"
    ),

)
