from django.db import models
from django.contrib.auth.models import User

class Team(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="teams")

    def __str__(self):
        return self.title

class Player(models.Model):
    espn_id = models.CharField(max_length=100, unique=True)
    espn_name = models.CharField(max_length=100)
    yahoo_player_id = models.CharField(max_length=100)
    team = models.CharField(max_length=100)
    espn_link = models.URLField(max_length=200)
    yahoo_link = models.URLField(max_length=200)

    def __str__(self):
        return self.espn_name
