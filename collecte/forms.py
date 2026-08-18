"""
Formulaire de collecte basé sur le modèle Entreprise.
Django génère automatiquement la validation à partir des contraintes du
modèle (obligatoire/optionnel, EmailField, URLField...) : pas besoin de
réécrire toutes les règles à la main comme en PHP.
"""
from django import forms

from .models import Entreprise


class EntrepriseForm(forms.ModelForm):
    """Formulaire de saisie d'une fiche de collecte terrain."""

    class Meta:
        model = Entreprise
        # On exclut volontairement "enqueteur" : il est attribué automatiquement
        # dans la vue à partir de l'utilisateur connecté, jamais saisi par le formulaire.
        fields = [
            "nom_entreprise", "secteur", "type_activite", "taille_effectif",
            "adresse", "ville", "code_postal", "telephone", "email", "site_web",
            "date_enquete", "observations",
        ]
        widgets = {
            "nom_entreprise": forms.TextInput(attrs={"class": "form-control"}),
            "secteur": forms.Select(attrs={"class": "form-select"}),
            "type_activite": forms.Select(attrs={"class": "form-select"}),
            "taille_effectif": forms.NumberInput(attrs={"class": "form-control", "min": 0}),
            "adresse": forms.TextInput(attrs={"class": "form-control"}),
            "ville": forms.TextInput(attrs={"class": "form-control"}),
            "code_postal": forms.TextInput(attrs={"class": "form-control"}),
            "telephone": forms.TextInput(attrs={"class": "form-control", "placeholder": "05XXXXXXXX"}),
            "email": forms.EmailInput(attrs={"class": "form-control"}),
            "site_web": forms.URLInput(attrs={"class": "form-control", "placeholder": "https://exemple.com"}),
            "date_enquete": forms.DateInput(attrs={"class": "form-control", "type": "date"}),
            "observations": forms.Textarea(attrs={"class": "form-control", "rows": 4, "maxlength": 2000}),
        }
