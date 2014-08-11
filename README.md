angular-django-admin
====================

Replication of the Django Admin functionality in Angularjs.

This is using Django Rest Framework for the API in the backend. 

You will be able to keep all your admin.py files in all of your models
the same. You should remove registration of these classes however since 
Django will not be managing them the same way.

As of right now I have date hierarchy, list_editable, and filtering working on the changelist form.

In progress to make the changelist form submitable after edits made to list_editable fields.


