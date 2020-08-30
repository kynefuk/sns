from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from core.models import FriendRequest, Profile


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)
        # user作成時にトークンも作成する
        Token.objects.create(user=user)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    created_on = serializers.DateTimeField(format="%Y-%m-%d", read_only=True)

    class Meta:
        model = Profile
        fields = ["id", "nick_name", "user", "created_on", "img"]
        extra_kwargs = {"user": {"read_only": True}}


class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ["id", "ask_from", "ask_to", "is_approved"]
        # askFromはrequest.userになるよう設定しているためwriteできなくて良い
        extra_kwargs = {"ask_from": {"read_only": True}}
