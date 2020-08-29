from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "dm"

router = DefaultRouter()
router.register("message", views.MessageViewSet, basename="message")
router.register("inbox", views.InboxListView, basename="inbox")

urlpatterns = [path("", include(router.urls))]
