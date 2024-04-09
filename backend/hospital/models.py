from django.db import models

# Create your models here.
class actionHistory(models.Model):
    action = models.CharField(max_length=100)
    observation = models.CharField(max_length=100)

    def __str__(self):
        return self.action

    def Meta(self):
        verbose_name = 'Action History'
        verbose_name_plural = 'Action Histories'