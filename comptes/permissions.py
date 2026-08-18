from rest_framework.permissions import BasePermission
from .models import Utilisateur


class IsAdminUserRole(BasePermission):
    """Permission vérifiant que l'utilisateur est authentifié et a le rôle ADMIN."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.role == Utilisateur.Role.ADMIN or request.user.is_superuser)
        )


class IsEnqueteurUserRole(BasePermission):
    """Permission vérifiant que l'utilisateur est authentifié et a le rôle ENQUETEUR."""

    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and request.user.role == Utilisateur.Role.ENQUETEUR
        )
