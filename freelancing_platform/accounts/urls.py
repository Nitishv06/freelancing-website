from django.urls import path
from .views import api_root, register_api, login_api, logout_api, user_profile

urlpatterns = [
    path('', api_root, name='api-root'),
    path('register/', register_api, name='register'),
    path('login/', login_api, name='login'),
    path('logout/', logout_api, name='logout'),
    path('profile/', user_profile, name='profile'),
]
