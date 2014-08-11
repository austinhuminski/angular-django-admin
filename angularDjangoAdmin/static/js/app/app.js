app = angular.module('app', [
    "ngRoute", "ngCookies", "ui.bootstrap", "ngLoadScript", "ui.router"
]);

app.run(function ($http, $cookies, $rootScope, $state) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
    $http.defaults.headers.post['X-CSRFToken'] = $cookies['csrftoken'];
    $rootScope.$state = $state
})


app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

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

});


