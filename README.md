# Collecte Terrain — Data Ingénierie (Django + PostgreSQL + Docker)

Application web mobile-first de collecte de données d'entreprises pour les enquêteurs terrain de **Data Ingénierie** (Bureau d'études statistiques, Maroc).

---

## 🚀 Démarrage rapide en 1 commande

Prérequis : [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et démarré.

Lancez la commande suivante à la racine du projet :

```bash
docker-compose up --build
```

✨ **Automatisations incluses au démarrage :**
1. Attente automatique que la base de données PostgreSQL soit prête.
2. Application des migrations Django (`python manage.py migrate`).
3. Alimentation de la base de données avec le script de seed (`python manage.py seed_data`).

Une fois démarré, accédez à l'application sur : **http://localhost:5173**

---

## 🔑 Comptes de démonstration précréés

| Rôle | Nom d'utilisateur | Mot de passe | Description |
|---|---|---|---|
| **Administrateur** | `admin` | `Admin123!` | Accès au tableau de bord global, export CSV, gestion des enquêteurs |
| **Enquêteur** | `enqueteur1` | `Enquete123!` | Accès à son propre tableau de bord et à la saisie de collectes |

---

## 🛠️ Accès à la gestion des enquêteurs

L'interface d'administration Django est accessible sur :
👉 **http://localhost:8000/admin-django/**

Connectez-vous avec le compte `admin` pour :
- Ajouter un nouvel enquêteur (Nom, Prénom, Email, Téléphone, Mot de passe).
- Activer / Désactiver un compte d'enquêteur.
- Gérer les listes de référence (Secteurs d'activité, Types d'activité).

---

## 🛑 Arrêter l'application

```bash
# Arrêter les conteneurs (conserve les données enregistrées)
docker-compose down

# Arrêter ET réinitialiser la base de données à zéro
docker-compose down -v
```

---

## 📁 Structure du Projet

```
.
├── docker-compose.yml       # Orchestration des services web (Django) et db (PostgreSQL)
├── Dockerfile                # Configuration de l'image Docker Django
├── entrypoint.sh             # Script d'attente PostgreSQL + migrations + seed
├── requirements.txt          # Dépendances Python (Django 6, psycopg2, etc.)
├── manage.py
├── config/                   # Configuration du projet Django (settings, urls, wsgi)
├── comptes/                  # App 1 : Modèle Utilisateur personnalisé & Rôles
│   ├── admin.py
│   ├── models.py
│   └── views.py
├── collecte/                 # App 2 : Collecte d'entreprises, dashboards & export
│   ├── forms.py
│   ├── models.py
│   ├── views.py
│   └── management/commands/seed_data.py   # Script d'initialisation de la BDD
├── templates/                 # Templates HTML Bootstrap 5 (Mobile-First)
│   ├── base.html
│   ├── comptes/login.html
│   └── collecte/
│       ├── dashboard_admin.html
│       ├── dashboard_enqueteur.html
│       ├── formulaire_collecte.html
│       └── mes_collectes.html
└── static/css/style.css      # Design et thème Data Ingénierie
```

---

## 📋 Rappel des Fonctionnalités Clés

- **Authentification & Sécurité** : Rôles `ADMIN` et `ENQUETEUR` via le modèle `Utilisateur` personnalisé et les décorateurs de sécurité `@admin_requis` et `@enqueteur_requis`.
- **Formulaire de collecte** : Formulaire HTML5 responsive avec attribution automatique de la fiche à l'enquêteur connecté.
- **Dashboards différenciés** :
  - **Admin** : Vue synthétique globale, volume de collecte par enquêteur, fil des dernières fiches.
  - **Enquêteur** : Statistiques personnelles (du jour et cumulées), liste personnelle, raccourci de saisie.
- **Export CSV** : Encodage `UTF-8 avec BOM` pour une ouverture directe et propre sous Excel.
