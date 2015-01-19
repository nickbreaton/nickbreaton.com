"use strict";

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
  createIntervals();
  createHands();

  function createIntervals () {
    $scope.intervals = [];

    for (var i = 1; i <= 60; i++) {
      var size = "normal";

      if (i % 5 === 0) {
        size = "medium";
      }

      if (i % 15 === 0) {
        size = "large";
      }

      var rotation = (i * 360) / 60;

      $scope.intervals.push({
        id : i,
        type : size,
        rotation : rotation,
        transform : "rotate(" + rotation + "deg)"
      });
    }
  }

  function createHands () {
    var date = new Date();

    var currentHour = date.getHours();

    if (currentHour == 0) {
      currentHour = 12;
    }

    if (currentHour > 12) {
      currentHour -= 12;
    }

    $scope.hands = [
      new Hand("hour", (currentHour * 60) + date.getMinutes(), 720),
      new Hand("minute", (date.getMinutes() * 60) + date.getSeconds(), 3600),
      new Hand("second", date.getSeconds(), 60),
      new Hand("second-base", date.getSeconds(), 60),
    ];

    if(!$scope.$$phase) {
      $scope.$apply();
    }

    setTimeout(createHands, 1000 / 60);

    function Hand (name, dateValue, totalValue) {
      this.type = name;
      this.rotation = (dateValue * 360) / totalValue;
      this.transform = "rotate(" + this.rotation + "deg)";
    }
  }
}]);
