app.controller("MapController", ["$scope", "$rootScope", function ($scope, $rootScope) {
  // $rootScope.isMapReady = function () {
  //   if ($rootScope.mapTimer === 0) {
  //     $rootScope.mapTimer = 1500;
  //     setTimeout(function () {
  //       $rootScope.mapTimer = 0;
  //     }, $rootScope.mapTimer);
  //
  //     return true;
  //   }
  //   return false;
  // }

  var canvas = document.getElementById('map-canvas');
  var parent = canvas.parentNode;

  if (google.maps.event) {
    google.maps.event.addDomListenerOnce(window, 'resize', create);
  }


  function create () {
    if (google) {
      var style = [{"featureType":"all","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7c9b8b"},{"visibility":"on"}]}];

      var letters = "ABCDEFGHIJKLMNOPQRSTUV";
      var randId = "";

      for (var i = 0; i < 10; i++) {
        randId += letters[Math.floor(Math.random() * letters.length)];
      }

      var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(35.7303443,-78.8570691),
        mapTypeId : randId
      };

      var map = new google.maps.Map(canvas, mapOptions);

      var customMapType = new google.maps.StyledMapType(style, {name: 'Custom Style'});

      map.mapTypes.set(randId, customMapType);


      google.maps.event.addListenerOnce(map, 'idle', function(){
        google.maps.event.addDomListenerOnce(window, 'resize', create);
      });
    }
  }

  // make sure event runs every time controller is activated
  window.dispatchEvent(new Event('resize'));
}]);
