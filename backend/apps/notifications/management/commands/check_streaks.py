from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import F
from django.contrib.auth import get_user_model
from apps.notifications.models import Notification, NotificationSetting
from apps.progress.models import UserProgress
from apps.accounts.models import UserBadge

User = get_user_model()

STREAK_MILESTONES = [3, 7, 14, 30, 60, 100]
XP_REWARDS = {3: 50, 7: 150, 14: 400, 30: 1000, 60: 2500, 100: 5000}
BADGE_MILESTONES = {
    3: {'name': 'Новичок серий', 'desc': 'Занимайся 3 дня подряд', 'icon': '🔥'},
    7: {'name': 'Неделя без пропусков', 'desc': 'Занимайся 7 дней подряд', 'icon': '⭐'},
    14: {'name': 'Две недели', 'desc': 'Занимайся 14 дней подряд', 'icon': '💪'},
    30: {'name': 'Месяц усилий', 'desc': 'Занимайся 30 дней подряд', 'icon': '🏆'},
    60: {'name': 'Два месяца', 'desc': 'Занимайся 60 дней подряд', 'icon': '👑'},
    100: {'name': 'Легенда', 'desc': 'Занимайся 100 дней подряд', 'icon': '💎'},
}

MILESTONE_TITLES = {
    3: '🔥 3 дня подряд!',
    7: '⭐ Неделя без пропусков!',
    14: '💪 14 дней — ты крут!',
    30: '🏆 Месяц обучения!',
    60: '👑 Два месяца! Невероятно!',
    100: '💎 100 дней! Ты легенда!',
}

MILESTONE_MESSAGES = {
    3: 'Три дня подряд — отличный старт! Продолжай в том же духе.',
    7: 'Целая неделя без пропусков! Ты серьёзно настроен.',
    14: 'Две недели ежедневных занятий — это мощный результат!',
    30: 'Месяц обучения! Твой прогресс растёт с каждым днём.',
    60: '60 дней без перерыва! Ты стал настоящим экспертом ПДД.',
    100: '100 дней! Ты прошёл долгий путь и заслуживаешь уважения.',
}


class Command(BaseCommand):
    help = 'Проверяет достижение streak-майлстоунов и отправляет уведомления'

    def handle(self, *args, **options):
        today = timezone.now().date()
        yesterday = today - timezone.timedelta(days=1)

        # For each user, check if their streak matches a milestone
        progress_records = UserProgress.objects.filter(
            last_study_date=today,
            current_streak__in=STREAK_MILESTONES,
        )

        count = 0
        for progress in progress_records:
            user = progress.user
            streak = progress.current_streak

            # Check if already notified for this milestone
            already_notified = Notification.objects.filter(
                user=user,
                notification_type='milestone',
                title__contains=f'{streak} дней',
            ).exists()

            if already_notified:
                continue

            # Create notification
            Notification.objects.create(
                user=user,
                title=MILESTONE_TITLES[streak],
                message=MILESTONE_MESSAGES[streak],
                notification_type='milestone',
                link='/dashboard',
            )

            # Award XP
            xp = XP_REWARDS.get(streak, 0)
            if xp:
                profile = user.profile
                profile.add_experience(xp)

            # Award badge for major milestones
            if streak in BADGE_MILESTONES:
                badge_info = BADGE_MILESTONES[streak]
                UserBadge.objects.get_or_create(
                    user=user,
                    name=badge_info['name'],
                    defaults={
                        'description': badge_info['desc'],
                        'icon': badge_info['icon'],
                    }
                )

            count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Отправлено {count} уведомлений о streak-майлстоунах'
        ))
