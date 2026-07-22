#!/bin/bash
set -e

echo "Running database migrations..."
python manage.py migrate --noinput --settings=config.settings.production

echo "Collecting static files..."
python manage.py collectstatic --noinput --settings=config.settings.production

echo "Starting server..."
exec "$@"
