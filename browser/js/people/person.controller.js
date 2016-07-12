app.controller('PersonController', function ($scope, $state, people, person, PeopleFactory) {
  $scope.people = people;
  $scope.person = person;

  $scope.update = function(updates) {
    return PeopleFactory.updatePerson(scope.person.id, updates);
  }

  $scope.addParent = function(parent) {
    return PeopleFactory.addParent($scope.person, parent)
    .then( function(updatedPerson) {
      $scope.person = updatedPerson;
      $scope.parent = '';
    });
  }

  $scope.addChild = function(child) {
    return PeopleFactory.addChild($scope.person, child)
    .then( function(updatedPerson) {
      $scope.person = updatedPerson;
      $scope.child = '';
    });
  }

  $scope.addSpouse = function(spouse) {
    return PeopleFactory.addSpouse($scope.person, spouse)
    .then( function(updatedPerson) {
      $scope.person = updatedPerson;
      $scope.spouse = '';
    });
  }

});
