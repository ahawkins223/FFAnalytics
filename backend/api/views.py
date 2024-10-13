from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, TeamSerializer, PlayerSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Team, Player
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer

@api_view(['POST'])
def fetch_and_save_players_view(request):
    options = {
        'method': 'GET',
        'url': 'https://tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com/getNFLPlayerList',
        'headers': {
            'x-rapidapi-key': '352fbe4c98msh95a0ba7d165a788p1446fdjsn2be06375cc09',
            'x-rapidapi-host': 'tank01-nfl-live-in-game-real-time-statistics-nfl.p.rapidapi.com'
        }
    }

    try:
        # Make the API request
        response = requests.get(options['url'], headers=options['headers'])
        players_data = response.json()

        # Iterate through the received players and save them
        for player in players_data:
            player_obj, created = Player.objects.get_or_create(
                espn_id=player["espnID"],
                defaults={
                    "espn_name": player["espnName"],
                    "yahoo_player_id": player["yahooPlayerID"],
                    "team": player["team"],
                    "espn_link": player["espnLink"],
                    "yahoo_link": player["yahooLink"],
                }
            )
            if not created:
                # Update player information if it already exists
                player_obj.espn_name = player["espnName"]
                player_obj.yahoo_player_id = player["yahooPlayerID"]
                player_obj.team = player["team"]
                player_obj.espn_link = player["espnLink"]
                player_obj.yahoo_link = player["yahooLink"]
                player_obj.save()

        return Response({"message": "Players fetched and saved successfully."})
    
    except Exception as e:
        return Response({"error": str(e)}, status=400)

class TeamListCreate(generics.ListCreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class TeamDelete(generics.DestroyAPIView):
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Team.objects.filter(author=user)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
