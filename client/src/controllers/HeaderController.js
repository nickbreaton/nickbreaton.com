app.controller("HeaderController", ["$scope", "$location", "$rootScope", function ($scope, $location, $rootScope) {
  $scope.pageButtons = [
    new PageButton("About", "/"),
    new PageButton("Contact", "/contact/"),
    new PageButton("Résumé", "/resume/"),
  ];

  $scope.socialButtons = [
    new SocialButton("github.svg", "https://github.com/nbreaton/"),
  ];

  $scope.title = "Hi, I'm Nick Breaton.";
  $scope.positition = "Front End Developer"
  $scope.subtitle = "This is how I spend my time.";

  function activateCurrentLink () {
    $rootScope.htmlTitle = "Nick Breaton";

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
}]);
