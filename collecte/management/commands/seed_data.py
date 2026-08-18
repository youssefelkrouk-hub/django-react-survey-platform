"""
Commande de seed initiale pour alimenter la base de données :
- Secteurs d'activité
- Types d'activité
- Compte Administrateur (admin / Admin123!)
- Compte Enquêteur (enqueteur1 / Enquete123!)
- Données de démonstration
"""
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from collecte.models import SecteurActivite, TypeActivite, Entreprise

Utilisateur = get_user_model()


class Command(BaseCommand):
    help = "Alimente la base de données avec des secteurs, types d'activité et comptes utilisateurs initiaux."

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("=== Initialisation des données Data Ingénierie ==="))

        # 1. Secteurs d'activité
        secteurs_noms = [
            "Agriculture et pêche",
            "Industrie et manufacture",
            "BTP et construction",
            "Commerce et distribution",
            "Tourisme et hôtellerie",
            "Transport et logistique",
            "Technologies de l'information",
            "Finance et assurance",
            "Santé et action sociale",
            "Éducation et formation",
            "Artisanat",
            "Services aux entreprises",
            "Autre",
        ]
        secteurs = {}
        for nom in secteurs_noms:
            s, created = SecteurActivite.objects.get_or_create(nom=nom)
            secteurs[nom] = s
            if created:
                self.stdout.write(f"  + Secteur créé : {nom}")

        # 2. Types d'activité
        types_noms = [
            "Très petite entreprise (TPE)",
            "Petite et moyenne entreprise (PME)",
            "Grande entreprise",
            "Auto-entrepreneur",
            "Coopérative",
            "Association",
            "Établissement public",
            "Filiale de groupe international",
        ]
        types = {}
        for nom in types_noms:
            t, created = TypeActivite.objects.get_or_create(nom=nom)
            types[nom] = t
            if created:
                self.stdout.write(f"  + Type créé : {nom}")

        # 3. Compte Admin
        admin_user, admin_created = Utilisateur.objects.get_or_create(
            username="admin",
            defaults={
                "email": "admin@data-ingenierie.ma",
                "first_name": "Sara",
                "last_name": "Alaoui",
                "role": Utilisateur.Role.ADMIN,
                "is_staff": True,
                "is_superuser": True,
                "telephone": "0661000001",
            },
        )
        if admin_created:
            admin_user.set_password("Admin123!")
            admin_user.save()
            self.stdout.write(self.style.SUCCESS("  + Compte Admin créé : admin / Admin123!"))
        else:
            self.stdout.write("  . Compte Admin existe déjà.")

        # 4. Compte Enquêteur
        enq_user, enq_created = Utilisateur.objects.get_or_create(
            username="enqueteur1",
            defaults={
                "email": "enqueteur1@data-ingenierie.ma",
                "first_name": "Karim",
                "last_name": "Bennani",
                "role": Utilisateur.Role.ENQUETEUR,
                "is_staff": False,
                "is_superuser": False,
                "telephone": "0662000002",
            },
        )
        if enq_created:
            enq_user.set_password("Enquete123!")
            enq_user.save()
            self.stdout.write(self.style.SUCCESS("  + Compte Enquêteur créé : enqueteur1 / Enquete123!"))
        else:
            self.stdout.write("  . Compte Enquêteur existe déjà.")

        # 5. Fiches de collecte démo si la table est vide
        if not Entreprise.objects.exists():
            entreprises_demo = [
                {
                    "nom_entreprise": "Atlas Tech Solutions",
                    "secteur": secteurs.get("Technologies de l'information"),
                    "type_activite": types.get("Petite et moyenne entreprise (PME)"),
                    "taille_effectif": 25,
                    "adresse": "Bd Mohamed V, Agdal",
                    "ville": "Rabat",
                    "code_postal": "10000",
                    "telephone": "0537001122",
                    "email": "contact@atlastech.ma",
                    "site_web": "https://atlastech.ma",
                    "date_enquete": timezone.localdate(),
                    "observations": "Entreprise innovante spécialisée dans le développement logiciel.",
                    "enqueteur": enq_user,
                },
                {
                    "nom_entreprise": "Maroc Agro Distribution",
                    "secteur": secteurs.get("Commerce et distribution"),
                    "type_activite": types.get("Grande entreprise"),
                    "taille_effectif": 120,
                    "adresse": "Zone Industrielle Ain Sebaâ",
                    "ville": "Casablanca",
                    "code_postal": "20250",
                    "telephone": "0522445566",
                    "email": "info@marocagro.ma",
                    "site_web": "https://marocagro.ma",
                    "date_enquete": timezone.localdate(),
                    "observations": "Distributeur majeur de produits agroalimentaires.",
                    "enqueteur": enq_user,
                },
            ]
            for data in entreprises_demo:
                Entreprise.objects.create(**data)
            self.stdout.write(self.style.SUCCESS("  + 2 collectes de démonstration créées."))

        self.stdout.write(self.style.SUCCESS("=== Initialisation terminée avec succès ==="))
