# Create your views here.
from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import requires_csrf_token
from django.template import RequestContext
# from django.core.context_processors import csrf
from django.contrib.auth.admin import User

from models import UserProfile
# @requires_csrf_token
def index(request):
    context = {}
    context.update({'font_size':(11,12,13,14,15,16,17,18,19,20,21,22,23,24,25)})
    if request.method == 'GET':
        pass
    elif request.method == 'POST':
        u1 = UserProfile.objects.get(user=User.objects.get(username='jason'))
        print(request.POST)
        u1.text = request.POST['textBody'].lstrip().rstrip()
        u1.save()
    return render_to_response('index.html', context, context_instance=RequestContext(request))

def this(request):
    u1 = UserProfile.objects.get(user=User.objects.get(username='jason'))
    context = {'text_body':u1.text}
    return render(request, 'this.html', context)
    
def userProfile(request):
    context = {}
    return render(request, 'userProfile.html', context)

