from rest_framework import serializers


class MySerializer(serializers.Serializer):
    data_file = serializers.FileField()
