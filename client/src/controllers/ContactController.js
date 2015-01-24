app.controller("ContactController", ["$scope", function ($scope) {
  $scope.mapWidth = window.innerWidth;

  newMap();

  function newMap () {
    var parent = document.getElementById("map-frame");
    parent.innerHTML = "" ;



    var map = document.createElement("iframe");
    map.setAttribute("src", "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d51823.1516831172!2d-78.86496550000001!3d35.72752245000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1422086301536");
    map.setAttribute("class", "map");
    map.setAttribute("width", window.innerWidth);
    map.setAttribute("height", parent.getBoundingClientRect().height + 200);
    map.setAttribute("style", "margin-top: -100px");

    var cover = document.createElement("div");
    cover.setAttribute("class", "cover");

    parent.appendChild(map);
    parent.appendChild(cover);
  }

  window.onresize = function () {
    newMap();
    $scope.$apply();
  }
}]);

// [{"featureType":"all","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#7c9b8b"},{"visibility":"on"}]}]
