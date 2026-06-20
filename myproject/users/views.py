from django.shortcuts import render
from .models import User
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password

import random
import string

# Create your views here.

@csrf_exempt
def register(request):
    if request.method=='POST':
        data = json.loads(request.body)

        name = data["name"]
        email = data["email"]
        unhashed_password = data["password"]
        password = make_password(unhashed_password)
        if User.objects.filter(email=email).exists():
            return JsonResponse({'message': 'User with this email already exists'})
        user = User(name=name, email=email, password=password)
        user.save()

        return JsonResponse({'name':name, 'email':email})
    else:
        return JsonResponse({'message':'only POST request is allowed'})
    

@csrf_exempt
def login(request):
    if request.method=='POST':
        data = json.loads(request.body)

        email = data["email"]
        password = data["password"]

        user = User.objects.filter(email = email).first()

        if user is None:
            return JsonResponse({'message': 'User with this email does not exist'})
        
        if not check_password(password,user.password):
            return JsonResponse({'message': 'Incorrect password'})  
        
        return JsonResponse({'message': 'Login Successful'})
    return JsonResponse({'message':'only POST request is allowed'})
    

@csrf_exempt
def shorten_url(request):
    
