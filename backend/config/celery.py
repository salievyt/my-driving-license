from celery import Celery
from decouple import config
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', f'config.settings.{config("DJANGO_ENV", default="development")}')

app = Celery('my_driving_study')
app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()
