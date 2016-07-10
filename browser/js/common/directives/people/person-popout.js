app.directive('personPopout', function ($rootScope, PeopleFactory) {
  return {
    restrict: 'E',
    scope: {
      person: '='
    },
    templateUrl: 'views/people/person-popout.html',
    link: function (scope) {
      scope.update = function(updates) {
        return PeopleFactory.updatePerson(scope.person.id, updates);
      }
    }
  }
});
