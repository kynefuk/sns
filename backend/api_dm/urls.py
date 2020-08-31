from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "dm"

router = DefaultRouter()
router.register("messages", views.MessageViewSet, basename="messages")
router.register("inboxes", views.InboxListView, basename="inboxes")

urlpatterns = [path("", include(router.urls))]
