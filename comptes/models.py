"""
Modèle utilisateur personnalisé : ajoute un champ "rôle" au User Django standard.
Un modèle personnalisé est créé dès le départ (bonne pratique Django),
car il est très difficile de migrer vers un User personnalisé après coup.
"""
from django.contrib.auth.models import AbstractUser
from django.db import models


class Utilisateur(AbstractUser):
    """Étend AbstractUser avec un rôle métier (admin ou enquêteur)."""

    class Role(models.TextChoices):
        ADMIN = "admin", "Administrateur"
        ENQUETEUR = "enqueteur", "Enquêteur"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.ENQUETEUR,
        verbose_name="Rôle",
    )
    telephone = models.CharField(max_length=20, blank=True, null=True, verbose_name="Téléphone")

    def est_admin(self) -> bool:
        return self.role == self.Role.ADMIN

    def est_enqueteur(self) -> bool:
        return self.role == self.Role.ENQUETEUR

    def __str__(self) -> str:
        return f"{self.get_full_name() or self.username} ({self.get_role_display()})"
