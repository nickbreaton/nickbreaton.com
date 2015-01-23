"use strict";

// create app
var app = angular.module("my-site", ["ngRoute"]);

// app configuration
app.config(["$routeProvider", "$locationProvider",  function ($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  // routing
  $routeProvider
    .when("/", {
      templateUrl : "/static/templates/about.html",
    })
    .when("/contact/", {
      template : "Contact"
    })
    .when("/hire/", {
      template : "Hire Me!"
    })
    .when("/blog/", {
      templateUrl : "/static/templates/blog.html"
    })

    // redirects
    .when("/about/", {
      redirectTo : "/"
    })

    // 404
    .otherwise({
      template : "404",
    });
}]);

// make sure nested views and includes loads
app.run(['$route', "$rootScope", function($route, $rootScope)  {
  $route.reload();

  $rootScope.template = function (name) {
    return "/static/templates/" + name + ".html";
  }
}]);
