from django.db.models import Q
from rest_framework import serializers

from core.models import FriendRequest, Message, User


class FriendsFilter(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        """自分宛ての友達申請&&承認済みの友達を抽出する"""
        request = self.context["request"]
        friend_requests = FriendRequest.objects.filter(
            (Q(ask_to=request.user) & Q(is_approved=True))
            # | (Q(ask_from=request.user) & Q(is_approved=True))
        )

        list_friend = []
        for request in friend_requests:
            list_friend.append(request.ask_from.id)
        queryset = User.objects.filter(id__in=list_friend)

        return queryset


class MessageSerializer(serializers.ModelSerializer):

    # Messageの送信先には自分のFriendのみを選択できるようにする
    receiver = FriendsFilter()

    class Meta:
        model = Message
        fields = ["id", "sender", "receiver", "message"]
        extra_kwargs = {"sender": {"read_only": True}}
