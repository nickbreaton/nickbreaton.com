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
