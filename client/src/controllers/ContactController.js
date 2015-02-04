app.controller("ContactController", function ($scope) {
  $scope.filter = new Filter();
  $scope.message = {};
  $scope.message.body = "";

  $scope.links = [
    new Link("contact@nickbreaton.com", "mailto:contact@nickbreaton.com"),
    new Link("LinkedIn", "https://www.linkedin.com/in/nbreaton"),
    new Link("GitHub", "https://github.com/nbreaton"),
    new Link("Twitter", "https://twitter.com/nicholasbreaton", true)
  ]

  // make textarea expand to content
  $scope.$watch("message.body", function () {
    var el = document.getElementById("contact-textarea");

    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  });

  $scope.submit = function () {
    var fail = false;

    if ($scope.message.email != /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/g ) {
      console.log(fail);
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
});
