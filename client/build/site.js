// create app
var app = angular.module("my-site", ["ngRoute"]);

// app configuration
app.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  // routing
  $routeProvider
    .when("/", {
      template : "Home",
    })
    .when("/about/", {
      template : "About"
    })
    .otherwise({
      template : "404",
    });
}]);

// make sure nested views and includes loads
app.run(['$route', function($route)  {
  $route.reload();
}]);
