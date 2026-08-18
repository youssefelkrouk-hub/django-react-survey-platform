"""
Modèles métier : secteurs/types d'activité (listes de référence) et Entreprise
(une ligne = une fiche de collecte remplie par un enquêteur sur le terrain).
"""
from django.conf import settings
from django.db import models


class SecteurActivite(models.Model):
    """Liste de référence des secteurs d'activité (préremplie via fixture)."""

    nom = models.CharField(max_length=150, unique=True, verbose_name="Secteur d'activité")

    class Meta:
        verbose_name = "Secteur d'activité"
        verbose_name_plural = "Secteurs d'activité"
        ordering = ["nom"]

    def __str__(self) -> str:
        return self.nom


class TypeActivite(models.Model):
    """Liste de référence des types d'activité (préremplie via fixture)."""

    nom = models.CharField(max_length=150, unique=True, verbose_name="Type d'activité")

    class Meta:
        verbose_name = "Type d'activité"
        verbose_name_plural = "Types d'activité"
        ordering = ["nom"]

    def __str__(self) -> str:
        return self.nom


class Entreprise(models.Model):
    """Une fiche de collecte terrain pour une entreprise interviewée."""

    nom_entreprise = models.CharField(max_length=200, verbose_name="Nom de l'entreprise")
    secteur = models.ForeignKey(
        SecteurActivite, on_delete=models.SET_NULL, null=True, blank=True,
        verbose_name="Secteur d'activité",
    )
    type_activite = models.ForeignKey(
        TypeActivite, on_delete=models.SET_NULL, null=True, blank=True,
        verbose_name="Type d'activité",
    )
    taille_effectif = models.PositiveIntegerField(
        null=True, blank=True, verbose_name="Taille (nombre d'employés)",
    )
    adresse = models.CharField(max_length=255, verbose_name="Adresse complète")
    ville = models.CharField(max_length=100, verbose_name="Ville")
    code_postal = models.CharField(max_length=10, blank=True, null=True, verbose_name="Code postal")
    telephone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Téléphone")
    email = models.EmailField(blank=True, null=True, verbose_name="Email")
    site_web = models.URLField(blank=True, null=True, verbose_name="Site web")
    date_enquete = models.DateField(verbose_name="Date d'enquête")
    observations = models.TextField(blank=True, null=True, verbose_name="Observations libres")

    # Attribution automatique de la collecte à l'enquêteur connecté (jamais modifiable via le formulaire)
    enqueteur = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="collectes", verbose_name="Enquêteur",
    )
    date_creation = models.DateTimeField(auto_now_add=True, verbose_name="Date de saisie")

    class Meta:
        verbose_name = "Entreprise collectée"
        verbose_name_plural = "Entreprises collectées"
        ordering = ["-date_creation"]
        indexes = [
            models.Index(fields=["enqueteur"]),
            models.Index(fields=["date_enquete"]),
        ]

    def __str__(self) -> str:
        return f"{self.nom_entreprise} ({self.ville})"
