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

app.controller("AboutController", function ($scope, $http) {
  // No time = Sloppy code :(

  function url (file) {
    return '/static/content/about/' + file + '.txt';
  }

  $http.get(url('education'))
    .success(function(data) {
      $scope.education = '\n' + data;
    });

  $http.get(url('programming'))
    .success(function(data) {
      $scope.programming = '\n' + data;
    });

  $http.get(url('internship'))
    .success(function(data) {
      $scope.internship = '\n' + data;
    });

  $http.get(url('local'))
    .success(function(data) {
      $scope.local = '\n' + data;
    });
});

app.controller("BlogController", function ($scope) {
  $scope.date = new Date();
});

app.controller("ClockController", function ($scope) {
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

    setTimeout(createHands, 1000);

    function Hand (name, dateValue, totalValue) {
      this.type = name;
      this.rotation = (dateValue * 360) / totalValue;
      this.transform = "rotate(" + this.rotation + "deg)";
    }
  }
});

app.controller("CompatibilityController", function ($scope) {
  $scope.error = "Please update your browser to use this site.";

  var testCanvas = document.createElement("canvas");

  $scope.supported = !((testCanvas.getContext) ? true : false);

});

app.controller("ContactController", function ($scope, $http) {
  $scope.filter = new Filter();
  $scope.submitted = false;
  $scope.message = {
    body : {
      text : "",
      error : false
    }
  };

  $scope.links = [
    new Link("nick@breaton.com", "mailto:nick@breaton.com"),
    new Link("GitHub", "https://github.com/nbreaton"),
    new Link("LinkedIn", "https://www.linkedin.com/in/nbreaton"),
    new Link("Twitter", "https://twitter.com/nicholasbreaton", true)
  ]

  $scope.inputs = [
    new Input("name", "text", "What is your name?"),
    new Input("email", "email", "Where can I email you back?"),
    new Input("subject", "text", "What is this about?"),
    new Input("filter", "number", $scope.filter.one + " + " + $scope.filter.two + " =")
  ]

  // fix placeholder issue in IE9
  setTimeout(function ( ){
    var inputEls = document.getElementsByTagName('input');


    for (var i = 0; i < inputEls.length; i++) {
      inputEls[i].onblur = check;
    }

    check();

    function check () {
      for (var i = 0; i < inputEls.length; i++) {
        var el = inputEls[i];
        if (el && !el.placeholder && el.value == "") {
          el.value = $scope.inputs[i].placeholder;
        }
      }
    }
  });

  // make textarea expand to content
  $scope.$watch("message.body", function () {
    var el = document.getElementById("contact-textarea");

    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  });

  // remove error on type on text area
  $scope.message.body.removeError = function () {
    $scope.bodyFocus = false;
    $scope.message.body.error = false;
  }

  $scope.submit = function () {
    // regex for email validation: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/g

    // clear errors from past fails
    $scope.message["name"].error = false;
    $scope.message["subject"].error = false;
    $scope.message["body"].error = false;

    // check all blank feilds besides body
    wsCheck("name");
    wsCheck("subject");
    wsCheck("body");

    // check human life
    if ($scope.filter.one + $scope.filter.two != $scope.message.filter.text) {
      $scope.message.filter.error = true;
    }

    // check valid email
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test($scope.message.email.text)) {
      $scope.message.email.error = true;
    }

    // don't submit if errors
    for (var id in $scope.message) {
      if ($scope.message[id].error) {
        return;
      }
    }

    // build submission json
    var submit = {
      name : $scope.message.name.text,
      email : $scope.message.email.text,
      subject : $scope.message.subject.text,
      body : $scope.message.body.text
    }

    // send json
    $http.post("/api/contact/", submit)
      .success(function() {
        $scope.submitted = true;
        window.scrollTo(0, 0);
      });
  }

  // check for white space
  function wsCheck (id) {
    var text = $scope.message[id].text;

    if (text == null) {
      text = "";
    }

    if (text == "") {
      $scope.message[id].text = null;
      $scope.message[id].error = true;
    }
  }

  function Filter () {
    this.one = rand();
    this.two = rand();

    this.check = function (input) {
      return (input == this.one + this.two);
    }

    function rand() {
      return Math.floor((Math.random() * 5) + 1);
    }
  }

  function Link(name, href, last) {
    this.name = name;
    this.href = href;
    this.last = last;
  }

  function Input(identifier, type, placeholder) {
    this.class = identifier;
    this.name = identifier;
    this.type = type;
    this.placeholder = placeholder;

    this.getClass = function () {
      var err = "";

      if ($scope.message[this.name].error) {
        err = "error";
      }

      return this.class + " " + err;
    }

    this.removeError = function () {
      $scope.message[this.name].error = false;
    }

    $scope.message[this.name] = {
      text : "",
      error : false
    }
  }

});

