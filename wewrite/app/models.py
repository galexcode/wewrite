from django.db import models
from django.contrib.auth.models import User
# Create your models here.
GENRE_CHOICES =  (
    ('Fantasy','Fantasy'),
    ('Historical','Historical'),
    ('Sci-Fi','Sci-Fi'),
)
class Genre(models.Model):
    name = models.CharField(max_length=15, choices=GENRE_CHOICES)

class Piece(models.Model):
    title = models.CharField(max_length=30)
    genre = models.ManyToManyField(Genre)

class UserProfile(models.Model):
    user = models.ForeignKey(User, unique=True)
    genres = models.ManyToManyField(Genre)
    pieces = models.ManyToManyField(Piece)
