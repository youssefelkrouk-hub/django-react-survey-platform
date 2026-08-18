#!/bin/sh
set -e

echo "=== Attente de la base de données PostgreSQL ($POSTGRES_HOST:$POSTGRES_PORT) ==="

python << END
import socket
import time
import os

host = os.environ.get('POSTGRES_HOST', 'db')
port = int(os.environ.get('POSTGRES_PORT', 5432))

for _ in range(30):
    try:
        with socket.create_connection((host, port), timeout=2):
            print("PostgreSQL est prêt !")
            break
    except OSError:
        time.sleep(1)
else:
    print("Impossible de se connecter à PostgreSQL")
    exit(1)
END

echo "=== Application des migrations ==="
python manage.py migrate --noinput

echo "=== Chargement des données de seed ==="
python manage.py seed_data

echo "=== Lancement du serveur Web ==="
exec "$@"
