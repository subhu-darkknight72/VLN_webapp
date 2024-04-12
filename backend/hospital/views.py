from django.shortcuts import render
from rest_framework import generics
from .models import actionHistory
from .serializers import actionHistorySerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

# from .model.env_world import Game
from .model.env_new import Game
from .model.react_reflexion_custom_hospital import LLM

initial_action = 'initialise'
initial_observation = 'You are in the hallway. This is the main corridor in the ground floor from which we can go to other rooms. \nThe rooms that we can go from here are : doctor chamber, general ward, common toilet, hallway nurse station. \nThe room contains : wall poster, doctor #1.'
task = "Your task is to dispose waste products inside the doctor chambers. Take actions to first go to each of the doctor chambers and explore the rooms to find waste products. Collect waste items and dispose them to dustbin."

# Create your views here.
class performAction(APIView):
    def get(self, request, *args, **kwargs):
        global task
        # get all record from the actionHistory table
        actions = actionHistory.objects.all()
        serializer = actionHistorySerializer(actions, many=True)
        past_actions = serializer.data

        cmds = [action['action'] for action in past_actions[1:]]
        game = Game(task=task)
        next_action = game.start(cmds)
        next_action["action_space"].append("-")

        response_data = {
            "past_actions": past_actions,
            "next_actions": next_action["action_space"],
            "current_location": next_action["current_location"],
            "current_observation": next_action["observation"]
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        global task
        # create a new record in the actionHistory table
        action = request.data.get('action')

        actions = actionHistory.objects.all()
        serializer = actionHistorySerializer(actions, many=True)
        past_actions = serializer.data
        cmds = [action['action'] for action in past_actions[1:]]
        cmds.append(action)
        game = Game(task=task)
        next_action = game.start(cmds)

        observation = next_action["observation"]
        
        actionHistory.objects.create(action=action, observation=observation)
        response_data = {
            "observation": observation
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    
class actionRecommendation(APIView):
    def get(self, request, *args, **kwargs):
        model = LLM()
        action = model.get_action_response()
        return Response(action, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        action = request.data.get('action')
        observation = request.data.get('observation')
        model = LLM()
        model.add_obv_to_prompt(action, observation)
        return Response(status=status.HTTP_201_CREATED)
    
    def delete(self, request, *args, **kwargs):
        global task
        model = LLM()
        model.create_initial_prompt(task=task)
        return Response(status=status.HTTP_204_NO_CONTENT)


class resetActions(generics.DestroyAPIView):
    # delete all records in the actionHistory table and Add the default initial record
    global initial_action, initial_observation
    def delete(self, request, *args, **kwargs):
        actionHistory.objects.all().delete()
        actionHistory.objects.create(action=initial_action, observation=initial_observation)
        return Response(status=status.HTTP_204_NO_CONTENT)
