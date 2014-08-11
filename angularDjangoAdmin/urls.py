from django.conf.urls import patterns, url, include

urlpatterns = patterns('',
        url(r'^api/', include('angularDjangoAdmin.api.urls')),
        url(r'', TemplateView.as_view(template_name='base.html')),
)
