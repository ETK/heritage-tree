app.directive('personListCollapse', function (PeopleFactory, $rootScope) {
  return {
    restrict: 'E',
    scope: {
      person: '=',
      edittable: '=?'
    },
    templateUrl: 'components/people/personList/personListCollapse.html',
    link: function (scope) {
      scope.edittable = $rootScope.user && $rootScope.user.is_admin;

      scope.update = function(updates) {
        return PeopleFactory.updatePerson(scope.person.id, updates);
      }

    }
  }
});
