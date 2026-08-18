"""
Enregistre le modèle Utilisateur dans l'admin Django, avec le champ rôle visible.
Permet à l'administrateur de gérer les enquêteurs directement via /admin-django/
"""
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Utilisateur


@admin.register(Utilisateur)
class UtilisateurAdmin(UserAdmin):
    """Personnalisation de l'admin pour afficher, rechercher et filtrer par rôle et statut actif."""

    list_display = ("username", "first_name", "last_name", "email", "telephone", "role", "is_active")
    list_filter = ("role", "is_active", "is_staff")
    search_fields = ("username", "first_name", "last_name", "email", "telephone")
    ordering = ("username",)

    fieldsets = UserAdmin.fieldsets + (
        ("Informations métier Data Ingénierie", {"fields": ("role", "telephone")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("Informations métier Data Ingénierie", {"fields": ("role", "telephone", "email", "first_name", "last_name")}),
    )
