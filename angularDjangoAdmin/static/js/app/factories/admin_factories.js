app.factory('appDetails', function ($http) {
    data = {content: null}
    var dataFactory = {};
    dataFactory.getDetails = function(){
        return $http.get('/api/admin/');
    }

    return dataFactory

});

app.factory('modelDetails', function($http, $q, $location){
    data = {content: null}
    begin = null;
    end = null;
    var dataFactory = {}
    dataFactory.getObjects = function (app, model, page){
        var deferred = $q.defer()

        filter_params =  window.location.search

        $http.get('api/admin/' + app + '/' + model + '/' + filter_params)
            .success(function(result) {
                deferred.resolve(result);
            });
        return  deferred.promise
    };
    dataFactory.editable_fields =  function (editable_fields, list_display) {
        indexes = {}

        angular.forEach(editable_fields, function (field){
            indexes[list_display.indexOf(field.field).toString()] = {
                'type': field.type,
                'required': field.required,
                'name': field.field
            }
        })

        return indexes
    }

    return dataFactory
});


// Figure out the date mode to display either years, months, or days for date hierarchy
app.service('dateMode', function() {
    this.setDateMode = function (date_hierarchy) {
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        data = {}

        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');

            if (hashes[i].indexOf('__') > -1)
            {
                // vars.push(hash[0].substring(hash[0].lastIndexOf('__') + 2, hash[0].length));
                vars.push(hash[0]);
                vars[hash[0].substring(hash[0].lastIndexOf('__') + 2, hash[0].length)] = hash[1]
            }
            // vars[hash[0]] = hash[1];
        }


        testing = date_hierarchy
        if (vars['day'])
        {
            data['dateMode'] = 'day';
            // data['day'] = date_hierarchy.years[vars['year']][vars['month'] -1 ].days[vars['day'] - 1]

            days = date_hierarchy.years[vars['year']][vars['month'] - 1].days
            data['month'] = date_hierarchy.years[vars['year']][vars['month'] - 1]

            for(i=0; i<days.length; i++)
            {
                if( days[i].number == vars['day']){
                   data['day'] = days[i]
                   break;
                }
            };

        }
        else if (vars['month'])
        {
            data['dateMode'] = 'days';
            data['dateBreakdown'] = date_hierarchy.years[vars['year']][vars['month'] - 1].days
            data['year'] = vars['year']

        }
        else if (vars['year'])
        {
            data['dateMode'] = 'months';
            data['dateBreakdown'] = date_hierarchy.years[vars['year']]
        }

        return data
    }
});
