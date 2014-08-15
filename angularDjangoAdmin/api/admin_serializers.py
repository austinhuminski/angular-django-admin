from rest_framework import serializers

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

    def get_identity(self, data):
        """
        This hook is required for bulk update.
        We need to override the default, to use the pk as the identity.

        Note that the data has not yet been validated at this point,
        so we need to deal gracefully with incorrect datatypes.
        """
        try:
            return int(data.get('pk', None))
        except AttributeError:
            return None


