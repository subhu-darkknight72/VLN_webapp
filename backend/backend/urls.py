from django.contrib import admin
from django.urls import path, include
from hospital import urls

urlpatterns = [
    path('admin/', admin.site.urls),
    path('hospital/', include('hospital.urls')),
]