app.controller("HeaderController", function ($scope, $location, $rootScope, SiteInfo) {
  $scope.pageButtons = [
    new PageButton("About", "/"),
    // new PageButton("Skills", "/skills/"),
    // new PageButton("Portfolio", "/portfolio/"),
    // new PageButton("Hire", "/hire/"),
    new PageButton("Contact", "/contact/"),
    // new PageButton("Blog", "/blog/"),
  ];

  $scope.socialButtons = [
    new SocialButton("github.svg", "https://github.com/nbreaton/"),
  ];

  $scope.title = SiteInfo.nameIntro + " " + SiteInfo.name;
  $scope.positition = SiteInfo.jobTitle;
  $scope.subtitle = SiteInfo.moto;


  $scope.toggleDrop = function () {
    $scope.dropActive = !$scope.dropActive;

  }

  $scope.dropActive = false;

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
});

app.controller("MapController", function ($scope, $rootScope, $window, MapStyle) {
  map();
  pin();

  function pin () {
    setTimeout(function () {
      watch();
      angular.element($window).bind('scroll', watch);
      angular.element(document).bind('resize', watch);
    }, 1000);

    function watch() {
      var mapEl = document.getElementById("map-frame");
      var pinEl = document.getElementById("map-pin")

      // doesnt throw errors on other pages if still listening
      if (mapEl && pinEl) {
        var map = mapEl.getBoundingClientRect();
        var pin = pinEl.getBoundingClientRect();

        if (map.bottom * .85 < window.innerHeight) {
          $scope.pinActive = true;
          $scope.$apply();
        }

        if (pin.top > window.innerHeight) {
          $scope.pinActive = false;
          $scope.$apply();
        }
      }
    }
  }


  function map() {
    var canvas;
    var parent;

    $rootScope.mapWidth = undefined;

    if (google.maps.event) {
      // run when page resizes
      google.maps.event.addDomListener(window, "resize", go);

      // make sure event runs every time controller is activated
      go();
    }

    function go () {
      canvas = document.getElementById("map-canvas");

      if (canvas) {
        parent = canvas.parentNode;

        if ($rootScope.mapWidth != parent.getBoundingClientRect().width) {
          create();
          $rootScope.mapWidth = parent.getBoundingClientRect().width;
        }
      }
    }

    function create () {
      if (google) {
        var style = MapStyle("#7c9b8b");

        var letters = "ABCDEFGHIJKLMNOPQRSTUV";
        var randId = "";

        for (var i = 0; i < 10; i++) {
          randId += letters[Math.floor(Math.random() * letters.length)];
        }

        var mapOptions = {
          zoom: 13,
          center: new google.maps.LatLng(35.7303443,-78.8500691),
          mapTypeId : randId
        };

        var map = new google.maps.Map(canvas, mapOptions);

        var customMapType = new google.maps.StyledMapType(style, {name: "Custom Style"});

        map.mapTypes.set(randId, customMapType);
      }
    }
  }
});

app.constant("MapStyle", function (color) {
 return [{"featureType":"all","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":color},{"visibility":"on"}]}];
});

app.factory("SiteInfo", function () {
  this.firstName = "Nick";
  this.lastName = "Breaton";
  this.name = this.firstName + " " + this.lastName;
  this.nameIntro = "Hi, I'm";
  this.moto = "This is how I spend my time."
  this.jobTitle = "Web Developer";

  return this;
});
