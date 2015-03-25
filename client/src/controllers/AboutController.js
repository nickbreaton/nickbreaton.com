app.controller("AboutController", function ($scope, $http) {
  var urls = [];
  var responses = [];

  $scope.getContent = function (url) {
    if (urls.indexOf(url) == -1) {
      console.log('Requesting from '+ url);
      urls.push(url);
      $http.get('/static/content/about/' + url + '.txt').
        success(function(data, status, headers, config) {
          responses.push('\n' + data);
        });
    }

    return responses;
  }
});
