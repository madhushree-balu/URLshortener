from django.shortcuts import render, redirect
from .models import User, ShortUrl
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password

import jwt
import datetime
import random
import string

# Create your views here.


@csrf_exempt
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)

        name = data["name"]
        email = data["email"]
        unhashed_password = data["password"]
        password = make_password(unhashed_password)
        if User.objects.filter(email=email).exists():
            return JsonResponse({"message": "User with this email already exists"})
        user = User(name=name, email=email, password=password)
        user.save()
        # print("User created:", user)

        return JsonResponse({"name": name, "email": email})
    else:
        return JsonResponse({"message": "only POST request is allowed"})


@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)

        email = data["email"]
        password = data["password"]

        user = User.objects.filter(email=email).first()

        if user is None:
            return JsonResponse({"message": "User with this email does not exist"})

        if not check_password(password, user.password):
            return JsonResponse({"message": "Incorrect password"})

        payload = {
            "user_id": user.id,
            "email": user.email,
            # "exp": datetime.datetime.now() + datetime.timedelta(days=1),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }
        # print("Payload:", payload)

        token = jwt.encode(payload, "mysecretkey", algorithm="HS256")

        return JsonResponse({"message": "Login Successful", "token": token})
    return JsonResponse({"message": "only POST request is allowed"})


@csrf_exempt
def shorten_url(request):
    token = request.headers.get("Authorization")
    payload = jwt.decode(token, "mysecretkey", algorithms=["HS256"])
    user_id = payload["user_id"]
    user = User.objects.get(id=user_id)

    data = json.loads(request.body)
    # print("BODY:", request.body)
    # print("DATA:", data)
    # print("TYPE:", type(data))
    original_url = data["original_url"]
    short_url = "".join(random.choices(string.ascii_letters + string.digits, k=6))
    short_url_obj = ShortUrl.objects.create(
        user=user, original_url=original_url, short_url=short_url
    )

    return JsonResponse(
        {
            "message": "Short URL Created",
            "original_url": original_url,
            "short_url": short_url,
        }
    )


def original_url(request, short_url):
    if ShortUrl.objects.filter(short_url=short_url).exists():
        ShortUrl_obj = ShortUrl.objects.get(short_url=short_url)
        # print(ShortUrl_obj.original_url)
        # return JsonResponse({
        # "original_url": ShortUrl_obj.original_url,
        # })

        
        ShortUrl_obj.click_count += 1
        ShortUrl_obj.save()

        return redirect(ShortUrl_obj.original_url)
    else:
        return JsonResponse(
            {
                "message": "Short URL does not exist",
            }
        )
def all_urls(request):
    token = request.headers.get("Authorization")
    payload = jwt.decode(token, "mysecretkey", algorithms=["HS256"])
    user_id = payload["user_id"]
    user = User.objects.get(id=user_id)    
    urls = ShortUrl.objects.filter(user=user)
    allurls = []
    for url in urls:
        allurls.append({"original_url": url.original_url, "short_url": url.short_url, "created_at": url.created_at, "click_count": url.click_count})
    
    # print(allurls)
    return JsonResponse({"urls": allurls})

@csrf_exempt
def delete_url(request, short_url):
    if request.method != "DELETE":
        return JsonResponse({
            "message": "Only DELETE requests are allowed"
        })

    token = request.headers.get("Authorization")

    payload = jwt.decode(
        token,
        "mysecretkey",
        algorithms=["HS256"]
    )

    user_id = payload["user_id"]

    user = User.objects.get(id=user_id)

    url = ShortUrl.objects.filter(
        short_url=short_url,
        user=user
    )

    if url.exists():
        url.delete()

        return JsonResponse({
            "message": "URL deleted successfully"
        })

    return JsonResponse({
        "message": "Short URL does not exist or you do not have permission to delete it"
    })