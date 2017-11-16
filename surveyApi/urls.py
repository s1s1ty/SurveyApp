from django.conf.urls import url
from . import views
from . import exports

urlpatterns = [
	url(r'^home/', views.index, name='index'),
	url(r'^export-question/pdf/(?P<pk>[0-9]+)/$', exports.export_question_pdf, name="export_question_pdf"),
	url(r'^export-answer/xls/(?P<pk>[0-9]+)/$', exports.export_answer_xls, name="export_answer_xls"),

    url(r'^api/projects/$', views.ProjectList.as_view(), name='project_list'),
    url(r'^api/projects/(?P<pk>[0-9]+)/$', views.ProjectDetail.as_view(), name='detail_project'),

    url(r'^api/questions/$', views.QuestionList.as_view(), name='question_list'),
    url(r'^api/questions/(?P<pk>[0-9]+)/$', views.QuestionDetail.as_view(), name='detail_question'),
    url(r'^api/question/(?P<project>[\w-]+)/$', views.project_related_question, name='question_instance'),

    url(r'^api/answers/$', views.AnswerList.as_view(), name='answer_list'),
]