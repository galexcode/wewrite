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
    if request.method == 'GET':
        u1 = UserProfile.objects.get(user=User.objects.get(username='jason'))
        context.update([('text_body',u1.text)])
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

