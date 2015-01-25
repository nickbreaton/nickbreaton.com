app.controller("MapController", ["$scope", "$rootScope", "MapStyle", function ($scope, $rootScope, MapStyle) {
  var canvas;
  var parent;

  setTimeout(function () {
    $scope.pinActive = true;
  }, 1500);

  setTimeout(function () {
    $scope.pinActive = false;
  }, 3000);

  $rootScope.mapWidth = undefined;

  if (google.maps.event) {
    google.maps.event.addDomListener(window, 'resize', function () {
      canvas = document.getElementById('map-canvas');
      parent = canvas.parentNode;

      if ($rootScope.mapWidth != parent.getBoundingClientRect().width) {
        create();
        $rootScope.mapWidth = parent.getBoundingClientRect().width;
      }
    });
  }

  // make sure event runs every time controller is activated
  window.dispatchEvent(new Event('resize'));

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

      var customMapType = new google.maps.StyledMapType(style, {name: 'Custom Style'});

      map.mapTypes.set(randId, customMapType);
    }
  }

}]);
