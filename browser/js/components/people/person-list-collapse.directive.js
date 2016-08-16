app.directive('personListCollapse', function ($rootScope, PeopleFactory) {
  return {
    restrict: 'E',
    scope: {
      person: '='
    },
    templateUrl: 'views/people/person-list-collapse.html',
    link: function (scope) {
      scope.update = function(updates) {
        return PeopleFactory.updatePerson(scope.person.id, updates);
      }
    }
  }
});
