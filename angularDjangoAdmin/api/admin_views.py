import importlib

from datetime import date, timedelta

from django.db.models import get_model, get_models, get_app

from rest_framework.views import APIView
from rest_framework.response import Response

# Make sure to add PROJECT_NAME into your settings file
from angularDjangoAdmin.settings.base import INSTALLED_APPS, PROJECT_NAME

# Import all the serializers you would want for your project
from angularDjangoAdmin.api.admin_serializers import DonorSerializer

# Add apps you want to show up in admin to this list.
allowed_apps = []

serializer_classes = {
    'DonorSerializer': DonorSerializer,
}

QUERY_DATE = "%Y-%m-%d"


class AppDetail(APIView):
    def get(self, request):

        # Get only apps from within your project. You might have to change
        # your INSTALLED_APPS variable to make this work correctly.
        # ProjectName.modelName: "angularDjangoAdmin.model"
        applications = [
            app.split('.')[1] for app in INSTALLED_APPS
            if app.startswith(PROJECT_NAME)
            and app.split('.')[1] in allowed_apps
        ]

        # Get a dictionary of every app I want to show in admin and a list
        # of all their models.
        app_details = {
            application.title(): sorted({
                'name': model.__name__,
                'verbose': model._meta.verbose_name_plural.title(),
            } for model in get_models(get_app(application)))
            for application in applications
        }

        return Response(app_details)


