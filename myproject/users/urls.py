from django.urls import path,include
from .views import register, login, shorten_url,original_url

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('shorten_url/', shorten_url),
    path('<str:short_url>/', original_url),
]