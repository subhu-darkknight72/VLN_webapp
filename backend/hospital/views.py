from django.shortcuts import render
from rest_framework import generics
from .models import actionHistory, promptHistory
from .serializers import actionHistorySerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

# from .model.env_world import Game
from .model.env_new import Game
from .model.react_reflexion_custom_hospital import LLM

import sys
sys.path.append("..")

from db import mongoDB

initial_action = 'initialise'
initial_observation = 'You are in the hallway. This is the main corridor in the ground floor from which we can go to other rooms. \nThe rooms that we can go from here are : doctor chamber, general ward, common toilet, hallway nurse station. \nThe room contains : wall poster, doctor #1.'
task = "Your task is to dispose waste products inside the doctor chambers. Take actions to first go to each of the doctor chambers and explore the rooms to find waste products. Collect waste items and dispose them to dustbin."

# Create your views here.
class performAction(APIView):
    def get(self, request, *args, **kwargs):
        try:
            global task
            mongo = mongoDB()
            past_actions = mongo.get_actions()

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
        # print the error message
        except Exception as e:
            print("Error in getting action recommendation:", e)
            return Response("Error in getting action recommendation", status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, *args, **kwargs):
        global task
        # create a new record in the actionHistory table
        action = request.data.get('action')

        mongo = mongoDB()
        past_actions = mongo.get_actions()
        cmds = [action['action'] for action in past_actions[1:]]
        cmds.append(action)
        game = Game(task=task)
        next_action = game.start(cmds)

        observation = next_action["observation"]
        
        mongo.add_action(action=action, observation=observation)
        response_data = {
            "observation": observation
        }
        return Response(response_data, status=status.HTTP_201_CREATED)
    
class actionRecommendation(APIView):
    def get(self, request, *args, **kwargs):
        try :
            model = LLM()
            prompt = ''
            mongo = mongoDB()
            prompts = mongo.get_prompts()

            prompt = ''
            for p in prompts:
                prompt += p['prompt']
            response = model.get_action_response(prompt)
            # save each of new prompt to the promptHistory table
            for newPrompt in response['prompts']:
                mongo.add_prompt(prompt=newPrompt)
            return Response(response['action'], status=status.HTTP_200_OK)
        except Exception as e:
            print("Error in getting action recommendation:", e)
            return Response("Error in getting action recommendation", status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, *args, **kwargs):
        try:
            action = request.data.get('action')
            observation = request.data.get('observation')
            model = LLM()
            response = model.add_obv_to_prompt(action, observation)
            # save the new prompt to the promptHistory table
            mongo = mongoDB()
            mongo.add_prompt(prompt=response)
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            print("Error in adding observation to prompt:", e)
            return Response("Error in adding observation to prompt", status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        try:
            global task
            model = LLM()
            prompt = model.create_initial_prompt(task=task)
            # delete all records in the promptHistory table and Add the default initial record
            mongo = mongoDB()
            mongo.reset_prompts(prompt=prompt)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            print("Error in resetting prompts:", e)
            return Response("Error in resetting prompts", status=status.HTTP_400_BAD_REQUEST)
        

class resetActions(generics.DestroyAPIView):
    # delete all records in the actionHistory table and Add the default initial record
    global initial_action, initial_observation
    def delete(self, request, *args, **kwargs):
        # actionHistory.objects.all().delete()
        # actionHistory.objects.create(action=initial_action, observation=initial_observation)
        mongo = mongoDB()
        mongo.reset_actions(initial_action, initial_observation)
        return Response(status=status.HTTP_204_NO_CONTENT)


# Action: 
# {
#     '_id': ObjectId('6623ba27d09162a424911cd9'), 
#     'action': {
#         '_id': ObjectId('6622711344debec21106476c'), 
#         'action': 
#         {
#             '_id': ObjectId('662265c1f5d21f90fde48a84'), 
#             'action': 
#             {
#                 '_id': ObjectId('6622658423e82c54bb4695ac'), 
#                 'action': 
#                 {
#                     '_id': ObjectId('6622656e6d8988bcaca8832b'), 
#                     'action': 'initialise', 
#                     'observation': 'You are in the hallway. This is the main corridor in the ground floor from which we can go to other rooms. \nThe rooms that we can go from here are : doctor chamber, general ward, common toilet, hallway nurse station. \nThe room contains : wall poster, doctor #1.'}, 'observation': 'You are in the hallway. This is the main corridor in the ground floor from which we can go to other rooms. \nThe rooms that we can go from here are : doctor chamber, general ward, common toilet, hallway nurse station. \nThe room contains : wall poster, doctor #1.'}, 'observation': 'You are in the hallway. This is the main corridor in the ground floor from which we can go to other rooms. \nThe rooms that we can go from here are : doctor chamber, general ward, common toilet, hallway nurse station. \nThe room contains : wall poster, doctor #1.'}, 'observation': 'You are in the hallway. This is the main corridor in the ground floor from which we can go to other rooms. \nThe rooms that we can go from here are : doctor chamber, general ward, common toilet, hallway nurse station. \nThe room contains : wall poster, doctor #1.'}, 'observation': 'You are in the hallway. This is the main corridor in the ground floor from which we can go to other rooms. \nThe rooms that we can go from here are : doctor chamber, general ward, common toilet, hallway nurse station. \nThe room contains : wall poster, doctor #1.'
#                 }
