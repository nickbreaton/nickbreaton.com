app.controller("ContactController", function ($scope, $http) {
  $scope.filter = new Filter();
  $scope.submitted = false;
  $scope.message = {
    body : {
      text : "",
      error : false
    }
  };

  $scope.links = [
    new Link("nick@breaton.com", "mailto:nick@breaton.com"),
    new Link("GitHub", "https://github.com/nbreaton"),
    new Link("LinkedIn", "https://www.linkedin.com/in/nbreaton"),
    new Link("Twitter", "https://twitter.com/nicholasbreaton", true)
  ]

  $scope.inputs = [
    new Input("name", "text", "What is your name?"),
    new Input("email", "email", "Where can I email you back?"),
    new Input("subject", "text", "What is this about?"),
    new Input("filter", "number", $scope.filter.one + " + " + $scope.filter.two + " =")
  ]

  // make textarea expand to content
  $scope.$watch("message.body", function () {
    var el = document.getElementById("contact-textarea");

    el.style.height = "0px";
    el.style.height = el.scrollHeight + "px";
  });

  $scope.submit = function () {
    // regex for email validation: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/g

    // clear errors from past fails
    $scope.message["name"].error = false;
    $scope.message["subject"].error = false;
    $scope.message["body"].error = false;

    // check all blank feilds besides body
    wsCheck("name");
    wsCheck("subject");
    wsCheck("body");

    // check human life
    if ($scope.filter.one + $scope.filter.two != $scope.message.filter.text) {
      $scope.message.filter.error = true;
    }

    // check valid email
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!re.test($scope.message.email.text)) {
      $scope.message.email.error = true;
    }

    // don't submit if errors
    for (var id in $scope.message) {
      if ($scope.message[id].error) {
        return;
      }
    }

    // build submission json
    var submit = {
      name : $scope.message.name.text,
      email : $scope.message.email.text,
      subject : $scope.message.subject.text,
      body : $scope.message.body.text
    }

    // send json
    $http.post("/api/contact/", submit)
      .success(function() {
        $scope.submitted = true;
        window.scrollTo(0, 0);
      });


    // check for white space
    function wsCheck (id) {
      var text = $scope.message[id].text;

      if (text == null) {
        text = "";
      }

      if (text == "") {
        $scope.message[id].text = null;
        $scope.message[id].error = true;
      }
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

  function Input(identifier, type, placeholder) {
    this.class = identifier;
    this.name = identifier;
    this.type = type;
    this.placeholder = placeholder;

    this.getClass = function () {
      var err = "";

      if ($scope.message[this.name].error) {
        err = "error";
      }

      return this.class + " " + err;
    }

    this.removeError = function () {
      $scope.message[this.name].error = false;
    }

    $scope.message[this.name] = {
      text : "",
      error : false
    }
  }

});
