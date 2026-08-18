"""URLs racines du projet."""
from django.contrib import admin
from django.urls import include, path

# Personnalisation de l'entête de l'administration Django
admin.site.site_header = "Data Ingénierie — Administration"
admin.site.site_title = "Data Ingénierie"
admin.site.index_title = "Gestion des Enquêteurs et Référentiels Terrain"

urlpatterns = [
    path("admin-django/", admin.site.urls),  # Admin technique Django
    path("api/v1/", include("config.api_urls")),  # Endpoints REST API v1 pour le Frontend React
]
