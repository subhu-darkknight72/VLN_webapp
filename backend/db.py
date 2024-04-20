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
    
    def reset_prompts(self, prompt):
        self.promptHistory.delete_many({})
        self.promptHistory.insert_one({"prompt": prompt})
        print("reset_prompts done")

    def get_prompts(self):
        prompts = self.promptHistory.find()
        return prompts