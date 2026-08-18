"""
Configuration Django du projet Collecte Terrain.
Les paramètres sensibles (secret key, mot de passe BDD) viennent des
variables d'environnement définies dans docker-compose.yml / fichier .env,
jamais codées en dur ici.
"""
import os
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# --------------------------------------------------------------------
# Sécurité
# --------------------------------------------------------------------
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "cle-de-developpement-a-ne-jamais-utiliser-en-production")
DEBUG = os.getenv("DJANGO_DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1,*").split(",")

# --------------------------------------------------------------------
# Applications
# --------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Third party apps
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt",
    # Local apps
    "comptes",
    "collecte",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        # DIRS vide : l'ancienne interface HTML (templates/ à la racine) a été
        # retirée. APP_DIRS=True suffit à fournir les templates nécessaires à
        # l'admin Django natif et à l'API navigable de Django REST Framework.
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# --------------------------------------------------------------------
# Base de données (PostgreSQL sous Docker, SQLite en secours local)
# --------------------------------------------------------------------
USE_SQLITE = os.getenv("USE_SQLITE", "False").lower() in ("true", "1")

if USE_SQLITE or not os.getenv("POSTGRES_HOST"):
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.getenv("POSTGRES_DB", "collecte_terrain"),
            "USER": os.getenv("POSTGRES_USER", "collecte_user"),
            "PASSWORD": os.getenv("POSTGRES_PASSWORD", "collecte_pass"),
            "HOST": os.getenv("POSTGRES_HOST", "db"),
            "PORT": os.getenv("POSTGRES_PORT", "5432"),
        }
    }

# --------------------------------------------------------------------
# Modèle utilisateur personnalisé
# --------------------------------------------------------------------
AUTH_USER_MODEL = "comptes.Utilisateur"

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# --------------------------------------------------------------------
# Configuration CORS
# --------------------------------------------------------------------
CORS_ALLOW_ALL_ORIGINS = True  # Autoriser React en dev
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
CORS_ALLOW_CREDENTIALS = True

# --------------------------------------------------------------------
# Configuration Django REST Framework & SimpleJWT
# --------------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(hours=8),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

# --------------------------------------------------------------------
# Connexion : redirections après login/logout (pour templates)
# --------------------------------------------------------------------
LOGIN_URL = "comptes:login"
LOGIN_REDIRECT_URL = "collecte:accueil"
LOGOUT_REDIRECT_URL = "comptes:login"

# --------------------------------------------------------------------
# Internationalisation : français, fuseau horaire Maroc
# --------------------------------------------------------------------
LANGUAGE_CODE = "fr-fr"
TIME_ZONE = "Africa/Casablanca"
USE_I18N = True
USE_TZ = True

# --------------------------------------------------------------------
# Fichiers statiques
# --------------------------------------------------------------------
STATIC_URL = "static/"
# STATICFILES_DIRS retiré : le dossier static/ (logo/CSS de l'ancienne
# interface HTML) a été supprimé. L'admin Django natif fournit ses propres
# fichiers statiques via APP_DIRS, aucun dossier custom n'est plus nécessaire.
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
