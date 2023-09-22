from django.urls import path
from . import views

urlpatterns = [
    path('compress', views.Compress.as_view(), name='index')
]