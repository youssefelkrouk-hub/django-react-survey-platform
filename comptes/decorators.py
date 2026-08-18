"""
Décorateurs de contrôle d'accès par rôle, à poser sur les vues fonctions.
S'appuient sur @login_required de Django pour la vérification de connexion,
puis ajoutent la vérification du rôle métier (admin / enquêteur).
"""
from functools import wraps

from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied


def role_requis(role_attendu):
    """
    Usage : @role_requis("admin")  ou  @role_requis("enqueteur")
    Bloque l'accès (403) si l'utilisateur connecté n'a pas le bon rôle.
    """
    def decorateur(vue):
        @login_required
        @wraps(vue)
        def wrapper(request, *args, **kwargs):
            if request.user.role != role_attendu:
                raise PermissionDenied("Vous n'avez pas accès à cette page.")
            return vue(request, *args, **kwargs)
        return wrapper
    return decorateur


# Raccourcis pratiques
admin_requis = role_requis("admin")
enqueteur_requis = role_requis("enqueteur")
