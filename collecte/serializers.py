from rest_framework import serializers
from comptes.serializers import UtilisateurSerializer
from .models import Entreprise, SecteurActivite, TypeActivite


class SecteurActiviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecteurActivite
        fields = ["id", "nom"]


class TypeActiviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeActivite
        fields = ["id", "nom"]


class EntrepriseSerializer(serializers.ModelSerializer):
    secteur_nom = serializers.CharField(source="secteur.nom", read_only=True)
    type_activite_nom = serializers.CharField(source="type_activite.nom", read_only=True)
    enqueteur_nom = serializers.SerializerMethodField()

    class Meta:
        model = Entreprise
        fields = [
            "id",
            "nom_entreprise",
            "secteur",
            "secteur_nom",
            "type_activite",
            "type_activite_nom",
            "taille_effectif",
            "adresse",
            "ville",
            "code_postal",
            "telephone",
            "email",
            "site_web",
            "date_enquete",
            "observations",
            "enqueteur",
            "enqueteur_nom",
            "date_creation",
        ]
        read_only_fields = ["id", "enqueteur", "date_creation"]

    def get_enqueteur_nom(self, obj):
        if obj.enqueteur:
            return obj.enqueteur.get_full_name() or obj.enqueteur.username
        return "N/C"

    def create(self, validated_data):
        # Attribution automatique de l'enquêteur connecté
        request = self.context.get("request")
        if request and hasattr(request, "user"):
            validated_data["enqueteur"] = request.user
        return super().create(validated_data)
