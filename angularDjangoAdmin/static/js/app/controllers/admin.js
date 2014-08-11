app.controller('adminHomeController', [
    '$scope', '$http', 'appDetails',
    function adminController($scope, $http, appDetails) {
        $scope.model = 'GET MONEY';
        appDetails.getDetails()
            .success(function (data){
                $scope.app_details = data;
            });

    }
]);

app.controller('adminChangeFormController', [
    '$scope', '$http', 'appDetails',
    function adminChangeFormController($scope, $http, appDetails) {

    }
]);

app.controller('adminModelController', [
    '$scope', '$http', '$stateParams', 'modelDetails', '$q', '$location', '$rootScope', 'dateMode', '$parse',
    function adminController($scope, $http, $stateParams, modelDetails, $q, $location, $rootScope, dateMode, $parse) {

        $scope.filteredTodos = []
        $scope.currentPage = $stateParams.p
        // $scope.numPerPage = 10
        model = $stateParams.model;
        app = $stateParams.app
        $scope.model = model;
        $scope.app = app;
        $scope.changedForms = []

        // Reorder objects attributes so that that the table works.
        // Should put this as a service/factory.
        function convertObjects(objects, list){
            blank = []
            for(var i=0; i<objects.length; i++)
            {
                obj = []
                object = objects[i]
                obj['pk'] = object.pk

                for (var j=0; j<list.length; j ++)
                {
                    obj.push(object[list[j]])
                };
                blank.push(obj)
            };


            return blank
        }


        $scope.loadObjects = function () {
            modelDetails.getObjects(app, model)
            .then(function (data){
                console.log(data)
                $scope.headers = data.headers;
                $scope.admin_attrs = data.admin_attrs;
                list_display = data.admin_attrs.list_display
                $scope.maxSize = 20;

                // $scope.objects = data.objects
                $scope.objects = convertObjects(data.objects, list_display)
                $scope.numPerPage = data.admin_attrs.list_per_page
                $scope.currentPage = $stateParams.p
                $scope.object_count= data.object_count;
                $scope.numPages = Math.ceil(data.object_count / $scope.admin_attrs.list_per_page);

                date_hierarchy = $scope.admin_attrs.date_hierarchy

                $scope.list_editable_indexes = modelDetails.editable_fields($scope.admin_attrs.list_editable, list_display)
                $scope.indexes = Object.keys($scope.list_editable_indexes)

                $scope.objects_length = data.objects_length
                if (window.location.search.length > 7){
                    data = dateMode.setDateMode(date_hierarchy);

                    $scope.dateMode = data.dateMode
                    hierarchy = $parse(data.dateMode)
                    hierarchy.assign($scope, data.dateBreakdown)

                    $scope.year = data.year
                    $scope.month = data.month
                    $scope.day = data.day

                }

            })
            .then(function (data){

                $scope.$watch('currentPage + numPerPage', function(oldVal, newVal) {
                    if(oldVal != newVal){
                        $location.search('p', $scope.currentPage)
                    }
               });
            })
        }

        $scope.loadObjects()


         $scope.$on('$locationChangeSuccess', function(event) {
            // $scope.currentPage = $location.search().p

            modelDetails.getObjects(app, model)
                .then( function (data) {
                    $scope.objects = convertObjects(data.objects, list_display)
                    $scope.objects_length = data.objects_length
                    // $scope.numPerPage = data.admin_attrs.list_per_page
                    // $scope.currentPage = $stateParams.p
                    $scope.object_count= data.object_count;
                    $scope.numPages = Math.ceil(data.object_count / $scope.numPerPage);
                });
        });


        $scope.filterObjects = function(filter, option) {
            option = option ==  "" ? null : option

            if (typeof option == "object" && option != null)
            {
                $location.search(filter[0], option[0])
                $location.search(filter[1], option[1])
            }
            else if(option == null){
                angular.forEach($location.search(), function(value, filter_by) {

                    if (filter_by.lastIndexOf(filter, 0) === 0){
                        $location.search(filter_by, null);
                        $location.search('p', 1);
                    }
                })
                // $location.search(filter, null);
            }
            else{
                $location.search('p', 1);
                $location.search(filter, option);
            };
        };

        $scope.dateMode = 'year';
        $scope.months = ""
        $scope.day = ""

        $scope.showMonths= function(year) {
            $scope.months = $scope.admin_attrs.date_hierarchy.years[year]
            $scope.dateMode = "months"
        }

        $scope.showDays = function(month) {
            $scope.year = month.year
            $scope.month = month
            angular.forEach($scope.admin_attrs.date_hierarchy.years[month.year], function(year_month) {
                if (month.number == year_month.number){
                    $scope.days = year_month.days
                    $scope.dateMode = "days"
                }
            });
        };

        $scope.showDay = function(day){
            $scope.day = day;
            $scope.dateMode = 'day';
        }


        $scope.updateDateMode = function(mode){
            $scope.dateMode = mode;
        }


        $scope.object= []



        $scope.saveObjects = function(){
            list_editable = []
            angular.forEach($scope.admin_attrs.list_editable, function(field){
                list_editable.push(field.field);
            });

            formData = []
            angular.forEach($scope.changedForms, function(form) {
                edit_field = $scope.adminObjectsForm[form];
                pk = form;
                rowData = {}
                angular.forEach(list_editable, function(editable_field){
                    field = edit_field[editable_field]
                    console.log(field.$name + ': ' + field.$dirty);
                    if (field.$dirty === true){
                        console.log("FIELD IS DIRTY");
                        console.log(field.$name)
                        console.log(field.$modelValue);
                       rowData[field.$name] = field.$modelValue
                    }

                });
                formData.push(rowData);
            })

            console.log(formData);
        }

    }
]);
