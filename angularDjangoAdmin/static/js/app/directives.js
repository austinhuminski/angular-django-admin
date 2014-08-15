// Replaces 'editable' directive. Allows for dynamic name.
app.directive('dynamicName', function($compile, $parse) {
    return {
        restrict: 'A',
        terminal: true,
        priority: 100000,
        link: function(scope, elem) {
          var name = $parse(elem.attr('dynamic-name'))(scope);
          elem.removeAttr('dynamic-name');
          elem.attr('name', name);
          $compile(elem)(scope);
        }
  };
});

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



