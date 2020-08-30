from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.db import models


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("email is must")

        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password):
        user = self.create_user(email, password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user


class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"

    def __str__(self):
        return self.email


def upload_path(instance, filename):
    ext = filename.split(".")[-1]
    return "/".join(
        ["image", str(instance.user.id), str(instance.nick_ame) + str(".") + str(ext),],
    )


class Profile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        related_name="user",
        on_delete=models.CASCADE,
        null=True,
    )
    nick_name = models.CharField(max_length=20)
    created_on = models.DateTimeField(auto_now_add=True)
    img = models.ImageField(blank=True, null=True, upload_to=upload_path)

    def __str__(self):
        return self.nick_name


class FriendRequest(models.Model):
    ask_from = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="ask_from", on_delete=models.CASCADE
    )
    ask_to = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="ask_to", on_delete=models.CASCADE
    )
    is_approved = models.BooleanField(default=False)

    class Meta:
        unique_together = (("ask_from", "ask_to"),)

    def __str__(self):
        return f"{self.ask_from}------>{self.ask_to}"


class Message(models.Model):
    message = models.CharField(max_length=140)
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="sender", on_delete=models.CASCADE
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="receiver", on_delete=models.CASCADE
    )

    def __str__(self):
        return self.sender
