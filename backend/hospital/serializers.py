from rest_framework import serializers
from .models import actionHistory

class actionHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = actionHistory
        fields = ('action', 'observation')