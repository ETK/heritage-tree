app.controller('PeopleController', function ($scope, $state, people) {

  $scope.people = people;
  console.log(people[0])

});
