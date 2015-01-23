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

app.controller("BlogController", ["$scope", function ($scope) {
  $scope.date = new Date()

  $scope.lorem = "Contrary to poular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, Lorem ipsum dolor sit amet.., comes from a line in section 1.10.32. The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Finibus Bonorum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.";
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

app.controller("HeaderController", ["$scope", "$location", "$rootScope", "SiteInfo", function ($scope, $location, $rootScope, SiteInfo) {
  $scope.pageButtons = [
    new PageButton("About", "/"),
    new PageButton("Contact", "/contact/"),
    new PageButton("Skills", "/skills/"),
    new PageButton("Hire", "/hire/"),
    new PageButton("Blog", "/blog/"),
  ];

  $scope.socialButtons = [
    new SocialButton("github.svg", "https://github.com/nbreaton/"),
  ];

  $scope.title = SiteInfo.nameIntro + " " + SiteInfo.name;
  $scope.positition = SiteInfo.jobTitle;
  $scope.subtitle = SiteInfo.moto;

  function activateCurrentLink () {
    $rootScope.htmlTitle = SiteInfo.name;

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

app.factory("SiteInfo", function () {
  this.firstName = "Nick";
  this.lastName = "Breaton";
  this.name = this.firstName + " " + this.lastName;
  this.nameIntro = "Hi, I'm";
  this.moto = "This is how I spend my time."
  this.jobTitle = "Front End Developer";

  return this;
});
