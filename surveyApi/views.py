from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View

from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.generics import (
    ListAPIView,
    UpdateAPIView,
    CreateAPIView,
    RetrieveAPIView
    )

from .models import Project, Question, Answer
from .serializers import (
    ProjectSerializer,
    QuestionSerializer,
    AnswerSerializer
    )
# from .utils import render_to_pdf


class ProjectList(APIView):
    """
    List all projects and create a new one
    """
    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        data = request.data
        serializer = ProjectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, pk):
        project_data = get_objects_or_404(Project, pk=pk)
        project_data.delete()
        return HttpResponse(status=204)


class ProjectDetail(APIView):
    """
    Retrive,Delete or Update a project instance
    """
    
    def get_object(self, pk):
        try:
            return Project.objects.get(pk=pk)
        except Project.DoesNotExist:
            raise Http404

    def put(self, request, pk):
        data = request.data
        project = self.get_object(pk)
        serializer = ProjectSerializer(project, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, pk):
        project = self.get_object(pk)
        project.delete()
        return HttpResponse(status=204)


class QuestionList(APIView):
    """ 
    Create and retrive a question instance
    """

    def get(self, request):
        question = Question.objects.all()
        serializer = QuestionSerializer(question, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        datas = request.data
        count = 0
        for data in datas:
            formated_data = Question().reformat_data(data)
            serializer = QuestionSerializer(data=formated_data)
            if serializer.is_valid():
                serializer.save()
                count+=1
                if count == len(datas):
                    return JsonResponse(serializer.data, status=201)
            else:
                return JsonResponse(serializer.errors, status=400)

@csrf_exempt
def project_related_question(request, project):
    """
    Retrieve a code snippet.
    """
    try:
        snippet = Question.objects.filter(project=project)
    except Project.DoesNotExist:
        return HttpResponse(status=404)

    # if request.method == 'GET':
    serializer = QuestionSerializer(snippet, many=True)
    return JsonResponse(serializer.data, safe=False)



class QuestionDetail(APIView):
    """Delete or Update a question instance"""
    
    def get_object(self, pk):
        try:
            return get_object_or_404(Question, pk=pk)
        except Question.DoesNotExist:
            raise Http404

    def put(self, request, pk):
        data = request.data
        question = self.get_object(pk)
        question_formated_data = Question().reformat_data(data)
        serializer = QuestionSerializer(question, data=question_formated_data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, pk):
        question = self.get_object(pk)
        question.delete()
        return HttpResponse(status=204)


class AnswerList(APIView):
    
    def get(self, request):
        question = Answer.objects.all()
        serializer = AnswerSerializer(question, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request):
        data = request.data
        c=0
        for i in data.items():
            formated_data = Answer().reformat_data(i)
            serializer = AnswerSerializer(data=formated_data)
            if serializer.is_valid():
                serializer.save()
                c+=1
                if c == len(data):
                    return JsonResponse(serializer.data, status=201)
            else:
                return JsonResponse(serializer.errors, status=400)


# class GeneratePdf(View):
#     def get(self, request, *args, **kwargs):
#         data = {
#               'today': datetime.date.today(), 
#               'amount': 39.99,
#              'customer_name': 'Cooper Mann',
#              'order_id': 1233434,
#         }
#         pdf = render_to_pdf('surveyApi/pdf.html', data)
#         return HttpResponse(pdf, content_type='application/pdf')
        
def render_to_pdf(request,pk):
    import pdfkit
    # pdfkit.from_file('/surveyApi/pdf.html', 'out.pdf')

def index(request):
    return render(request, 'index.html', {})



