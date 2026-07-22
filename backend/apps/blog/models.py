from django.db import models
from django.utils.translation import gettext_lazy as _
from ckeditor.fields import RichTextField


class ArticleCategory(models.Model):
    title = models.CharField(_('Название'), max_length=200)
    slug = models.SlugField(max_length=250, unique=True)
    description = models.TextField(_('Описание'), blank=True)
    icon = models.CharField(_('Иконка'), max_length=50, blank=True)
    is_active = models.BooleanField(_('Активна'), default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Категория статей')
        verbose_name_plural = _('Категории статей')
        ordering = ['title']

    def __str__(self):
        return self.title


class Article(models.Model):
    category = models.ForeignKey(
        ArticleCategory, on_delete=models.CASCADE,
        related_name='articles', verbose_name=_('Категория')
    )
    author = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='articles', verbose_name=_('Автор')
    )
    title = models.CharField(_('Заголовок'), max_length=300)
    slug = models.SlugField(max_length=350, unique=True)
    summary = models.TextField(_('Краткое описание'), max_length=500)
    content = RichTextField(_('Содержание'))
    cover_image = models.ImageField(
        _('Обложка'), upload_to='blog/covers/',
        blank=True, null=True
    )
    reading_time_minutes = models.PositiveIntegerField(
        _('Время чтения'), default=5
    )
    is_published = models.BooleanField(_('Опубликована'), default=False)
    views_count = models.PositiveIntegerField(_('Просмотров'), default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Статья')
        verbose_name_plural = _('Статьи')
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ArticleComment(models.Model):
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE,
        related_name='comments', verbose_name=_('Статья')
    )
    author = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE,
        related_name='article_comments'
    )
    text = models.TextField(_('Комментарий'))
    is_approved = models.BooleanField(_('Одобрен'), default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Комментарий')
        verbose_name_plural = _('Комментарии')
        ordering = ['created_at']

    def __str__(self):
        return f'{self.author.username}: {self.text[:50]}...'
