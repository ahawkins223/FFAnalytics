from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'players', views.PlayerViewSet)

urlpatterns = [
    path("teams/", views.TeamListCreate.as_view(), name="team-list"),
    path("teams/delete/<int:pk>/", views.TeamDelete.as_view(), name="delete-team"),
    path("fetch-players/", views.fetch_and_save_players_view, name="fetch-players"),  # New endpoint
    path('', include(router.urls)),
]
