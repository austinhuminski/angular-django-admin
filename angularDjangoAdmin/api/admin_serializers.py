from rest_framework import serializers

from angularDjangoAdmin.app.models import Donor


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """
    A ModelSerializer that takes an additional `fields` argument that
    controls which fields should be displayed.
    """

    pk = serializers.Field()

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields:
            # Drop any fields that are not specified in the `fields` argument.

            allowed = set(fields + ['pk'])
            existing = set(self.fields.keys())

            for field_name in existing - allowed:
                self.fields.pop(field_name)


'''
EXAMPLE USE
---------------------
This would be an example of how to use the DynamicFieldsModelSerializer. If
it sees a fields arg from the serializers Meta class then it will use those
fields. This model does not exist in the project. Add your own serializer
classses here or import DynamicFieldsModelSerializer
'''


class DonorAdminSerializer(DynamicFieldsModelSerializer):

    class Meta:
        model = Donor
        fields = (
            'last_name',
            'address',
            'phone',
            'email',
        )

