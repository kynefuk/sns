from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

app_name = "user"

router = DefaultRouter()
router.register("profile", views.ProfileViewSet)
router.register("friend-request", views.FriendRequestViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("create/", views.CreateUserView.as_view(), name="create"),
    path("myprofile/", views.MyProfileListView.as_view(), name="myprofile"),
]
