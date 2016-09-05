app.directive('personListCollapse', function ($rootScope, PeopleFactory) {
  return {
    restrict: 'E',
    scope: {
      person: '='
    },
    templateUrl: 'components/people/personList/personListCollapse.html',
    link: function (scope) {
      scope.update = function(updates) {
        return PeopleFactory.updatePerson(scope.person.id, updates);
      }

      console.log($rootScope.user)
    }
  }
});
