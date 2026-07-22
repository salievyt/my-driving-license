from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import F
from django.contrib.auth import get_user_model
from apps.notifications.models import Notification, NotificationSetting

User = get_user_model()


class Command(BaseCommand):
    help = 'Отправляет напоминания пользователям, которые не занимались сегодня'

    def handle(self, *args, **options):
        today = timezone.now().date()
        now = timezone.now().time()

        # Get users who have daily reminders enabled
        # and whose reminder time has passed, but haven't studied today
        settings = NotificationSetting.objects.filter(
            daily_reminder=True,
            reminder_time__lte=now,
            user__profile__last_active_date__lt=today,
        ).select_related('user')

        count = 0
        for setting in settings:
            user = setting.user

            # Don't send if already sent today
            already_sent = Notification.objects.filter(
                user=user,
                notification_type='reminder',
                created_at__date=today,
            ).exists()

            if already_sent:
                continue

            # Personalize the message based on the user
            profile = user.profile
            streak = profile.streak_days

            if streak > 0:
                title = f'🔥 Не теряй серию! ({streak} дней)'
                message = (
                    f'Ты не занимался сегодня. '
                    f'Всего 5 минут — и streak в {streak} дней продолжится!'
                )
            elif profile.experience_level == 'beginner':
                title = '📚 Пора учить ПДД!'
                message = (
                    'Один вопрос в день — и ты будешь готов к экзамену. '
                    'Начни с лёгкого теста!'
                )
            else:
                title = '🎯 Твой ежедневный урок'
                message = (
                    'Не забывай про цель — подготовка к экзамену. '
                    'Пара минут в день приближает тебя к правам!'
                )

            Notification.objects.create(
                user=user,
                title=title,
                message=message,
                notification_type='reminder',
                link='/dashboard',
            )

            count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Отправлено {count} напоминаний'
        ))
