# -*- coding: utf-8 -*-
"""ReAcT_Reflexion_Custom_Hospital.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1f_DY3cgFl9xPEG_xzJmIvrsARbZhiIJb
"""

"""### Language Model"""

import os
import json
import sys
from openai import AzureOpenAI


from dotenv import load_dotenv
load_dotenv()

client = AzureOpenAI(
  	azure_endpoint = os.getenv('AZUREOPENAI_API_BASE'),
  	api_key=os.getenv('AZUREOPENAI_API_KEY'),
  	api_version=os.getenv('AZUREOPENAI_API_VERSION')
)

deployment_name='GPT-4-France'


def llm(prompt, stop=['\n']):
	response = client.chat.completions.create(
		model="GPT-4-France",
		messages=[
			{"role": "system", "content": "You are a helpful AI robot inside a hospital environment."},
			{"role": "user", "content": prompt}],
		temperature=0,
		top_p=0.98,
		frequency_penalty=0,
		presence_penalty=0,
		stop=stop)
	return response.choices[0].message.content



filename = 'prompts.txt'
prompt_file = 'react_waste_2.json'
with open(prompt_file, 'r') as f:
	d = json.load(f)
init_prompt = 'Interact with the hospital environment to solve a task. Here are two examples.\n' + d[f'react_waste_1'] + d[f'react_waste_2'] + '\nHere is the task.\n'
	# Evaluate variation-4
ob = "You are in the hallway. This is the main corridor in the ground floor from which we can go to other rooms. The rooms that we can go from here are : doctor chamber, general ward, common toilet, hallway nurse station. The room contains : wall poster, doctor #1. \nYour task is to : find all the waste products from the doctor chamber and put them on dustbin."
init_prompt = init_prompt + ob + '\n>'

# with open(filename , 'w') as f:
# 	f.write(init_prompt+'\n')

# i=0
# while True:
# 	action = llm(init_prompt + prompt, stop=['\n']).strip()
# 	while action.startswith('think:'):
# 		observation = 'OK.'
# 		prompt += f' {action}\n{observation}\n>'
# 		new_prompt = f' {action}\n{observation}\n>'
# 		action = llm(init_prompt + prompt, stop=['\n']).strip()
# 		with open(filename , 'a') as f:
# 			f.write(new_prompt+'\n')
	
# 	print(f"output= {action}")
# 	observation=input("obs= ")

# 	i+=1
# 	new_prompt = f' {action}\n{observation}\n>'
# 	prompt += f' {action}\n{observation}\n>'

# 	with open(filename , 'a') as f:
# 		f.write(new_prompt+'\n')

def get_action_response():
	# check if file exists
	if not os.path.exists(filename):
		with open(filename , 'w') as f:
			f.write(init_prompt)

	prompt = ''
	# read prompt from file
	with open(filename , 'r') as f:
		prompt = f.read()
	
	action = llm(prompt, stop=['\n']).strip()
	# check if action contains 'think:' in any form
	while action.find('think:') != -1:
		observation = 'OK.'
		prompt += f' {action}\n{observation}\n>'
		new_prompt = f' {action}\n{observation}\n>'
		action = llm(prompt, stop=['\n']).strip()
		with open(filename , 'a') as f:
			f.write(new_prompt)
	
	print(f"output= {action}" )
	observation=input("obs= ")

	new_prompt = f' {action}\n{observation}\n>'
	# write prompt to file
	with open (filename , 'a') as f:
		f.write(new_prompt)

	return action

get_action_response()
