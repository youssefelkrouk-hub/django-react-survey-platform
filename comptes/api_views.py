from rest_framework import status, generics, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Utilisateur
from .serializers import UtilisateurSerializer, EnqueteurCreateUpdateSerializer
from .permissions import IsAdminUserRole


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # Ajouter les données utilisateur dans la réponse du login
        data["user"] = UtilisateurSerializer(self.user).data
        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def me_view(request):
    """Renvoie le profil de l'utilisateur actuellement connecté."""
    serializer = UtilisateurSerializer(request.user)
    return Response(serializer.data)


class EnqueteurViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des enquêteurs par l'administrateur."""

    queryset = Utilisateur.objects.filter(role=Utilisateur.Role.ENQUETEUR)
    serializer_class = EnqueteurCreateUpdateSerializer
    permission_classes = [IsAdminUserRole]

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return UtilisateurSerializer
        return EnqueteurCreateUpdateSerializer

    def perform_destroy(self, instance):
        # Désactivation au lieu de suppression physique pour garder l'historique
        instance.is_active = False
        instance.save()
