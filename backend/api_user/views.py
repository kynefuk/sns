from django.db.models import Q
from rest_framework import authentication, generics, permissions, viewsets
from rest_framework.exceptions import ValidationError

from core import custom_permissions
from core.models import FriendRequest, Profile

from . import serializers


class CreateUserView(generics.CreateAPIView):
    serializer_class = serializers.UserSerializer


class FriendRequestViewSet(viewsets.ModelViewSet):
    queryset = FriendRequest.objects.all()
    serializer_class = serializers.FriendRequestSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get", "post", "put", "delete", "options"]

    def get_queryset(self):
        """自分宛て、自分から送ったFriendRequestのみ"""
        return self.queryset.filter(
            Q(ask_to=self.request.user) | Q(ask_from=self.request.user)
        )

    def perform_create(self, serializer):
        """レコード作成する際は、ask_fromはリクエストユーザとする"""
        try:
            serializer.save(ask_from=self.request.user)
        except Exception:
            raise ValidationError("User can have only unique request")


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (
        permissions.IsAuthenticated,
        custom_permissions.ProfilePermission,
    )

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class MyProfileListView(generics.ListAPIView):
    queryset = Profile.objects.all()
    serializer_class = serializers.ProfileSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """リクエストユーザに紐づくProfileのみ返す"""
        return self.queryset.filter(user=self.request.user)
