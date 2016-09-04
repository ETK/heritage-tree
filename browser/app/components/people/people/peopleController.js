app.controller('PeopleController', function ($scope, people, Title) {
  Title.setTitle('Family Members');

  $scope.people = people;

});
