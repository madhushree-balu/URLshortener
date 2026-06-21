from django.urls import path,include
from .views import delete_url, register, login, shorten_url,original_url,all_urls

urlpatterns = [
    path('register/', register),
    path('login/', login),
    path('shorten_url/', shorten_url),
    path('all_urls/', all_urls),
    path('delete_url/<str:short_url>/', delete_url),
    path('<str:short_url>/', original_url),

    
]