app.controller('PersonController', function ($scope, $rootScope, $state, people, person, PeopleFactory, milestones, Title) {
  $scope.edittable = $rootScope.user && $rootScope.user.is_admin;
  $scope.people = people;
  $scope.person = person;
  $scope.person.milestones = milestones;
  Title.setTitle($scope.person.identifier);

  $scope.update = function(updates) {
    return PeopleFactory.updatePerson(scope.person.id, updates);
  }

  $scope.addParent = function(parent) {
    if(typeof parent === 'string') { // person is new
      return PeopleFactory.createPerson(parent)
      .then(function(newPerson) {
        return $scope.addParent(newPerson);
      })
    } else {
      return PeopleFactory.addParent($scope.person, parent)
      .then( function(updatedPerson) {
        $scope.person = updatedPerson;
        $scope.parent = '';
      });
    }
  }

  $scope.addChild = function(child) {
    if(typeof child === 'string') { // person is new
      return PeopleFactory.createPerson(child)
      .then(function(newPerson) {
        return $scope.addChild(newPerson);
      })
    } else {
      return PeopleFactory.addChild($scope.person, child)
      .then( function(updatedPerson) {
        $scope.person = updatedPerson;
        $scope.child = '';
      });
    }
  }

  $scope.addSpouse = function(spouse) {
    if(typeof spouse === 'string') { // person is new
      return PeopleFactory.createPerson(spouse)
      .then(function(newPerson) {
        return $scope.addSpouse(newPerson);
      })
    } else {
      return PeopleFactory.addSpouse($scope.person, spouse)
      .then( function(updatedPerson) {
        $scope.person = updatedPerson;
        $scope.spouse = '';
      });
    }
  }

});