class ModelList(APIView):

    def get(self, request, app, model):
        data = {}

        MODEL = get_model(str(app), str(model))
        model_admin_string = '{0}Admin'.format(MODEL._meta.object_name)

        try:
            admin_module = getattr(
                importlib.import_module(
                    '{0}.{1}.admin'.format(PROJECT_NAME, app)
                ),
                model_admin_string
            )

            admin_info_attrs = [
                'search_fields',
                'list_display',
                'list_editable',
                'date_hierarchy',
                'list_per_page',
                'list_filter',
            ]
            admin_attrs = {
                field: getattr(
                    admin_module, field
                ) for field in admin_info_attrs
            }

            # CREATE DATE HIERARCHY
            hierarchy = {}
            if admin_attrs['date_hierarchy']:
                date_hierarchy = admin_attrs['date_hierarchy']
                hierarchy = {
                    'field': date_hierarchy,
                    'years': {}
                }
                for day in MODEL.objects.dates(date_hierarchy, 'day'):

                    # Check if year is in dict already
                    if hierarchy['years'].get(day.year, None):

                        # Does month exist yet?
                        month_found = False
                        for month in hierarchy['years'][day.year]:
                            if day.month == month['number']:
                                month_found = True
                                month['days'].append({
                                    'display': day.strftime("%B %d"),
                                    'number': day.day
                                })

                        if not month_found:
                            hierarchy['years'][day.year].append({
                                'display': day.strftime("%B %Y"),
                                'number': day.month,
                                'days': [{
                                    'display': day.strftime("%B %d"),
                                    'number': day.day
                                }],
                                'year': day.year
                            })

                    # Adding new year
                    else:
                        hierarchy['years'][day.year] = [
                            {
                                'display': day.strftime("%B %Y"),
                                'number': day.month,
                                'days': [{
                                    'display': day.strftime("%B %d"),
                                    'number': day.day
                                }],
                                'year': day.year
                            }
                        ]

                admin_attrs['date_hierarchy'] = hierarchy

            # CREATE FILTERS
            filters = {}
            for filter_option in admin_attrs['list_filter']:

                model_field = MODEL._meta.get_field(filter_option)
                filter_type = model_field.__class__.__name__
                filters[filter_option] = {
                    'label': filter_option.title().replace('_', ' ')
                }

                if model_field.choices:
                    filters[filter_option].update({
                        'field_type': 'CharField',
                        'values': dict(model_field.choices).values()
                    })

                elif filter_type == 'BooleanField':
                    filters[filter_option].update({
                        'field_type': 'BooleanField',
                        'values': [
                            {'value': True, 'display': 'Yes'},
                            {'value': False, 'display': 'No'},
                            {'value': None, 'display': 'All'}
                        ]
                    })

                elif filter_type == 'CharField':
                    filters[filter_option].update({
                        'field_type': 'CharField',
                        'values': [
                            item for item
                            in MODEL.objects.values_list(
                                str(filter_option), flat=True
                            ).order_by(str(filter_option)).distinct()
                        ]
                    })

                elif filter_type == 'NullBooleanField':
                    filters[filter_option].update({
                        'field_type': 'BooleanField',
                        'values': [
                            {'value': True, 'display': 'Yes'},
                            {'value': False, 'display': 'No'},
                            {'value': False, 'display': 'Unknown'},
                            {'value': None, 'display': 'All'}
                        ]
                    })

                elif filter_type == 'DateField':
                    today = date.today()
                    filters[filter_option].update({
                        'field_type': 'DateField',
                        'date_range': {
                            'today': today.strftime(QUERY_DATE),
                            'tomorrow': (
                                today + timedelta(1)
                            ).strftime(QUERY_DATE),
                            'past_seven': (
                                today - timedelta(7)
                            ).strftime(QUERY_DATE),
                            'first_of_month': date(
                                today.year, today.month, 1
                            ).strftime(QUERY_DATE),
                            'first_of_year': date(
                                today.year, 1, 1
                            ).strftime(QUERY_DATE)
                        },
                        'values': [
                            'Any Date',
                            'Today',
                            'Past 7 Days',
                            'This month',
                            'This Year'
                        ]
                    })
            admin_attrs['list_filter'] = filters

            if admin_attrs['list_display'][0] == '__str__':
                admin_attrs[
                    'list_display'
                ] = [
                    field.name for field in MODEL._meta.fields
                    if field.name != 'id'
                ]

            data['headers'] = [
                field.title().replace('_', ' ') for field
                in admin_attrs['list_display']
            ]

            def get_type(field_type, field_name):

                if field_name == 'phone':
                    return 'phone'

                if field_type in [
                    "IntegerField",
                    "DecimalField",
                    "CharField",
                    "TextField",
                ]:
                    return 'text'
                else:
                    return 'checkbox'

            admin_attrs['list_editable'] = [
                {
                    'field': field,
                    'type': get_type(
                        MODEL._meta.get_field(field).get_internal_type(),
                        field
                    ),
                    'required': True if not MODEL._meta.get_field(
                        field
                    ).blank else False
                }
                for field in admin_attrs['list_editable']
            ]

        except AttributeError:
            '''
            There is not custom admin class
            '''
            fields = [
                field.name for field in
                MODEL._meta.fields if field.name != 'id'
            ]

            # Default items per page to 100
            admin_attrs = {'list_per_page': 100}
            admin_attrs['list_display'] = fields

            data['headers'] = [
                field.title().replace('_', '') for field in fields
            ]

        data['admin_attrs'] = admin_attrs

        # Monitor page number in URL
        GET = dict(request.GET.copy())
        page = GET.pop('p')[0] if GET.get('p') else 1

        per_page = data['admin_attrs']['list_per_page']

        # Get range of objects you will be displaying
        begin = (int(page) - 1) * per_page
        end = begin + per_page

        # Grab the other parameters in the URL to filter objects
        GET = {filter_by: value for filter_by, value in GET.items()}
        for key, value in GET.items():
            if value == ['True']:
                GET[key] = True
            elif value == ['False']:
                GET[key] = False
            else:
                GET[key] = value[0]

        objects = MODEL.objects.filter(**GET)[begin:end]

        serializer = serializer_classes[MODEL._meta.object_name](
            objects, fields=admin_attrs['list_display']
        )

        data['objects'] = serializer.data
        data['object_count'] = MODEL.objects.filter(**GET).count()
        return Response(data)


class ModelFormset(generics.UpdateAPIView):
    '''
    We're going to use this to update and of the list_editable fields
    '''

    def put(self, request, app, model, *args, **kwargs):

        MODEL = get_model(str(app), str(model))
        data = request.DATA

        # Find out if we are updating more then one object.
        many = True if len(data) > 1 else False
        if not many:
            data = data[0]
            queryset = MODEL.objects.get(pk=data['pk'])
        else:
            objects = [object['pk'] for object in data]
            queryset = MODEL.objects.filter(pk__in=objects)

        serializer = serializer_classes[MODEL._meta.object_name](
            queryset,
            data=data,
            partial=True,
            many=many
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(
                serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

