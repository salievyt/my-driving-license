from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Profile
from apps.progress.models import UserProgress
from apps.notifications.models import NotificationSetting

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_related_models(sender, instance, created, **kwargs):
    """Auto-create Profile, UserProgress, and NotificationSetting when a user is created."""
    if created:
        Profile.objects.get_or_create(user=instance)
        UserProgress.objects.get_or_create(user=instance)
        NotificationSetting.objects.get_or_create(user=instance)
