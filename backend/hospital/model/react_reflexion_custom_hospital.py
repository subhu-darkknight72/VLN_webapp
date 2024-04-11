import os
import json
from openai import AzureOpenAI

from dotenv import load_dotenv
load_dotenv()

# deployment_name='GPT-4-France'
class LLM:
	def __init__(self):
		self.client = AzureOpenAI(
			azure_endpoint = os.getenv('AZUREOPENAI_API_BASE'),
			api_key=os.getenv('AZUREOPENAI_API_KEY'),
			api_version=os.getenv('AZUREOPENAI_API_VERSION')
		)

		self.filename = 'prompts.txt'
		self.prompt_file = 'react_waste_2.json'
		
	def create_initial_prompt(self):
		with open(self.prompt_file, 'r') as f:
			d = json.load(f)
		init_prompt = 'Interact with the hospital environment to solve a task. Here are two examples.\n' + d[f'react_waste_1'] + d[f'react_waste_2'] + '\nHere is the task.\n'
		ob = "You are in the hallway. This is the main corridor in the ground floor from which we can go to other rooms. The rooms that we can go from here are : doctor chamber, general ward, common toilet, hallway nurse station. The room contains : wall poster, doctor #1. \nYour task is to : find all the waste products from the doctor chamber and put them on dustbin."
		init_prompt = init_prompt + ob + '\n>'
		with open(self.filename , 'w') as f:
			f.write(init_prompt)

	def llm(self, prompt, stop=['\n']):
		response = self.client.chat.completions.create(
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

		
	def get_action_response(self):
		# check if file exists
		if not os.path.exists(self.filename):
			self.create_initial_prompt()

		prompt = ''
		# read prompt from file
		with open(self.filename , 'r') as f:
			prompt = f.read()

		action = self.llm(prompt, stop=['\n']).strip()
		# check if action contains 'think:' in any form
		while action.find('think:') != -1:
			observation = 'OK.'
			prompt += f' {action}\n{observation}\n>'
			new_prompt = f' {action}\n{observation}\n>'
			action = self.llm(prompt, stop=['\n']).strip()
			with open(self.filename , 'a') as f:
				f.write(new_prompt)
		return action

	def add_obv_to_prompt(self, action, observation):
		new_prompt = f' {action}\n{observation}\n>'
		with open (self.filename , 'a') as f:
			f.write(new_prompt)
		return

# model = LLM()
# action = model.get_action_response()
# print(action)
# observation = input('Enter observation: ')
# model.add_obv_to_prompt(action, observation)

