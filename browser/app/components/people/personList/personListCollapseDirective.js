app.directive('personListCollapse', function (PeopleFactory) {
  return {
    restrict: 'E',
    scope: {
      person: '=',
      edittable: '=?'
    },
    templateUrl: 'components/people/personList/personListCollapse.html',
    link: function (scope) {

      scope.update = function(updates) {
        return PeopleFactory.updatePerson(scope.person.id, updates);
      }

    }
  }
});
