from django.db import models
import json

# Create your models here.
class actionHistory(models.Model):
    action = models.CharField(max_length=100)
    observation = models.CharField(max_length=1000)
    # nextAction = models.CharField(max_length=1000, default='-')

    def __str__(self):
        return self.action

    def Meta(self):
        verbose_name = 'Action History'
        verbose_name_plural = 'Action Histories'

    # def set_string_list(self, value):
    #     self.nextAction = json.dumps(value)
    
    # def get_string_list(self):
    #     return json.loads(self.nextAction)