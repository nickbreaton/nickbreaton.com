app.controller("ClockController", ["$scope", function ($scope) {
  createIntervals($scope);


  function createIntervals ($scope) {
    $scope.intervals = [];

    for (var i = 1; i <= 60; i++) {
      var size = "normal";

      if (i % 5 === 0) {
        size = "medium";
      }

      if (i % 15 === 0) {
        size = "large";
      }

      $scope.intervals.push({
        id : i,
        type : size
      });
    }
  }

}]);
