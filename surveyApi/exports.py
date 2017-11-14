import csv
import xlwt

from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from .models import Project, Question, Answer


def export_answer_xls(request, pk):
	response = HttpResponse(content_type='text/csv')
	response['Content-Disposition'] = 'attachment; filename="answers.xls"'

	wb = xlwt.Workbook(encoding='utf-8')
	ws = wb.add_sheet("sheet1")

	row_num = 0

	font_style = xlwt.XFStyle()

	font_style.font.bold = True

	project = get_object_or_404(Project, pk=pk)
	questions = project.question_set.all()

	columns = []
	for ques in questions:
		columns.append(ques.question_name)

	for col_num in range(len(columns)):
		ws.write(row_num, col_num, columns[col_num])

	font_style = xlwt.XFStyle()
	font_style.alignment.wrap = 1

	for question in questions:
		answers = question.answer_set.all()
		row_num += 1
		for ans in answers:
			columns.append(ans.answer_text)
		import pdb; pdb.set_trace()

		for col_num in xrange(len(columns)):
			ws.write(row_num, col_num, columns[col_num], font_style)

	# data = get_data()
	wb.save(response)
	return response




