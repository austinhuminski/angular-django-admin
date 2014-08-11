// This direcitve figures out which fields are editable and make them so.
app.directive('editable', function($compile, $parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            if (!attrs.name){
               field = scope.$eval(attrs.field)
               pk = attrs.pk

               element.attr('name', field.name)
               element.attr('type', field.type)

               if (field.required){
                   element.attr('required', true)
                }

               element.removeAttr('editable')
               element.removeAttr('field')

             //   scope.$watch(function() {return element.attr('class');},
             //
             //     function(newVal, oldVal){
             //        if (newVal != oldVal)
             //        {
             //            newClasses = newVal.split(' ');
             //            oldClasses = oldVal.split(' ');
             //            if (newClasses.indexOf('ng-dirty') > -1 && oldClasses.indexOf('ng-dirty') == -1)
             //            {
             //                scope.adminObjectsForm[pk][field.name].$setViewValue(
             //                    scope.adminObjectsForm[pk][field.name].$viewValue
             //                )
             //            }
             //        }
             //     }
             // )
               // $compile(element)(scope)
           };
        },
    }
})

app.directive('objectForm', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs)
            {
                scope.$watch(function(){ return element.attr('class');},

                function(newValue, oldValue)
                   {
                    if (newValue != oldValue)
                    {
                        newClasses = newValue.split(' ')
                        oldClasses = oldValue.split(' ')
                        if (newClasses.indexOf('ng-dirty') > -1 && oldClasses.indexOf('ng-dirty') == -1)
                        {
                            t = scope.adminObjectsForm
                            pk = attrs.pk
                            scope.changedForms.push(pk);
                        }
                    }
                   })
           }
   }

})



