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
app.run(['$route', "$rootScope", function($route, $rootScope)  {
  $route.reload();
  
  $rootScope.template = function (name) {
    return "/static/templates/" + name + ".html";
  }
}]);

app.controller("ClockController", ["$scope", function ($scope) {
  createIntervals($scope);


  function createIntervals ($scope) {
    $scope.intervals = [];

    for (var i = 1; i <= 60; i++) {
      var size = "normal";

      if (i % 5 === 0) {
        size = "medium";
      }

      if (i % 15 === 0) {
        size = "large";
      }

      $scope.intervals.push({
        id : i,
        type : size
      });
    }
  }

}]);
