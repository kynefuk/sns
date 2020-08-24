from rest_framework import authentication, permissions, viewsets

from . import serializers
from core.models import Message


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = serializers.MessageSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get", "post", "options"]

    def get_queryset(self):
        """自分が送信元であるMessageのみ"""
        return self.queryset.filter(sender=self.request.user)

    def perform_create(self, serializer):
        """Messageの送信元はrequest.userとする"""
        serializer.save(sender=self.request.user)


class InboxListView(viewsets.ReadOnlyModelViewSet):
    queryset = Message.objects.all()
    serializer_class = serializers.MessageSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    http_method_names = ["get", "options"]

    def get_queryset(self):
        """自分宛てのMessageのみ表示する"""
        return self.queryset.filter(receiver=self.request.user)
