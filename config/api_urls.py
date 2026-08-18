from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from comptes.api_views import (
    CustomTokenObtainPairView,
    me_view,
    EnqueteurViewSet,
)
from collecte.api_views import (
    dashboard_enqueteur_api,
    dashboard_admin_api,
    EntrepriseViewSet,
    SecteurActiviteViewSet,
    TypeActiviteViewSet,
    export_csv_api,
)

router = DefaultRouter()
router.register("collectes", EntrepriseViewSet, basename="api_collectes")
router.register("admin/enqueteurs", EnqueteurViewSet, basename="api_admin_enqueteurs")
router.register("referentiels/secteurs", SecteurActiviteViewSet, basename="api_secteurs")
router.register("referentiels/types-activite", TypeActiviteViewSet, basename="api_types_activite")

urlpatterns = [
    # Authentification JWT
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/me/", me_view, name="api_me"),

    # Dashboards
    path("enqueteur/dashboard/", dashboard_enqueteur_api, name="api_dashboard_enqueteur"),
    path("admin/dashboard/", dashboard_admin_api, name="api_dashboard_admin"),

    # Export CSV
    path("export-csv/", export_csv_api, name="api_export_csv"),

    # ViewSets (collectes, enquêteurs, secteurs, types)
    path("", include(router.urls)),
]
