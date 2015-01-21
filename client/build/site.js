"use strict";

// create app
var app = angular.module("my-site", ["ngRoute"]);

// app configuration
app.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider){
  $locationProvider.html5Mode(true);

  // routing
  $routeProvider
    .when("/", {
      templateUrl : "/static/templates/about.html",
    })
    .when("/contact/", {
      template : "Contact"
    })
    .when("/résumé/", {
      template : "Résumé"
    })
    .when("/resume/", {
      redirectTo : "/résumé/"
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

  var reqAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    function( callback ){
      window.setTimeout(callback, 1000 / 60);
    };
  })();

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

    reqAnimFrame(createHands);

    function Hand (name, dateValue, totalValue) {
      this.type = name;
      this.rotation = (dateValue * 360) / totalValue;
      this.transform = "rotate(" + this.rotation + "deg)";
    }
  }
}]);

app.controller("HeaderController", ["$scope", "$location", "$rootScope", function ($scope, $location, $rootScope) {
  $scope.pageButtons = [
    new PageButton("About", "/"),
    new PageButton("Contact", "/contact/"),
    new PageButton("Résumé", "/résumé/"),
  ];

  $scope.socialButtons = [
    new SocialButton("github.svg", "https://github.com/nbreaton/"),
  ];

  $scope.title = "Hi, I'm Nick Breaton.";
  $scope.positition = "Front End Developer"
  $scope.subtitle = "This is how I spend my time.";

  function activateCurrentLink () {
    $rootScope.htmlTitle = "Nick Breaton";

    for (var i = 0; i < $scope.pageButtons.length; i++) {
      var button = $scope.pageButtons[i];
      if (button.link == $location.path()) {
        $scope.pageButtons[i].active = true;
        $rootScope.htmlTitle = button.name + " | " + $rootScope.htmlTitle;
      } else {
        $scope.pageButtons[i].active = false;
      }
    }

  }

  activateCurrentLink();

  $scope.$on('$routeChangeStart', activateCurrentLink);

  function PageButton (name, link) {
    this.active = false;
    this.name = name;
    this.link = link;
  }

  function SocialButton (resourceLink, pageLink) {
    var location = "/static/img/icons/";
    this.image = location + resourceLink;
    this.cssImage = "url('" + this.image + "')";
    this.link = pageLink;
  }
}]);
