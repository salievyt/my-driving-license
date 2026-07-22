from django.core.management.base import BaseCommand
from django.utils import timezone
from django.db.models import Sum
from django.contrib.auth import get_user_model
from apps.notifications.models import Notification
from apps.progress.models import StudySession

User = get_user_model()


class Command(BaseCommand):
    help = 'Отправляет еженедельную сводку о прогрессе'

    def handle(self, *args, **options):
        today = timezone.now().date()
        week_ago = today - timezone.timedelta(days=7)

        users = User.objects.filter(is_active=True)
        count = 0

        for user in users:
            # Skip if already sent this week
            already_sent = Notification.objects.filter(
                user=user,
                notification_type='weekly',
                created_at__date__gte=week_ago,
            ).exists()

            if already_sent:
                continue

            # Calculate weekly stats
            weekly_sessions = StudySession.objects.filter(
                user=user,
                date__gte=week_ago,
            )

            total_minutes = weekly_sessions.aggregate(
                total=Sum('duration_minutes')
            )['total'] or 0

            total_tests = weekly_sessions.aggregate(
                total=Sum('quizzes_completed')
            )['total'] or 0

            total_lessons = weekly_sessions.aggregate(
                total=Sum('lessons_completed')
            )['total'] or 0

            total_xp = weekly_sessions.aggregate(
                total=Sum('points_earned')
            )['total'] or 0

            days_active = weekly_sessions.values('date').distinct().count()

            # Only send if user was active this week
            if total_minutes == 0:
                Notification.objects.create(
                    user=user,
                    title='📊 Начни новую неделю!',
                    message='На прошлой неделе не было занятий. Пора начинать! Всего 5 минут в день — и ты сдашь экзамен.',
                    notification_type='weekly',
                    link='/dashboard',
                )
                count += 1
                continue

            goal_minutes = user.profile.study_goal_minutes or 15
            target_minutes = goal_minutes * 7
            percentage = min(100, round((total_minutes / target_minutes) * 100))

            if percentage >= 80:
                mood = '🔥 Отличная неделя!'
                message = (
                    f'Ты позанимался {total_minutes} минут (выполнено на {percentage}% от плана). '
                    f'{total_lessons} уроков, {total_tests} тестов, {days_active} дней активности. '
                    f'Заработано {total_xp} XP. Так держать!'
                )
            elif percentage >= 50:
                mood = '💪 Хороший прогресс'
                message = (
                    f'За неделю: {total_minutes} минут занятий ({percentage}% от цели). '
                    f'{total_lessons} уроков, {total_tests} тестов. '
                    f'Есть куда стремиться — в следующей неделе догоним!'
                )
            else:
                mood = '🎯 Нужно больше практики'
                message = (
                    f'На этой неделе: {total_minutes} минут ({percentage}% от плана). '
                    f'Попробуй уделять учёбе по {goal_minutes} минут каждый день — '
                    f'и результат не заставит себя ждать!'
                )

            Notification.objects.create(
                user=user,
                title=mood,
                message=message,
                notification_type='weekly',
                link='/dashboard',
            )

            count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Отправлено {count} еженедельных сводок'
        ))
