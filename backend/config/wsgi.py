import os
from decouple import config

os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'config.settings.{config("DJANGO_ENV", default="development")}')

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
