(function (ng) {
  'use strict';

  var app = ng.module('ngLoadScript', []);

  app.directive('script', function() {
    return {
      restrict: 'E',
      scope: false,
      link: function(scope, elem, attr)
      {
        if (attr.type==='text/javascript-lazy')
        {

        console.log("************BAZINGA*************");
          var s = document.createElement("script");
          s.type = "text/javascript";
          // var src = elem.attr('ng-src');
          var src = STATIC_URL + 'js/google_maps.js';
          if(src!==undefined)
          {
              s.src = src;
          }
          else
          {
              var code = elem.text();
              s.text = code;
          }
          document.body.appendChild(s);
          elem.remove();
        }
      }
    };
  });

}(angular));
