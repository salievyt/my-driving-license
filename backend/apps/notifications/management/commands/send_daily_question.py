import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.notifications.models import Notification
from apps.quizzes.models import Question

User = get_user_model()


class Command(BaseCommand):
    help = 'Отправляет всем пользователям уведомление с вопросом дня'

    def handle(self, *args, **options):
        today = timezone.now().date()

        # Get a random question for today
        questions = Question.objects.filter(is_active=True)
        if not questions.exists():
            self.stdout.write(self.style.WARNING('Нет активных вопросов'))
            return

        # Deterministic selection based on date for consistency
        day_of_year = today.timetuple().tm_yday
        question_count = questions.count()
        random.seed(day_of_year)
        question = questions[random.randint(0, question_count - 1)]
        random.seed()  # Reset seed

        # Send to all active users who haven't received today's question
        users = User.objects.filter(is_active=True)

        count = 0
        for user in users:
            # Skip if already sent today
            already_sent = Notification.objects.filter(
                user=user,
                notification_type='daily_question',
                created_at__date=today,
            ).exists()

            if already_sent:
                continue

            Notification.objects.create(
                user=user,
                title='❓ Вопрос дня',
                message=f'Проверь себя: "{question.text}"',
                notification_type='daily_question',
                link=f'/daily-question/{question.id}',
            )

            count += 1

        self.stdout.write(self.style.SUCCESS(
            f'Вопрос дня отправлен {count} пользователям'
        ))
