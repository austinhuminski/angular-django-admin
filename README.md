angular-django-admin
====================

Replication of the Django Admin functionality in Angularjs.

This is using Django Rest Framework for the API in the backend. 

You will be able to keep all your admin.py files in all of your models
the same. You should remove registration of these classes however since 
Django will not be managing them the same way.

As of right now I have date hierarchy, list_editable, and filtering working on the changelist form.

In progress to make the changelist form submitable after edits made to list_editable fields. More help the better.


```static/app.js``` contains routing via ui-router to the three main django admin pages.
```javascript
$stateProvider                                                         
   .state('admin', {                                                   
        url:'/admin/',                                                 
        controller: 'adminHomeController',                             
        templateUrl: STATIC_URL + "templates/admin/home.html"          
    })                                                                 
    .state('modelDetail', {                                            
        url:'/admin/:app/:model/?p',                                   
        controller: 'adminModelController',                            
        templateUrl: STATIC_URL + "templates/admin/model.html",        
        reloadOnSearch: false,                                         
    })                                                                 
    .state('modelChangeForm', {                                        
        url:'/admin/:app/:model/:pk',                                  
        controller: 'adminChangeFormController',                       
        templateUrl: STATIC_URL + "templates/admin/change_form.html",  
    })                                                                 
```                                                                       
                                                                       

```STATIC_URL``` is generated from within templates/base.html and helps serve the HTML views for angularjs.



#### api/admin_views.py

Within ```api/admin_views.py``` there is a serializer_classes variable where you will need to add serializer classes as well as import them.

```python
from project.model.serializers import FooSerializer

serializer_classes = {
    'FooSerializer': FooSerializer
}
```

You will need to decalre which apps you want to be displayed by admin by declaring their string name 
within the ```allowed_apps``` list

```python
allowed_apps = ["fooApp", "barApp"]
```

That should be all you need to do to setup. The rest will go into your admin.py files and figure out how to display your objects. If not custom admin class is given for a model it falls back to some default configurations. 
