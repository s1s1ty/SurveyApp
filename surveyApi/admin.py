from django.contrib import admin

from .models import Project, Question, Answer


class QuestionAdmin(admin.ModelAdmin):
	list_display = ("question_name", "question_type", "answer_option", "project")


class AnswerAdmin(admin.ModelAdmin):
	list_display = ("answer_text", "question")


admin.site.register(Project)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
