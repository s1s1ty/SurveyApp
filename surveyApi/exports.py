import csv
import xlwt
from xhtml2pdf import pisa 

from io import BytesIO

from django.http import HttpResponse, JsonResponse, Http404
from django.shortcuts import get_object_or_404
from django.template.loader import get_template

from .models import Project, Question, Answer


# DOWNLOAD ANSWER AS XLS FORMAT
def export_answer_xls(request, pk):
	response = HttpResponse(content_type='text/csv')
	response['Content-Disposition'] = 'attachment; filename="answers.xls"'

	wb = xlwt.Workbook(encoding='utf-8')
	ws = wb.add_sheet("sheet1", cell_overwrite_ok=True)

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
	col_num = 0
	for question in questions:
		answers = question.answer_set.all()
		row_num = 1
		row = [ans.answer_text for ans in answers]

		for index in xrange(len(row)):
			ws.write(row_num, col_num, row[index], font_style)
			row_num+=1
		col_num+=1

	wb.save(response)
	return response


# DOWNLOAD QUESTION AS PDF FORMAT
def export_question_pdf(request, pk):
	try:
		project = get_object_or_404(Project, pk=pk)
	except Project.DoesNotExist:
		return HttpResponse(status=404)

	questions = project.question_set.all()

	# start pdf generating 
	template = get_template('surveyApi/pdf.html')
	context = {
		'data': questions,
		'project_name': project.name
	}
	html = template.render(context)
	result = BytesIO()
	pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
	if not pdf.err:
		return HttpResponse(result.getvalue(), content_type='application/pdf')
	return None