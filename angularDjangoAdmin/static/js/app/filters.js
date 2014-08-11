app.filter('unsafe', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    }
});

app.filter('strip', function () {
    return function (value) {
        return (!value) ? '' : value.replace(/ /g, '');
    };
});
