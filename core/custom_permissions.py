from rest_framework import permissions


class ProfilePermission(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        """自分のProfileのみ更新・削除できる"""
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.userPro.id == request.user.id
