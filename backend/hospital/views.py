from django.shortcuts import render
from rest_framework import generics
from .models import actionHistory
from .serializers import actionHistorySerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

initial_action = 'initialise'
initial_observation = 'You are in the hallway. This room is called the hallway. This is the main corridor in the ground floor from which we can go to other rooms. The rooms that we can go from here are : doctor chamber #1, doctor chamber #2, general ward, icu ward, common toilet, Nurse Station. The room contains : wall poster, doctor #1, agent.'

# Create your views here.
class performAction(APIView):
    def get(self, request, *args, **kwargs):
        # get all record from the actionHistory table
        actions = actionHistory.objects.all()
        serializer = actionHistorySerializer(actions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        # create a new record in the actionHistory table
        action = request.data.get('action')
        observation = request.data.get('observation')
        actionHistory.objects.create(action=action, observation=observation)
        return Response(status=status.HTTP_201_CREATED)

class resetActions(generics.DestroyAPIView):
    # delete all records in the actionHistory table and Add the default initial record
    global initial_action, initial_observation
    def delete(self, request, *args, **kwargs):
        actionHistory.objects.all().delete()
        actionHistory.objects.create(action=initial_action, observation=initial_observation)
        return Response(status=status.HTTP_204_NO_CONTENT)

