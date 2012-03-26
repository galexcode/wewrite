# Create your views here.
from django.shortcuts import render

def index(request):
    context = {}
    return render(request, 'index.html', context)

def this(request):
    context = {}
    return render(request, 'this.html', context)
    
