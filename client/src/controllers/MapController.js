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
