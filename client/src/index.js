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
      templateUrl : "/static/templates/contact.html"
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

  // TODO: remove when database is added
  $rootScope.lorem = "Bacon ipsum dolor amet flank cow short ribs salami biltong. Ball tip ham hock porchetta, turkey kielbasa beef boudin tongue. Kevin boudin ball tip, prosciutto tri-tip corned beef andouille. Pancetta ball tip sausage fatback. Ground round short loin turkey swine pork, frankfurter chuck rump beef pastrami. Kevin pig sausage, meatball beef venison capicola brisket ground round tongue leberkas turkey swine shoulder short ribs. Kevin jowl tongue shank spare ribs turducken shoulder short ribs ham hock meatball bacon chicken tail tenderloin biltong. Pork loin ribeye pork chop shank capicola cupim. Tenderloin doner pork chop corned beef, picanha filet mignon short loin prosciutto hamburger boudin drumstick turkey chicken bresaola. Ground round brisket hamburger shoulder, corned beef spare ribs beef ribs sirloin short loin ham hock tongue chuck jowl. Pork belly jerky bresaola prosciutto ribeye capicola doner cow landjaeger ground round cupim turkey tenderloin. Jowl rump fatback, tail tenderloin drumstick boudin frankfurter sausage capicola pancetta pork loin. Bacon filet mignon pork loin short ribs, hamburger shoulder beef ribs tenderloin sirloin ribeye pancetta."
}]);
