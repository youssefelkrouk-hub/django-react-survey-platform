"""
Enregistre les modèles métier dans l'admin Django (utile pour vérifier
rapidement les données pendant le développement, et pour gérer les
secteurs/types d'activité sans coder d'interface dédiée).
"""
from django.contrib import admin

from .models import Entreprise, SecteurActivite, TypeActivite


@admin.register(SecteurActivite)
class SecteurActiviteAdmin(admin.ModelAdmin):
    list_display = ("nom",)
    search_fields = ("nom",)


@admin.register(TypeActivite)
class TypeActiviteAdmin(admin.ModelAdmin):
    list_display = ("nom",)
    search_fields = ("nom",)


@admin.register(Entreprise)
class EntrepriseAdmin(admin.ModelAdmin):
    list_display = ("nom_entreprise", "ville", "secteur", "enqueteur", "date_enquete")
    list_filter = ("secteur", "type_activite", "enqueteur")
    search_fields = ("nom_entreprise", "ville")
    date_hierarchy = "date_enquete"
