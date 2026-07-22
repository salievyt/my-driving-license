from celery import shared_task
from django.core.management import call_command
from django.utils import timezone


@shared_task
def send_daily_question_task():
    """Send the daily question to all active users (runs daily at 09:00)."""
    call_command('send_daily_question')
    return 'Daily question sent'


@shared_task
def send_reminders_task():
    """Send study reminders to inactive users (runs at 18:00 and 20:00)."""
    call_command('send_reminders')
    return 'Reminders sent'


@shared_task
def check_streaks_task():
    """Check for streak milestones (runs daily at 22:00)."""
    call_command('check_streaks')
    return 'Streaks checked'


@shared_task
def send_weekly_summary_task():
    """Send weekly study summary (runs on Sunday at 20:00)."""
    call_command('send_weekly_summary')
    return 'Weekly summary sent'


@shared_task
def process_study_session(user_id: int, duration_minutes: int, lessons: int, quizzes: int):
    """Process a completed study session and check for achievements."""
    from apps.progress.models import UserProgress, StudySession
    from apps.accounts.models import User, UserBadge

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return 'User not found'

    today = timezone.now().date()

    # Update streak
    progress, _ = UserProgress.objects.get_or_create(user=user)

    if progress.last_study_date == today - timezone.timedelta(days=1):
        progress.current_streak += 1
        if progress.current_streak > progress.longest_streak:
            progress.longest_streak = progress.current_streak
    elif progress.last_study_date != today:
        progress.current_streak = 1

    progress.last_study_date = today
    progress.total_lessons_completed += lessons
    progress.total_quizzes_attempted += quizzes
    progress.total_quizzes_passed += quizzes
    progress.study_hours_total += duration_minutes / 60
    progress.save()

    # XP calculation
    xp = duration_minutes * 5 + lessons * 20 + quizzes * 30
    profile = user.profile
    profile.add_experience(xp)

    # Check for study achievement badges
    _check_study_achievements(user, progress.total_lessons_completed)

    return f'Session processed for {user.username}: +{xp} XP'


def _check_study_achievements(user, total_lessons):
    """Check and award study-related achievements."""
    from apps.accounts.models import UserBadge

    milestones = {
        10: {'name': 'Первые 10 уроков', 'desc': 'Пройди 10 уроков', 'icon': '📚'},
        25: {'name': 'Четверть пути', 'desc': 'Пройди 25 уроков', 'icon': '📖'},
        50: {'name': 'Половина пройдена!', 'desc': 'Пройди 50 уроков', 'icon': '🏅'},
        100: {'name': '100 уроков', 'desc': 'Пройди 100 уроков', 'icon': '🎓'},
    }

    for count, info in milestones.items():
        if total_lessons >= count:
            UserBadge.objects.get_or_create(
                user=user,
                name=info['name'],
                defaults={'description': info['desc'], 'icon': info['icon']},
            )
