app.controller("CompatibilityController", ["$scope", function ($scope) {
  $scope.error = "Please update your browser to use this site.";

  var testCanvas = document.createElement("canvas");

  $scope.supported = !((testCanvas.getContext) ? true : false);

}]);
