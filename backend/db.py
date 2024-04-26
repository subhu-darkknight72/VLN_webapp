from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()
mongo_uri = os.environ.get('MONGO_URI')

class mongoDB:
    def __init__(self):
        self.client = MongoClient(mongo_uri)
        self.db = self.client['Cluster0']
        self.actionHistory = self.db['hospital_actionHistory']
        self.promptHistory = self.db['hospital_promptHistory']
        self.taskHistory = self.db['hospital_taskHistory']

    # get all actions from the actionHistory table
    def get_actions(self):
        actions = self.actionHistory.find()
        # return all actions as a list of dictionaries
        # each dictionary contains action and observation as strings
        result = []
        for (idx, action) in enumerate(actions):
            result.append({
                "id": idx,
                "action": action['action'], 
                "observation": action['observation']
            })
        return result
    
    # add new entry to the actionHistory table
    def add_action(self, action, observation):
        # insert new record to the actionHistory table
        self.actionHistory.insert_one({"action": action, "observation": observation})
        return

    # delete all actions from the actionHistory table and set given action, observation as the first record
    def reset_actions(self, action, observation):
        self.actionHistory.delete_many({})
        self.actionHistory.insert_one({"action": action, "observation": observation})
        
    def get_prompts(self):
        prompts = self.promptHistory.find()
        return prompts
    
    def add_prompt(self, prompt):
        self.promptHistory.insert_one({"prompt": prompt})
        return
    
    def reset_prompts(self, prompt):
        self.promptHistory.delete_many({})
        self.promptHistory.insert_one({"prompt": prompt})
        return

    # get last task from the taskHistory table
    def get_task(self):
        # get all tasks from the taskHistory table
        tasks = self.taskHistory.find()
        # return all tasks as a list of strings
        result = []
        for task in tasks:
            result.append(task['task'])
        response = {
            "recent": result[-1],
            "all": list(set(result))
        }
        return response
    
    # add new entry to tasks table
    def add_task(self, task):
        self.taskHistory.insert_one({"task": task})
        return

    def reset_tasks(self, taskList):
        self.taskHistory.delete_many({})
        for task in taskList:
            self.taskHistory.insert_one({"task": task})
        return