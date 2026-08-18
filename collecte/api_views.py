import csv
from django.db.models import Count, Q
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from comptes.models import Utilisateur
from comptes.serializers import UtilisateurSerializer
from comptes.permissions import IsAdminUserRole, IsEnqueteurUserRole

from .models import Entreprise, SecteurActivite, TypeActivite
from .serializers import (
    EntrepriseSerializer,
    SecteurActiviteSerializer,
    TypeActiviteSerializer,
)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_enqueteur_api(request):
    """Tableau de bord de l'enquêteur connecté (stats personnelles uniquement)."""
    if request.user.role == Utilisateur.Role.ADMIN:
        return Response(
            {"detail": "Veuillez consulter le dashboard administrateur."},
            status=status.HTTP_403_FORBIDDEN,
        )

    mes_collectes = Entreprise.objects.filter(enqueteur=request.user)
    aujourdhui = timezone.localdate()

    total_collectes = mes_collectes.count()
    collectes_aujourdhui = mes_collectes.filter(date_creation__date=aujourdhui).count()
    dernieres_collectes = EntrepriseSerializer(
        mes_collectes.select_related("secteur", "type_activite")[:5], many=True
    ).data

    return Response({
        "total_collectes": total_collectes,
        "collectes_aujourdhui": collectes_aujourdhui,
        "dernieres_collectes": dernieres_collectes,
    })


@api_view(["GET"])
@permission_classes([IsAdminUserRole])
def dashboard_admin_api(request):
    """Tableau de bord administrateur (stats globales)."""
    aujourdhui = timezone.localdate()

    par_enqueteur_qs = (
        Utilisateur.objects.filter(role=Utilisateur.Role.ENQUETEUR)
        .annotate(nb_collectes=Count("collectes"))
        .order_by("-nb_collectes")
    )
    par_enqueteur_data = [
        {
            "id": u.id,
            "username": u.username,
            "full_name": u.get_full_name() or u.username,
            "email": u.email,
            "telephone": u.telephone,
            "is_active": u.is_active,
            "nb_collectes": u.nb_collectes,
        }
        for u in par_enqueteur_qs
    ]

    dernieres_collectes = EntrepriseSerializer(
        Entreprise.objects.select_related("secteur", "type_activite", "enqueteur")[:8],
        many=True,
    ).data

    return Response({
        "total_entreprises": Entreprise.objects.count(),
        "collectes_aujourdhui": Entreprise.objects.filter(date_creation__date=aujourdhui).count(),
        "total_enqueteurs": Utilisateur.objects.filter(role=Utilisateur.Role.ENQUETEUR).count(),
        "enqueteurs_actifs": Utilisateur.objects.filter(role=Utilisateur.Role.ENQUETEUR, is_active=True).count(),
        "par_enqueteur": par_enqueteur_data,
        "dernieres_collectes": dernieres_collectes,
    })


class EntrepriseViewSet(viewsets.ModelViewSet):
    """ViewSet pour la gestion des entreprises collectées sur le terrain."""

    serializer_class = EntrepriseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Entreprise.objects.select_related("secteur", "type_activite", "enqueteur")

        # Si c'est un enquêteur, il ne voit QUE ses propres collectes
        if user.role == Utilisateur.Role.ENQUETEUR:
            queryset = queryset.filter(enqueteur=user)

        # Recherche par mot-clé ?q=
        q = self.request.query_params.get("q", "").strip()
        if q:
            queryset = queryset.filter(
                Q(nom_entreprise__icontains=q)
                | Q(ville__icontains=q)
                | Q(adresse__icontains=q)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(enqueteur=self.request.user)


class SecteurActiviteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SecteurActivite.objects.all()
    serializer_class = SecteurActiviteSerializer
    permission_classes = [IsAuthenticated]


class TypeActiviteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TypeActivite.objects.all()
    serializer_class = TypeActiviteSerializer
    permission_classes = [IsAuthenticated]


@api_view(["GET"])
@permission_classes([IsAdminUserRole])
def export_csv_api(request):
    """Export CSV de toutes les fiches de collecte (UTF-8 avec BOM)."""
    reponse = HttpResponse(content_type="text/csv; charset=utf-8")
    reponse["Content-Disposition"] = f'attachment; filename="collectes_{timezone.now():%Y-%m-%d_%H%M%S}.csv"'
    reponse.write("\ufeff")  # BOM UTF-8

    ecrivain = csv.writer(reponse, delimiter=";")
    ecrivain.writerow([
        "Entreprise", "Secteur", "Type d'activité", "Effectif", "Adresse", "Ville",
        "Code postal", "Téléphone", "Email", "Site web", "Date d'enquête",
        "Observations", "Enquêteur", "Date de saisie",
    ])

    for e in Entreprise.objects.select_related("secteur", "type_activite", "enqueteur").all():
        ecrivain.writerow([
            e.nom_entreprise,
            e.secteur.nom if e.secteur else "",
            e.type_activite.nom if e.type_activite else "",
            e.taille_effectif or "",
            e.adresse,
            e.ville,
            e.code_postal or "",
            e.telephone or "",
            e.email or "",
            e.site_web or "",
            e.date_enquete.strftime("%d/%m/%Y"),
            e.observations or "",
            e.enqueteur.get_full_name() if e.enqueteur else "",
            e.date_creation.strftime("%d/%m/%Y %H:%M"),
        ])

    return reponse
