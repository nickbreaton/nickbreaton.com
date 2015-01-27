app.factory("SiteInfo", function () {
  this.firstName = "Nick";
  this.lastName = "Breaton";
  this.name = this.firstName + " " + this.lastName;
  this.nameIntro = "Hi, I'm";
  this.moto = "This is how I spend my time."
  this.jobTitle = "Web Developer";

  return this;
});
