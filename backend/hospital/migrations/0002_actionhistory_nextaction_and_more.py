# Generated by Django 5.0.2 on 2024-04-09 00:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hospital', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='actionhistory',
            name='nextAction',
            field=models.CharField(default='-', max_length=10000),
        ),
        migrations.AlterField(
            model_name='actionhistory',
            name='observation',
            field=models.CharField(max_length=1000),
        ),
    ]
