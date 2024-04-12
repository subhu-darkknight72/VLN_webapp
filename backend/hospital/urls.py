from django.urls import path
from . import views

urlpatterns = [
    path('performAction/', views.performAction.as_view(), name='performActionHospital'),
    path('reset/', views.resetActions.as_view(), name='resetActionHospital'),
    path('actionRecommendation/', views.actionRecommendation.as_view(), name='actionRecommendationHospital'),
]