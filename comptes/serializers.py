from rest_framework import serializers
from .models import Utilisateur


class UtilisateurSerializer(serializers.ModelSerializer):
    """Serializer d'affichage d'un utilisateur / enquêteur."""

    role_display = serializers.CharField(source="get_role_display", read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = Utilisateur
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "full_name",
            "email",
            "role",
            "role_display",
            "telephone",
            "is_active",
        ]
        read_only_fields = ["id"]

    def get_full_name(self, obj):
        return obj.get_full_name() or obj.username


class EnqueteurCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour la création et la modification d'un enquêteur par l'admin."""

    password = serializers.CharField(write_only=True, required=False, min_length=6)

    class Meta:
        model = Utilisateur
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "telephone",
            "role",
            "is_active",
            "password",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        validated_data["role"] = Utilisateur.Role.ENQUETEUR
        user = Utilisateur(**validated_data)
        if password:
            user.set_password(password)
        else:
            user.set_password("Enquete123!")
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance
