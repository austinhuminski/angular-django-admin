from rest_framework import serializers

from bbbsliny.donate.models import PickupSchedule


class PickupScheduleSerializer(serializers.ModelSerializer):

    class Meta:
        model = PickupSchedule
