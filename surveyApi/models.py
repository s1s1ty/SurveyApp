from __future__ import unicode_literals

from django.db import models
from django.shortcuts import get_object_or_404


class Project(models.Model):
	name = models.CharField(max_length=100)
	created = models.DateTimeField(auto_now_add=True)

	class Meta(object):
		ordering = ('-created',)

	def __str__(self):
		return str(self.name)


class Question(models.Model):
	question_name = models.TextField()
	question_type = models.CharField(max_length=100, blank=True, null=True)
	answer_option = models.TextField(blank=True, null=True)
	project = models.ForeignKey(Project, on_delete=models.CASCADE)

	def __str__(self):
		return self.question_name

	def reformat_data(self, data_dict):
		data = {}
		ans = data_dict.get('answer_options')
		ans_str=""
		for j in ans:
			ans_str+=j.get('name')+','


		ans_str = ans_str
		data['question_name'] = data_dict.get('question_name')
		data['answer_option'] = ans_str[:-1] if ans_str[-1] == ',' else ans_str
		data['question_type'] = data_dict.get('type')
		data['project'] = data_dict.get('project')
		return data


class Answer(models.Model):
	answer_text = models.TextField()
	question = models.ForeignKey(Question, on_delete=models.CASCADE)

	def reformat_data(self, data):
		data_dict = {}
		data_dict['answer_text']=data[1]
		data_dict['question']=data[0]
		return data_dict


		