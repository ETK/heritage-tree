app.controller('PersonController', function ($scope, $state, people, person, PeopleFactory) {
  $scope.people = people;
  $scope.person = person;

  $scope.update = function(updates) {
    return PeopleFactory.updatePerson(scope.person.id, updates);
  }

  $scope.addChild = function() {
    
  }

});
