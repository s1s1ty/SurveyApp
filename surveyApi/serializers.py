from rest_framework import serializers
from .models import Project, Question, Answer


class ProjectSerializer(serializers.ModelSerializer):

	class Meta:
		model = Project
		fields = '__all__'
        


class QuestionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Question
		fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
	class Meta:
		model = Answer
		fields = '__all__'
			
		